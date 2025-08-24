# Nexus AI - Unified AI Development & Deployment OS

## 1. Vision & Goals

Nexus AI is an ambitious project to build the ultimate, seamlessly integrated AI development and deployment platform. It aims to eliminate barriers between cloud and local resources, tools, and models, allowing developers, researchers, and creators to experiment, create, and deploy next-generation AI applications in a unified environment.

This repository contains the frontend prototype for the Nexus AI application, built with React and Vite.

## 2. Current Status (As of this commit)

This project is currently a **functional UI prototype**. We have built the foundational UI and interaction frameworks for the core features outlined in the Product Requirements Document (PRD). Most backend interactions are currently **simulated or mocked**, with the exception of the live OpenAI API integration.

**Completed Prototypes:**
-   **Dashboard:** A static dashboard displaying mock resource usage for cloud and local nodes.
-   **Local Model Management:** An interactive UI for managing local Ollama models. It currently uses a mocked API layer but is structured to be connected to a real backend.
-   **Agent Studio:** A powerful, node-based visual editor for building AI agent workflows.
    -   Supports dragging and dropping nodes.
    -   Features an inspector panel to modify node properties (e.g., labels, prompts, models).
    -   Includes a simulation engine that logs the execution flow of the agent.
    -   **Live OpenAI Integration:** Can make real API calls to an OpenAI endpoint from `llmCall` nodes.
-   **Multi-modal (ComfyUI) Studio:** A UI for managing ComfyUI workflows. It supports mock JSON uploads, dynamically generates input forms, and simulates a task queue.
-   **Developer Studio:** A UI framework for a future IDE where users can develop custom tools.
-   **Settings:** A page for managing API keys for cloud providers.

## 3. Local Setup and Running

To run this project on your local machine, you will need [Node.js](https://nodejs.org/) (version 18 or higher recommended) and `npm`.

1.  **Navigate to the project directory:**
    ```bash
    cd nexus-ai
    ```

2.  **Install dependencies:**
    This project uses several dependencies, including `react` and `reactflow`. The installation process may have been blocked in the agent's environment. Run the following command to ensure all dependencies are installed locally:
    ```bash
    npm install
    ```

3.  **Run the development server:**
    Once the dependencies are installed, you can start the Vite development server:
    ```bash
    npm run dev
    ```
    The application should now be running, typically on `http://localhost:5173`.

## 4. Project Structure

The main application code is located in the `src/` directory.
-   `src/api/`: Contains mock API files that simulate backend calls (e.g., for Ollama).
-   `src/components/`: Contains the main React components for each feature/page (e.g., `Dashboard/`, `Studio/`).
-   `src/hooks/`: Contains custom React hooks, such as `useUnifiedModels`.
-   `src/App.jsx`: The main application component that handles routing and layout.
-   `src/index.css`: Global styles.

## 5. Known Issues

Certain limitations were encountered in the development environment. These are not bugs in the application code but are useful to be aware of. For a detailed explanation and recommended local solutions, please see:
-   [ISSUES_AND_SOLUTIONS.md](./ISSUES_AND_SOLUTIONS.md)
