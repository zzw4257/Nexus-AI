import React, { useState } from 'react';
import './SettingsPage.css';

// --- Mock Data ---
// In a real app, this would be fetched from a secure store or backend.
const initialProviders = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '🤖',
    apiKey: '', // Initially empty
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: '📚',
    apiKey: 'sk-ant-xxxxxxxx', // Example of a saved key
  },
  {
    id: 'google',
    name: 'Google Gemini',
    logo: '✨',
    apiKey: '',
  },
];

// --- ApiKeyCard Sub-Component ---
const ApiKeyCard = ({ provider, onSave }) => {
  const [key, setKey] = useState(provider.apiKey);

  const handleSave = (e) => {
    e.preventDefault();
    onSave(provider.id, key);
    alert(`API Key for ${provider.name} saved!`); // Simple feedback
  };

  return (
    <div className="api-key-card">
      <div className="api-key-header">
        <span className="api-key-logo">{provider.logo}</span>
        <h3 className="api-key-provider-name">{provider.name}</h3>
      </div>
      <form className="api-key-form" onSubmit={handleSave}>
        <input
          type="password"
          className="api-key-input"
          placeholder={`Enter your ${provider.name} API Key`}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <div className="api-key-actions">
          <button type="button" className="api-key-button">Test</button>
          <button type="submit" className="api-key-button primary">Save</button>
        </div>
      </form>
    </div>
  );
};


// --- Main SettingsPage Component ---
const SettingsPage = () => {
  const [providers, setProviders] = useState(initialProviders);

  const handleSaveKey = (providerId, newKey) => {
    setProviders(prevProviders =>
      prevProviders.map(p =>
        p.id === providerId ? { ...p, apiKey: newKey } : p
      )
    );
  };

  return (
    <div className="settings-page-container">
      <h2 className="settings-page-title">API Key Management</h2>
      <div className="api-key-manager">
        {providers.map(provider => (
          <ApiKeyCard
            key={provider.id}
            provider={provider}
            onSave={handleSaveKey}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
