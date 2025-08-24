import React, { useState, useEffect } from 'react';
import { useUnifiedModels } from '../../hooks/useUnifiedModels';
import './FineTuningWizard.css';

// --- Wizard Steps Components ---

const Step1_SelectModel = ({ onSelect, selectedModel, models, isLoading }) => (
    <div>
        <h3 className="wizard-step-title">Step 1: Select a Base Model</h3>
        {isLoading ? <div>Loading models...</div> : (
            <ul className="model-selection-list">
                {models.flatMap(group => group.options).map(model => (
                    <li key={model.id} onClick={() => onSelect(model)} className={selectedModel?.id === model.id ? 'selected' : ''}>
                        {model.name}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const Step2_UploadData = () => (
    <div>
        <h3 className="wizard-step-title">Step 2: Upload Dataset</h3>
        <p>Upload your dataset in JSONL format.</p>
        <input type="file" disabled />
        <p><small>Note: File upload is disabled in this prototype.</small></p>
    </div>
);

const Step3_Configure = () => (
    <div>
        <h3 className="wizard-step-title">Step 3: Configure Hyperparameters</h3>
        <div className="dynamic-form">
            <div className="form-field">
                <label>Epochs</label><input type="number" defaultValue="3" />
            </div>
            <div className="form-field">
                <label>Learning Rate</label><input type="text" defaultValue="1e-5" />
            </div>
        </div>
    </div>
);

const Step4_Monitor = ({ selectedModel }) => {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        setLogs([`[${new Date().toLocaleTimeString()}] Starting fine-tuning job for model: ${selectedModel.name}`]);
        const interval = setInterval(() => {
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Epoch 1/3 - Loss: ${(Math.random() * 0.5 + 0.1).toFixed(4)}`]);
        }, 2000);
        return () => clearInterval(interval);
    }, [selectedModel]);

    return (
        <div>
            <h3 className="wizard-step-title">Step 4: Monitor Training</h3>
            <p>Training in progress...</p>
            <div className="terminal-output" style={{ height: '20vh', backgroundColor: '#0D0221' }}>
                {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
};

// --- Main Wizard Component ---

const FineTuningWizard = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedModel, setSelectedModel] = useState(null);
    const { models, isLoading } = useUnifiedModels();

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1_SelectModel onSelect={setSelectedModel} selectedModel={selectedModel} models={models} isLoading={isLoading} />;
            case 2: return <Step2_UploadData />;
            case 3: return <Step3_Configure />;
            case 4: return <Step4_Monitor selectedModel={selectedModel} />;
            default: return null;
        }
    };

    return (
        <div className="wizard-overlay">
            <div className="wizard-container">
                <header className="wizard-header">
                    <h2 className="wizard-title">Fine-Tuning Wizard</h2>
                    <button className="wizard-close-button" onClick={onClose}>&times;</button>
                </header>
                <main className="wizard-content">
                    {renderStep()}
                </main>
                <footer className="wizard-footer">
                    <button className="wizard-button" onClick={() => setStep(s => s - 1)} disabled={step === 1}>Back</button>
                    {step < 4 ? (
                        <button className="wizard-button primary" onClick={() => setStep(s => s + 1)} disabled={!selectedModel}>Next</button>
                    ) : (
                        <button className="wizard-button primary" onClick={onClose}>Finish</button>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default FineTuningWizard;
