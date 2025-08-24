import React, { useState, useRef, useCallback, useEffect } from 'react';
// The following imports assume `reactflow` was successfully installed.
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import React Flow styles

import { useUnifiedModels } from '../../hooks/useUnifiedModels';
import './StudioPage.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'User Input', topic: 'Artificial Intelligence' },
    position: { x: 100, y: 150 },
  },
  {
    id: '2',
    type: 'llmCall',
    data: {
        label: 'LLM Call: Brainstorm Topics',
        model: 'local-mistral:latest',
        prompt: 'Brainstorm 5 sub-topics related to {input.topic}.'
    },
    position: { x: 400, y: 100 },
  },
];

const initialEdges = [ { id: 'e1-2', source: '1', target: '2' } ];

let id = 3; // Start IDs after initial nodes
const getId = () => `${id++}`;

// --- Inspector Panel for LLM Call Node ---
const LlmCallInspector = ({ node, models, isLoading }) => {
    // In a real app, we'd use a proper state management library
    // to update the node data. For now, this is a visual-only mock.
    return (
        <div>
            <div><strong>Node:</strong> {node.data.label}</div>
            <hr/>
            <label htmlFor="model-select">Model:</label>
            <select id="model-select" defaultValue={node.data.model} style={{width: "100%", marginTop: "5px"}}>
                {isLoading ? (
                    <option>Loading models...</option>
                ) : (
                    models.map(group => (
                        <optgroup label={group.label} key={group.label}>
                            {group.options.map(model => (
                                <option key={model.id} value={model.id}>{model.name}</option>
                            ))}
                        </optgroup>
                    ))
                )}
            </select>
            <label htmlFor="prompt-text" style={{marginTop: "10px", display: "block"}}>Prompt:</label>
            <textarea id="prompt-text" defaultValue={node.data.prompt} rows={8} style={{width: "100%", marginTop: "5px"}}/>
        </div>
    );
}


const StudioPage = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const { models, isLoading: modelsLoading } = useUnifiedModels();

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)),[setEdges]);
  const onNodeClick = (event, node) => setSelectedNode(node);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);

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
  }

  return (
    <div className="studio-page-container">
        <ReactFlowProvider>
            <aside className="studio-panel node-library">
                <h2 className="node-library-title">Node Library</h2>
                <div className="node-category">
                    <h3 className="node-category-title">Core</h3>
                    <div className="draggable-node" onDragStart={(e) => onDragStart(e, 'LLM Call')} draggable>LLM Call</div>
                </div>
            </aside>

            <main className="canvas-container" ref={reactFlowWrapper}>
                <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onInit={setReactFlowInstance} onDrop={onDrop} onDragOver={onDragOver} onNodeClick={onNodeClick} fitView>
                    <Controls />
                    <Background />
                </ReactFlow>
            </main>

            <aside className="studio-panel inspector-panel">
                <h2 className="inspector-title">Inspector</h2>
                <div className="inspector-content">
                    {renderInspectorContent()}
                </div>
            </aside>
        </ReactFlowProvider>
    </div>
  );
};

export default StudioPage;
