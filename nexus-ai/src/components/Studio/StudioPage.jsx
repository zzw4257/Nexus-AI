import React, { useState, useRef, useCallback, useEffect } from 'react';
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

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'User Input', topic: 'Artificial Intelligence' }, position: { x: 100, y: 150 } },
  { id: '2', type: 'llmCall', data: { label: 'LLM Call: Brainstorm', model: 'local-mistral:latest', prompt: 'Brainstorm 5 sub-topics related to {input:1.topic}.' }, position: { x: 400, y: 100 } },
  { id: '3', type: 'output', data: { label: 'Final Output' }, position: { x: 700, y: 150 } },
];
const initialEdges = [ { id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3' }];

let id = 4;
const getId = () => `${id++}`;

const LlmCallInspector = ({ node, models, isLoading }) => (
    <div>
        <div><strong>Node:</strong> {node.data.label}</div><hr/>
        <label htmlFor="model-select">Model:</label>
        <select id="model-select" defaultValue={node.data.model} style={{width: "100%", marginTop: "5px"}}>
            {isLoading ? <option>Loading...</option> : models.map(group => (
                <optgroup label={group.label} key={group.label}>
                    {group.options.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
                </optgroup>
            ))}
        </select>
        <label htmlFor="prompt-text" style={{marginTop: "10px", display: "block"}}>Prompt:</label>
        <textarea id="prompt-text" defaultValue={node.data.prompt} rows={8} style={{width: "100%", marginTop: "5px"}}/>
    </div>
);

const StudioPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const { models, isLoading: modelsLoading } = useUnifiedModels();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const addLog = (message, type = 'info') => setLogs(prev => [...prev, { ts: new Date().toLocaleTimeString(), message, type }]);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onNodeClick = (event, node) => setSelectedNode(node);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setLogs([]);
    addLog("Starting agent execution simulation...");

    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const adj = new Map(nodes.map(node => [node.id, []]));
    edges.forEach(edge => adj.get(edge.source)?.push(edge.target));

    const startNode = nodes.find(n => n.type === 'input');
    if (!startNode) {
        addLog("Execution failed: No 'input' node found.", 'error');
        setIsRunning(false);
        return;
    }

    addLog(`Found start node: [${startNode.id}]`);
    let currentNodeId = startNode.id;

    while(currentNodeId) {
        const node = nodeMap.get(currentNodeId);
        addLog(`Executing node [${node.id}]: ${node.data.label}`);
        await new Promise(res => setTimeout(res, 300)); // Simulate work

        if (node.type === 'llmCall') {
            addLog(`   -> Simulating LLM call with model: ${node.data.model}`);
            addLog(`   -> Prompt: "${node.data.prompt}"`);
        }

        if (node.type === 'output') {
            addLog(`Reached end node [${node.id}].`);
            currentNodeId = null;
        } else {
            const nextNodeIds = adj.get(currentNodeId);
            if (!nextNodeIds || nextNodeIds.length === 0) {
                addLog("Execution stopped: No outgoing edge found.", 'error');
                currentNodeId = null;
            } else {
                currentNodeId = nextNodeIds[0];
                addLog(`   -> Traversing to next node: [${currentNodeId}]`);
            }
        }
        await new Promise(res => setTimeout(res, 200));
    }

    addLog("Simulation finished.");
    setIsRunning(false);
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode = {
        id: getId(),
        type: type === 'LLM Call' ? 'llmCall' : 'default',
        position,
        data: { label: `${type} Node` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const renderInspectorContent = () => {
    if (!selectedNode) {
        return <div>Select a node to inspect its properties.</div>;
    }
    if (selectedNode.type === 'llmCall') {
        return <LlmCallInspector node={selectedNode} models={models} isLoading={modelsLoading} />;
    }
    return (
        <div>
            <div><strong>Node ID:</strong> {selectedNode.id}</div>
            <div><strong>Type:</strong> {selectedNode.type}</div>
            <div><strong>Label:</strong> {selectedNode.data.label}</div>
        </div>
    );
  };

  return (
    <div className="studio-page-container">
        <ReactFlowProvider>
            <aside className="studio-panel node-library">
                <h2 className="node-library-title">Node Library</h2>
                <div className="node-category"><h3 className="node-category-title">Core</h3>
                    <div className="draggable-node" onDragStart={(e) => onDragStart(e, 'LLM Call')} draggable>LLM Call</div>
                </div>
            </aside>
            <div className="canvas-container">
                <div className="studio-header">
                    <button className="run-button" onClick={handleRunSimulation} disabled={isRunning}>
                        {isRunning ? 'Running...' : 'Run Agent'}
                    </button>
                </div>
                <div className="react-flow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onInit={setReactFlowInstance} onDrop={onDrop} onDragOver={onDragOver} onNodeClick={onNodeClick} fitView>
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
                <div className="inspector-content">{renderInspectorContent()}</div>
            </aside>
        </ReactFlowProvider>
    </div>
  );
};

export default StudioPage;
