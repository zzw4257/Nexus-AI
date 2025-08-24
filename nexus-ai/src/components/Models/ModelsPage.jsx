import React, { useState, useEffect, useCallback } from 'react';
import * as ollama from '../../api/ollama';
import FineTuningWizard from '../FineTuning/FineTuningWizard';
import './ModelsPage.css';

// --- ModelCard Sub-Component ---
const ModelCard = ({ model, onAction }) => {
    const isRunning = model.status === 'Running';
    const handleAction = (action) => onAction(action, model.name);

    return (
        <div className="model-card">
            <div className="model-card-header">
                <h3 className="model-name">{model.name}</h3>
                <span className={`model-status ${isRunning ? 'running' : 'stopped'}`}>{model.status}</span>
            </div>
            <div className="model-meta">
                <span>Size: {model.displaySize}</span> | <span>Updated: {model.modified}</span>
            </div>
            <div className="model-actions">
                <button className="model-action-button" onClick={() => handleAction(isRunning ? 'stop' : 'start')} disabled={model.isProcessing}>
                    {isRunning ? 'Stop' : 'Start'}
                </button>
                <button className="model-action-button delete" onClick={() => handleAction('delete')} disabled={isRunning || model.isProcessing}>
                    Delete
                </button>
            </div>
        </div>
    );
};

// --- Main ModelsPage Component ---
const ModelsPage = () => {
    const [models, setModels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pullTarget, setPullTarget] = useState('');
    const [isPulling, setIsPulling] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    const fetchModels = useCallback(async () => {
        setIsLoading(true);
        const fetchedModels = await ollama.getLocalModels();
        setModels(fetchedModels.map(m => ({ ...m, isProcessing: false })));
        setIsLoading(false);
    }, []);

    useEffect(() => { fetchModels(); }, [fetchModels]);

    const handleAction = useCallback(async (action, modelName) => {
        setModels(prev => prev.map(m => m.name === modelName ? { ...m, isProcessing: true } : m));
        switch(action) {
            case 'start': await ollama.startModel(modelName); break;
            case 'stop': await ollama.stopModel(modelName); break;
            case 'delete': await ollama.deleteModel(modelName); break;
            default: console.error('Unknown action');
        }
        await fetchModels();
    }, [fetchModels]);

    const handlePullModel = async () => {
        if (!pullTarget) return;
        setIsPulling(true);
        await ollama.pullModel(pullTarget);
        setPullTarget('');
        setIsPulling(false);
        await fetchModels();
    };

    return (
        <>
            {isWizardOpen && <FineTuningWizard onClose={() => setIsWizardOpen(false)} />}
            <div className="models-page-container">
                <div className="models-page-header">
                    <h2 className="models-page-title">Local Model Management (Ollama)</h2>
                    <div className="page-actions">
                        <button className="page-action-button primary" onClick={() => setIsWizardOpen(true)}>
                            + Fine-tune a Model
                        </button>
                        <div className="pull-model-section">
                            <input type="text" className="pull-model-input" placeholder="e.g., 'llama3:8b'" value={pullTarget} onChange={(e) => setPullTarget(e.target.value)} disabled={isPulling} />
                            <button className="pull-model-button" onClick={handlePullModel} disabled={isPulling || !pullTarget}>
                                {isPulling ? 'Pulling...' : 'Pull Model'}
                            </button>
                        </div>
                    </div>
                </div>
                {isLoading ? <div>Loading models...</div> : (
                    <div className="model-grid">
                        {models.map(model => <ModelCard key={model.name} model={model} onAction={handleAction} />)}
                    </div>
                )}
            </div>
        </>
    );
};

export default ModelsPage;
