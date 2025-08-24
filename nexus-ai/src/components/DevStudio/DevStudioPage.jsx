import React, { useState } from 'react';
import './DevStudioPage.css';

// --- Mock Data ---
const MOCK_FILE_SYSTEM = {
  'my_tools': {
    'web_search.py': 'def search(query: str) -> str:\n    """Performs a web search."""\n    # ... implementation ...\n    return "Search results for " + query',
    'calculator.py': 'def add(a: int, b: int) -> int:\n    """Adds two numbers."""\n    return a + b',
  },
  'config.json': '{ "version": "1.0" }',
};

// --- Main DevStudioPage Component ---
const DevStudioPage = () => {
    const [activeFile, setActiveFile] = useState('my_tools/web_search.py');

    const getFileContent = (path) => {
        const pathParts = path.split('/');
        if (pathParts.length === 1) {
            return MOCK_FILE_SYSTEM[pathParts[0]];
        } else {
            return MOCK_FILE_SYSTEM[pathParts[0]][pathParts[1]];
        }
    };

    return (
        <div className="dev-studio-container">
            {/* --- File Browser Panel --- */}
            <div className="dev-panel file-browser-panel">
                <h3 className="panel-title">File Browser</h3>
                <div className="file-tree">
                    <ul>
                        <li>
                            📁 my_tools
                            <ul>
                                <li
                                    className={`file-item ${activeFile === 'my_tools/web_search.py' ? 'active' : ''}`}
                                    onClick={() => setActiveFile('my_tools/web_search.py')}
                                >
                                    🐍 web_search.py
                                </li>
                                <li
                                    className={`file-item ${activeFile === 'my_tools/calculator.py' ? 'active' : ''}`}
                                    onClick={() => setActiveFile('my_tools/calculator.py')}
                                >
                                    🐍 calculator.py
                                </li>
                            </ul>
                        </li>
                        <li
                            className={`file-item ${activeFile === 'config.json' ? 'active' : ''}`}
                            onClick={() => setActiveFile('config.json')}
                        >
                            ⚙️ config.json
                        </li>
                    </ul>
                </div>
            </div>

            {/* --- Editor Panel --- */}
            <div className="dev-panel editor-panel">
                 <h3 className="panel-title">Editor: {activeFile}</h3>
                 <textarea
                    className="code-editor-textarea"
                    value={getFileContent(activeFile)}
                    readOnly
                 />
            </div>

            {/* --- Terminal Panel --- */}
            <div className="dev-panel terminal-panel">
                <h3 className="panel-title">Terminal</h3>
                <div className="terminal-output">
                    <div className="terminal-line">
                        <span className="prompt">nexus-cli&gt; </span>test my_tools/calculator.py
                    </div>
                    <div className="terminal-line">Running tests...</div>
                    <div className="terminal-line">✅ Test 'add(2, 2)' passed.</div>
                    <div className="terminal-line">✅ Test 'add(-1, 1)' passed.</div>
                    <div className="terminal-line">All tests passed!</div>
                </div>
            </div>
        </div>
    );
};

export default DevStudioPage;
