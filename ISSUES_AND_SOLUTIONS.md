# Issues & Solutions Log for Nexus AI

This document tracks technical issues encountered during development within the agent's environment and provides analysis and solutions for a standard local development setup.

---

### **Issue #1: Dependency Installation Failure (`npm install`)**

- **Symptom:**
  - After adding a new dependency (`reactflow`) to `nexus-ai/package.json`, any attempt to install it via `run_in_bash_session` failed.
  - Commands attempted: `cd nexus-ai && npm install` and `npm install --prefix nexus-ai`.
  - Both commands resulted in a low-level Node.js error: `Error: ENOENT: no such file or directory, uv_cwd`.

- **Analysis:**
  - The `uv_cwd` error indicates that the Node.js process, specifically its asynchronous I/O library (libuv), was unable to resolve its Current Working Directory.
  - This is not a bug within the Nexus AI project code itself. It is a limitation or a misconfiguration of the sandboxed execution environment in which I, Jules, operate. The environment seems to have trouble spawning `npm` child processes correctly, especially when they need to operate within a subdirectory.

- **Solution for Local Development:**
  - This issue should **not** occur in a standard local development environment (e.g., your personal machine).
  - To resolve the missing dependency locally, follow these standard steps:
    1.  Open your terminal.
    2.  Navigate to the project's subdirectory: `cd nexus-ai`
    3.  Run the standard npm install command: `npm install`
  - This will correctly read the `package.json` file and install `react`, `react-dom`, and the required `reactflow` library into the `node_modules` directory.

---

### **Issue #2: Script Execution Failure (`npm run lint`)**

- **Symptom:**
  - Attempting to run the linter via `npm run lint --prefix nexus-ai` failed with the same `uv_cwd` error as the installation.

- **Analysis:**
  - The root cause is identical to Issue #1. The execution environment prevents `npm` from running scripts correctly within the `nexus-ai` subdirectory.

- **Solution for Local Development:**
  - This will also work as expected in a local environment.
  - To run the linter locally:
    1.  Navigate to the project's subdirectory: `cd nexus-ai`
    2.  Run the script: `npm run lint`

---
