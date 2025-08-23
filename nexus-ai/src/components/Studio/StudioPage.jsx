import React, { useState, useRef, useCallback } from 'react';
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

import './StudioPage.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'User Input' },
    position: { x: 100, y: 150 },
  },
  {
    id: '2',
    data: { label: 'Tool: Web Search' },
    position: { x: 400, y: 100 },
  },
  {
    id: '3',
    data: { label: 'LLM Call: Summarize' },
    position: { x: 400, y: 250 },
  },
    {
    id: '4',
    type: 'output',
    data: { label: 'Final Output' },
    position: { x: 700, y: 175 },
  },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e3-4', source: '3', target: '4' },
];

let id = 5; // Start IDs after initial nodes
const getId = () => `${id++}`;

const StudioPage = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: 'default',
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

  return (
    <div className="studio-page-container">
        <ReactFlowProvider>
            {/* Left Panel: Node Library */}
            <aside className="studio-panel node-library">
                <h2 className="node-library-title">Node Library</h2>
                <div className="node-category">
                    <h3 className="node-category-title">Input</h3>
                    <div className="draggable-node" onDragStart={(e) => onDragStart(e, 'Input')} draggable>User Input</div>
                </div>
                <div className="node-category">
                    <h3 className="node-category-title">Tools</h3>
                    <div className="draggable-node" onDragStart={(e) => onDragStart(e, 'Web Search')} draggable>Web Search</div>
                    <div className="draggable-node" onDragStart={(e) => onDragStart(e, 'Calculator')} draggable>Calculator</div>
                </div>
                <div className="node-category">
                    <h3 className="node-category-title">LLM</h3>
                    <div className="draggable-node" onDragStart={(e) => onDragStart(e, 'LLM Call')} draggable>LLM Call</div>
                </div>
            </aside>

            {/* Center Panel: Canvas */}
            <main className="canvas-container" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    fitView
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </main>

            {/* Right Panel: Inspector */}
            <aside className="studio-panel inspector-panel">
                <h2 className="inspector-title">Inspector</h2>
                <div className="inspector-content">
                    {selectedNode ? (
                        <div>
                            <div>Node ID: {selectedNode.id}</div>
                            <div>Type: {selectedNode.type}</div>
                            <div>Label: {selectedNode.data.label}</div>
                            <div>Position: {Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)}</div>
                        </div>
                    ) : (
                        <div>Select a node to inspect its properties.</div>
                    )}
                </div>
            </aside>
        </ReactFlowProvider>
    </div>
  );
};

export default StudioPage;
