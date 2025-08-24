import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useUnifiedModels } from '../../hooks/useUnifiedModels';
import './StudioPage.css';

// --- Constants ---
const USER_API_KEY = 'sk-Q3EsPIoMUzEnhZapg1NYhgF2FvR9YVvuZTSPynitaujg2a6B';
const USER_BASE_URL = 'https://www.dmxapi.cn/v1';

// --- Initial Data ---
const initialNodes = [
  { id: '1', type: 'input', data: { label: 'User Input' }, position: { x: 50, y: 150 } },
  { id: '2', type: 'llmCall', data: { label: 'LLM Call: Joke', model: 'openai-gpt-3.5-turbo', prompt: 'Tell me a short joke about AI.' }, position: { x: 300, y: 150 } },
  { id: '3', type: 'output', data: { label: 'Final Output' }, position: { x: 600, y: 150 } },
];
const initialEdges = [ { id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3' }];

let id = 4;
const getId = () => `${id++}`;

// --- Inspector Panel Component ---
const InspectorPanel = ({ selectedNode, onUpdateNode, models, isLoading }) => {
    if (!selectedNode) { return <div className="inspector-content">Select a node to inspect.</div>; }

    const handleDataChange = (key, value) => {
        onUpdateNode(selectedNode.id, { ...selectedNode.data, [key]: value });
    };

    const renderNodeSpecificFields = () => {
        switch (selectedNode.type) {
            case 'llmCall':
                return (
                    <>
                        <label>Model:</label>
                        <select value={selectedNode.data.model || ''} onChange={(e) => handleDataChange('model', e.target.value)} style={{width: "100%"}}>
                            {isLoading ? <option>Loading...</option> : models.map(group => (
                                <optgroup label={group.label} key={group.label}>
                                    {group.options.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
                                </optgroup>
                            ))}
                        </select>
                        <label>Prompt:</label>
                        <textarea value={selectedNode.data.prompt || ''} onChange={(e) => handleDataChange('prompt', e.target.value)} rows={8} style={{width: "100%"}}/>
                    </>
                );
            case 'workflow':
                return (
                    <>
                        <label>Workflow:</label>
                        <select value={selectedNode.data.workflow || ''} onChange={(e) => handleDataChange('workflow', e.target.value)} style={{width: "100%"}}>
                            <option value="image_gen_v1.json">Image Gen v1</option>
                            <option value="video_enhance_v2.json">Video Enhance v2</option>
                        </select>
                    </>
                );
            default:
                return <small>Node has no specific properties.</small>;
        }
    };

    return (
        <div className="inspector-content">
            <label>Label:</label>
            <input type="text" value={selectedNode.data.label} onChange={(e) => handleDataChange('label', e.target.value)} style={{width: "100%"}}/>
            <hr/>
            {renderNodeSpecificFields()}
        </div>
    );
};

// --- Main Studio Page Component ---
const StudioPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const { models, isLoading: modelsLoading } = useUnifiedModels();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onUpdateNode = (id, data) => {
    setNodes((nds) => nds.map(node => node.id === id ? { ...node, data } : node));
    if (selectedNode && selectedNode.id === id) setSelectedNode(prev => ({ ...prev, data }));
  };

  const addLog = (message, type = 'info') => setLogs(prev => [...prev, { ts: new Date().toLocaleTimeString(), message, type }]);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onSelectionChange = ({ nodes }) => setSelectedNode(nodes[0] || null);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setLogs([]);
    addLog("Starting agent execution...");
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const adj = new Map(nodes.map(node => [node.id, []]));
    edges.forEach(edge => adj.get(edge.source)?.push(edge.target));
    const startNode = nodes.find(n => n.type === 'input');
    if (!startNode) { addLog("Execution failed: No 'input' node found.", 'error'); setIsRunning(false); return; }

    let currentNodeId = startNode.id;
    while (currentNodeId) {
        const node = nodeMap.get(currentNodeId);
        addLog(`Executing node [${node.id}]: ${node.data.label}`);
        await new Promise(res => setTimeout(res, 100));

        if (node.type === 'llmCall' && node.data.model?.includes('openai')) {
            addLog(`   -> Making REAL API call to ${USER_BASE_URL}...`);
            try {
                const modelIdentifier = node.data.model.replace('openai-', '');
                const response = await fetch(`${USER_BASE_URL}/chat/completions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${USER_API_KEY}` },
                    body: JSON.stringify({ model: modelIdentifier, messages: [{ role: "user", content: node.data.prompt }], temperature: 0.7 }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || 'Unknown API Error');
                const message = data.choices[0]?.message?.content;
                addLog(`   -> SUCCESS: ${message}`, 'success');
            } catch (error) {
                addLog(`   -> API ERROR: ${error.message}`, 'error');
            }
        } else if (node.type === 'llmCall') {
             addLog(`   -> (Mock) Simulating LLM call with model: ${node.data.model}`);
        } else if (node.type === 'workflow') {
             addLog(`   -> (Mock) Triggering ComfyUI workflow: ${node.data.workflow}`);
        }

        if (node.type === 'output') { addLog(`Reached end node [${node.id}].`); break; }
        const neighbors = adj.get(currentNodeId) || [];
        currentNodeId = neighbors[0] || null;
    }
    addLog("Execution finished.");
    setIsRunning(false);
  };

  const onDrop = useCallback((event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode = { id: getId(), type, position, data: { label: `${type} node` } };
      setNodes((nds) => nds.concat(newNode));
    }, [reactFlowInstance]);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="studio-page-container">
        <ReactFlowProvider>
            <aside className="studio-panel node-library">
                <h2 className="node-library-title">Node Library</h2>
                <div className="node-category"><h3 className="node-category-title">Core</h3>
                    <div className="draggable-node" onDragStart={(e) => onDragStart(e, 'llmCall')} draggable>LLM Call</div>
                    <div className="draggable-node" onDragStart={(e) => onDragStart(e, 'workflow')} draggable>Run Workflow</div>
                </div>
            </aside>
            <div className="canvas-container">
                <div className="studio-header"><button className="run-button" onClick={handleRunSimulation} disabled={isRunning}>{isRunning ? 'Running...' : 'Run Agent'}</button></div>
                <div className="react-flow-wrapper" style={{height: '100%', width: '100%'}}>
                    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onInit={setReactFlowInstance} onDrop={onDrop} onDragOver={onDragOver} onSelectionChange={onSelectionChange} fitView>
                        <Controls /><Background />
                    </ReactFlow>
                </div>
                <div className="log-panel">
                    <h3 className="log-panel-title">Execution Log</h3>
                    {logs.map((log, i) => <div key={i} className={`log-line ${log.type}`}>[{log.ts}] {log.message}</div>)}
                </div>
            </div>
            <aside className="studio-panel inspector-panel">
                <h2 className="inspector-title">Inspector</h2>
                <InspectorPanel selectedNode={selectedNode} onUpdateNode={onUpdateNode} models={models} isLoading={modelsLoading} />
            </aside>
        </ReactFlowProvider>
    </div>
  );
};

export default StudioPage;
