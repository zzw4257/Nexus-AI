// --- Mock Cloud Models API ---
// This file simulates fetching available models from cloud providers.
// In a real application, this might be a hardcoded list, or it could
// dynamically fetch models from each provider's API if they support it.

// We are assuming the user has provided valid API keys in the Settings page.
// This API just returns a list of popular models.

const MOCK_CLOUD_MODELS = [
  {
    id: 'openai-gpt-4-turbo',
    name: 'OpenAI: GPT-4 Turbo',
    provider: 'OpenAI',
  },
  {
    id: 'openai-gpt-3.5-turbo',
    name: 'OpenAI: GPT-3.5 Turbo',
    provider: 'OpenAI',
  },
  {
    id: 'anthropic-claude-3-opus',
    name: 'Anthropic: Claude 3 Opus',
    provider: 'Anthropic',
  },
  {
    id: 'anthropic-claude-3-sonnet',
    name: 'Anthropic: Claude 3 Sonnet',
    provider: 'Anthropic',
  },
  {
    id: 'google-gemini-1.5-pro',
    name: 'Google: Gemini 1.5 Pro',
    provider: 'Google',
  },
];

export const getCloudModels = async () => {
  console.log('API: Fetching cloud models...');
  // Simulate network delay
  await new Promise(res => setTimeout(res, 200));
  console.log('API: Responding with mock cloud models.');
  return MOCK_CLOUD_MODELS;
};
