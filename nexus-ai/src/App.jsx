import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import ModelsPage from './components/Models/ModelsPage';
import StudioPage from './components/Studio/StudioPage';
import SettingsPage from './components/Settings/SettingsPage';
import MultimodalPage from './components/Multimodal/MultimodalPage';
import DevStudioPage from './components/DevStudio/DevStudioPage';
import './App.css';

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'models':
        return <ModelsPage />;
      case 'studio':
        return <StudioPage />;
      case 'workflows':
        return <MultimodalPage />;
      case 'developer':
        return <DevStudioPage />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  const NavLink = ({ view, children }) => (
    <a
      href="#"
      className={`nav-link ${activeView === view ? 'active' : ''}`}
      onClick={() => setActiveView(view)}
    >
      {children}
    </a>
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">NEXUS AI - v0.1a</h1>
        <nav className="app-nav">
          <NavLink view="dashboard">[Dashboard]</NavLink>
          <NavLink view="models">[Models]</NavLink>
          <NavLink view="studio">[Studio]</NavLink>
          <NavLink view="workflows">[Workflows]</NavLink>
          <NavLink view="developer">[Developer]</NavLink>
          <NavLink view="settings">[Settings]</NavLink>
        </nav>
        <div className="user-menu">
          <a href="#" className="nav-link">[Logout]</a>
        </div>
      </header>
      <main className="app-main">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
