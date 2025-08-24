import React, { useState } from 'react';
import './MultimodalPage.css';

// A sample ComfyUI workflow JSON structure for demonstration.
// In a real scenario, this would come from the uploaded file.
const MOCK_WORKFLOW_JSON = {
  "nodes": [
    { "id": 5, "type": "CLIPTextEncode", "properties": {}, "widgets_values": ["beautiful scenery nature glass bottle landscape, purple galaxy, bokeh"] },
    { "id": 6, "type": "CLIPTextEncode", "properties": {}, "widgets_values": ["text, watermark, characters, branding"] },
    { "id": 8, "type": "EmptyLatentImage", "properties": {}, "widgets_values": [512, 512, 1] },
    { "id": 3, "type": "KSampler", "properties": {}, "widgets_values": [12345, "fixed", 8, 20, "euler", "normal", 1] }
  ],
  // This is a custom addition for this prototype to easily identify which widgets are inputs.
  "input_mapping": {
    "positive_prompt": { "node_id": 5, "widget_index": 0 },
    "negative_prompt": { "node_id": 6, "widget_index": 0 },
    "seed": { "node_id": 3, "widget_index": 0 },
    "steps": { "node_id": 3, "widget_index": 2 }
  }
};

// --- Main MultimodalPage Component ---
const MultimodalPage = () => {
    const [workflow, setWorkflow] = useState(null);
    const [formState, setFormState] = useState({});
    const [tasks, setTasks] = useState([]);
    const [fileName, setFileName] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // For this demo, we'll just use our mock JSON.
                    // In a real app: const parsedJson = JSON.parse(e.target.result);
                    const parsedJson = MOCK_WORKFLOW_JSON;
                    setWorkflow(parsedJson);
                    setFileName(file.name);
                    generateFormState(parsedJson);
                } catch (error) {
                    alert('Error parsing JSON file!');
                    console.error(error);
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid JSON file.');
        }
    };

    const generateFormState = (wf) => {
        const initialState = {};
        if (!wf.input_mapping) return;
        for (const [key, value] of Object.entries(wf.input_mapping)) {
            const node = wf.nodes.find(n => n.id === value.node_id);
            if (node) {
                initialState[key] = node.widgets_values[value.widget_index];
            }
        }
        setFormState(initialState);
    };

    const handleInputChange = (key, value) => {
        setFormState(prev => ({ ...prev, [key]: value }));
    };

    const handleRunWorkflow = () => {
        const newTask = {
            id: Date.now(),
            name: fileName || 'Sample Workflow',
            status: 'running',
            resultUrl: null,
        };
        setTasks(prev => [newTask, ...prev]);

        // Simulate backend processing
        setTimeout(() => {
            setTasks(prev => prev.map(task =>
                task.id === newTask.id
                ? { ...task, status: 'completed', resultUrl: `https://picsum.photos/seed/${newTask.id}/512` }
                : task
            ));
        }, 3000);
    };

    return (
        <div className="multimodal-page-container">
            <h2 className="multimodal-page-title">Multi-modal Studio (ComfyUI)</h2>

            <div className="workflow-upload-section">
                <h3 className="section-title">1. Upload Workflow</h3>
                <input type="file" accept=".json" onChange={handleFileUpload} />
                {fileName && <p>Loaded: {fileName}</p>}
            </div>

            {workflow && (
                <div className="workflow-form-section">
                    <h3 className="section-title">2. Configure Inputs</h3>
                    <div className="dynamic-form">
                        {Object.entries(formState).map(([key, value]) => (
                            <div className="form-field" key={key}>
                                <label htmlFor={key}>{key.replace(/_/g, ' ')}</label>
                                <input
                                    type={typeof value === 'number' ? 'number' : 'text'}
                                    id={key}
                                    value={value}
                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <button className="run-workflow-button" onClick={handleRunWorkflow}>Run Workflow</button>
                </div>
            )}

            <div className="workflow-tasks-section">
                <h3 className="section-title">3. Tasks & Results</h3>
                <div className="task-list">
                    {tasks.length === 0 && <p>No tasks run yet.</p>}
                    {tasks.map(task => (
                        <div className="task-card" key={task.id}>
                            <div className="task-info">
                                <div><strong>Workflow:</strong> {task.name}</div>
                                <div><strong>Status:</strong> {task.status}</div>
                            </div>
                            <div className="task-result">
                                {task.status === 'completed' ? (
                                    <img src={task.resultUrl} alt="Generated result" />
                                ) : (
                                    <div>Processing...</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MultimodalPage;
