import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import ModelsPage from './components/Models/ModelsPage';
import StudioPage from './components/Studio/StudioPage';
import './App.css';

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'models':
        return <ModelsPage />;
      case 'studio':
        return <StudioPage />;
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
          <a href="#" className="nav-link">[Marketplace]</a>
          <a href="#" className="nav-link">[Settings]</a>
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
