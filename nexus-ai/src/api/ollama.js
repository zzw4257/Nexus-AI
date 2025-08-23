// --- Mock Ollama API ---
// This file simulates interactions with a local Ollama instance.
// In a real application, these functions would execute shell commands
// or make HTTP requests to the Ollama API.

const MOCK_MODELS = [
  {
    name: 'llama3:8b',
    modified: '3 days ago',
    size: 4700000000, // in bytes
    status: 'Stopped',
  },
  {
    name: 'mistral:latest',
    modified: '5 days ago',
    size: 4100000000,
    status: 'Running',
  },
  {
    name: 'codellama:13b',
    modified: '2 weeks ago',
    size: 7300000000,
    status: 'Stopped',
  },
];

// Simulates `ollama list`
export const getLocalModels = async () => {
  console.log('API: Fetching local models...');
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  console.log('API: Responding with mock models.');
  return MOCK_MODELS.map(model => ({
    ...model,
    // Convert size to GB for display
    displaySize: (model.size / 1024 / 1024 / 1024).toFixed(1) + ' GB',
  }));
};

// Simulates `ollama pull <modelName>`
export const pullModel = async (modelName) => {
  console.log(`API: Simulating pull for "${modelName}"...`);
  await new Promise(res => setTimeout(res, 3000)); // Longer delay for pull
  console.log(`API: Pull simulation for "${modelName}" complete.`);
  // In a real app, you would invalidate the model list cache here.
  return { success: true };
};

// Simulates stopping a model
export const stopModel = async (modelName) => {
  console.log(`API: Simulating STOP for "${modelName}"...`);
  const model = MOCK_MODELS.find(m => m.name === modelName);
  if (model) model.status = 'Stopped';
  await new Promise(res => setTimeout(res, 300));
  console.log(`API: STOP simulation for "${modelName}" complete.`);
  return { success: true };
};

// Simulates starting a model
export const startModel = async (modelName) => {
  console.log(`API: Simulating START for "${modelName}"...`);
  // Stop any other running models
  MOCK_MODELS.forEach(m => m.status = 'Stopped');
  const model = MOCK_MODELS.find(m => m.name === modelName);
  if (model) model.status = 'Running';
  await new Promise(res => setTimeout(res, 500));
  console.log(`API: START simulation for "${modelName}" complete.`);
  return { success: true };
};


// Simulates `ollama rm <modelName>`
export const deleteModel = async (modelName) => {
    console.log(`API: Simulating DELETE for "${modelName}"...`);
    const index = MOCK_MODELS.findIndex(m => m.name === modelName);
    if (index > -1) {
        MOCK_MODELS.splice(index, 1);
    }
    await new Promise(res => setTimeout(res, 500));
    console.log(`API: DELETE simulation for "${modelName}" complete.`);
    return { success: true };
};
