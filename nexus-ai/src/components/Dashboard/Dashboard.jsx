import React from 'react';
import './Dashboard.css';

const ProgressBar = ({ percentage, label }) => (
  <div className="resource-bar-container">
    <div className="resource-bar" style={{ width: `${percentage}%` }}>
      {label}
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Cloud Resources Card */}
        <div className="card">
          <h2 className="card-title">Cloud Resources</h2>
          <div className="resource-group">
            <div className="resource">
              <div className="resource-name">OpenAI API</div>
              <ProgressBar percentage={70} label="70%" />
              <div className="resource-meta">Cost: $12.34 (this month)</div>
            </div>
            <div className="resource">
              <div className="resource-name">Anthropic API</div>
              <ProgressBar percentage={35} label="35%" />
              <div className="resource-meta">Cost: $5.67 (this month)</div>
            </div>
          </div>
        </div>

        {/* Local Nodes Card */}
        <div className="card">
          <h2 className="card-title">Local Nodes</h2>
          <div className="resource-group">
            <div className="resource">
              <div className="resource-name">node-01 (Local) - <span style={{color: '#7CFC00'}}>ONLINE</span></div>
              <div className="resource-meta">GPU: RTX 4090</div>
              <div className="resource-meta">Util:</div>
              <ProgressBar percentage={50} />
              <div className="resource-meta">VRAM:</div>
              <ProgressBar percentage={75} />
            </div>
            <div className="resource">
                <div className="resource-name">node-02 (Cloud) - <span style={{color: '#A0A0A0'}}>OFFLINE</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="card">
        <h2 className="card-title">Recent Activity</h2>
        <ul className="activity-log-list">
          <li className="activity-log-item success">[10:34] Agent "research-bot" completed run successfully.</li>
          <li className="activity-log-item">[10:32] Model "llama3-8b" was stopped on node-01.</li>
          <li className="activity-log-item error">[10:30] ERROR: ComfyUI workflow "gen-video-01" failed.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
