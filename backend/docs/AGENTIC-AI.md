# Agentic AI Integration Strategy (Semantic Kernel)

## 1. Executive Summary: The Paradigm Shift
The **Smart-Incident-Management-Platform (SIMP)** moves beyond traditional CRUD-based ticket tracking. By integrating **Microsoft Semantic Kernel**, the system transitions from a passive database into an active **Autonomous Management System**.

| Feature | Standard CRUD (Passive) | SIMP Agentic (Active) |
| :--- | :--- | :--- |
| **Incident Creation** | User fills out 10+ form fields manually. | User types a sentence; AI extracts metadata & routes it. |
| **Root Cause (RCA)** | Human manually parses logs for errors. | AI scans logs, identifies patterns, and suggests fixes. |
| **SLA Management** | Static alerts sent *after* a breach occurs. | AI predicts breaches 2 hours early and re-assigns. |
| **Documentation** | Humans spend hours writing post-mortems. | AI generates IEEE 829 reports in seconds. |

---

## 2. Structural Integration (Clean Architecture)
The AI is not an "add-on" service; it is baked into the **Application Layer** to ensure it has access to business logic while remaining decoupled from the UI.

* **The Kernel (Orchestrator):** Registered as a `Scoped` service in `Program.cs`. It acts as the CPU of the AI, managing state and chat history.
* **Native Plugins (The Hands):** C# wrappers located in `SIMP.Infrastructure`. These allow the AI to interact with your **PostgreSQL** repositories and **Service Bus**.
* **Semantic Plugins (The Brain):** YAML-based prompt templates in `SIMP.Application`. These define the "reasoning" logic for triage and analysis.
* **Vector Memory:** Utilizing **pgvector** on PostgreSQL to store past incident resolutions, allowing the AI to "remember" how similar bugs were fixed in 2025.

---

## 3. The "Big Four" AI Agents
We are implementing four distinct "Personas" that the Kernel can adopt based on the user's intent.

### A. The Triage Agent
* **Trigger:** `POST /api/incidents` (User creation).
* **Logic:** Uses a Semantic Function to analyze raw input text.
* **Action:** Automatically populates `Category`, `Priority`, and `SupportGroup`. It reduces "Category Fatigue" for end-users.

### B. The Investigator (RCA) Agent
* **Trigger:** Incident status change to `InProgress` (High/Critical only).
* **Logic:** Calls Native Plugins to fetch the last 50 lines of system logs.
* **Action:** Correlates log errors with the incident description and posts an **Internal Note** with a suggested resolution.

### C. The Post-Mortem Agent
* **Trigger:** Incident status change to `Resolved`.
* **Logic:** Aggregates the `Activity Timeline`, `Comments`, and `Resolution` field.
* **Action:** Generates a structured **Post-Incident Report (PIR)** using the IEEE 829 standard for documentation.

### D. The Chat Assistant
* **Trigger:** Sidebar Chat UI (Next.js).
* **Logic:** Multi-tool orchestration.
* **Action:** Answers natural language queries like *"Which database tickets are currently breaching SLA?"* by calling the `AnalyticsPlugin`.

---

## 4. Orchestration & Technical Flow
SIMP utilizes **Auto Function Calling**. Instead of hard-coding "if-statements," the LLM decides which C# tool to use based on the function description.

1.  **Request:** User submits a prompt through the Next.js frontend.
2.  **Intercept:** The .NET Minimal API passes the prompt to `IAgentService`.
3.  **Planner:** The Kernel analyzes the available `[KernelFunction]` attributes in your plugins.
4.  **Execution:** The Kernel executes the C# code (e.g., `_db.Incidents.GetByIdAsync()`).
5.  **Synthesis:** The result is fed back to the LLM to generate a human-readable response.

---

## 5. Technical Implementation Checklist

### Phase 1: Environment Setup
- [ ] Install NuGet: `Microsoft.SemanticKernel` & `Microsoft.SemanticKernel.Connectors.OpenAI`.
- [ ] Enable `pgvector` on your PostgreSQL instance.
- [ ] Register the Kernel in `Program.cs`:
  ```csharp
  builder.Services.AddKernel().AddOpenAIChatCompletion(modelId, apiKey);
  ```

### Phase 2: Plugin Development
- [ ] **Native:** Create `IncidentPlugin.cs` with methods for `AssignTicket` and `UpdateStatus`.
- [ ] **Native:** Create `LogPlugin.cs` to interface with Azure Monitor or local logs.
- [ ] **Semantic:** Define `Triage.yaml` and `RCA.yaml` prompt templates in the Application layer.

### Phase 3: API & Security
- [ ] Create `POST /api/agent/chat` to handle streaming responses to the frontend.
- [ ] Implement **Guardrails**: Ensure the AI cannot delete records or access data outside the user's `OrganizationId`.
- [ ] Set up **Human-in-the-Loop**: The AI can *suggest* a resolution, but a human agent must click "Approve" to close the ticket.

---

