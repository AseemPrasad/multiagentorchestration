# Multi-Agent Task Orchestration System

A lightweight, event-sourced platform where multiple AI agents collaborate to complete complex tasks.

## 🎯 Architecture
The system follows an **Event-Sourced Orchestration** pattern. Instead of agents calling each other directly, they interact via a central Orchestrator that maintains an immutable ledger of events.

### Agents
- **Planner Agent**: Decomposes user requests into actionable sub-tasks.
- **Researcher Agent**: Gathers context and information (currently simulated).
- **Writer Agent**: Synthesizes research into a structured draft report.
- **Reviewer Agent**: Evaluates the draft and can trigger dynamic branching loops for revisions or more research.

### Core Features
- **Dynamic Branching**: The Reviewer can send tasks back to the Writer or Researcher based on quality checks.
- **Event-Sourced Ledger**: Every state transition is recorded as an immutable event, providing a full audit trail and enabling "time-travel" debugging.
- **Real-time Visualization**: React Flow-based pipeline visualization shows the active agent and execution flow.

## 🛠️ Tech Stack
- **Backend**: FastAPI (Python), Pydantic (Models), Asyncio (Concurrency).
- **Frontend**: Next.js, React Flow (Graph Visualization), Lucide React (Icons), Tailwind CSS (Premium Aesthetics).

## 🚀 Architectural Decisions & Trade-offs
- **Polling vs WebSockets**: Currently uses **Polling** for simplicity in state updates every 2 seconds. While WebSockets provide lower latency, polling offers better reliability and easier state reconstruction over HTTP in this MVP.
- **Sync vs Async**: Agents are designed as **Async** functions to prevent blocking the main event loop, allowing the orchestrator to handle multiple tasks concurrently.
- **In-Memory Ledger**: State is currently stored in-memory for the demo. In a production environment, this would be backed by an immutable DB like PostgreSQL (with JSONB) or a dedicated event store.

## 🔍 Assumptions
- Agents are currently mocked with deterministic logic for demonstration of the orchestration flow.
- A "Failure" state is defined but not yet fully implemented for complex error recovery (Stretch Goal).

## 🔮 Future Improvements
- **LLM Integration**: Replacing mock logic with actual OpenAI/llama-based reasoning.
- **Parallel Research**: Allowing the Researcher to spawn multiple concurrent child tasks.
- **Persistent State**: Adding a database layer to allow task persistence across sessions.
- **Agent Configuration**: UI for toggling specific agents (e.g., "Skip Review").

---
