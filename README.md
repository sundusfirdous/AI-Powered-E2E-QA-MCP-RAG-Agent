# AI-Powered E2E QA Automation Agent

An AI-driven QA automation workflow that combines **Playwright, MCP, RAG, AI agents, failure analysis, LLM evaluation, and CI/CD quality gates** to support the E2E testing lifecycle — from requirements analysis and test planning to exploratory testing, test generation, execution, failure analysis, healing, evaluation, and reporting.

The project uses **SauceDemo** as the application under test.

---

## 🚀 Overview

Traditional E2E automation usually requires QA engineers to manually:

* Analyze requirements
* Create test scenarios
* Write automation scripts
* Execute tests
* Investigate failures
* Maintain automation
* Prepare QA reports

This project demonstrates an AI-assisted QA workflow where **RAG, MCP, AI agents, and Playwright** work together to support these activities.

### End-to-End Workflow

```text
User Story
    ↓
RAG Knowledge Retrieval
    ↓
AI Test Planning
    ↓
Exploratory Testing
    ↓
Playwright Test Generation
    ↓
Test Execution
    ↓
Failure Analysis
    ↓
Automation Healing
    ↓
AI / LLM Evaluation
    ↓
CI/CD Quality Gate
    ↓
QA Reporting
```

---

# ✨ Key Features

## 🤖 AI QA Agent

The AI QA Agent coordinates the overall QA workflow and works with specialized agents for:

* Test planning
* Test generation
* Test healing
* QA analysis

Agent definitions are stored under:

```text
.github/agents/
```

---

## 🧠 RAG-Based QA Knowledge

The project uses **Retrieval-Augmented Generation (RAG)** to provide the AI workflow with project-specific QA knowledge.

The knowledge base contains:

* Requirements
* Existing test cases
* Known bugs
* QA guidelines

Knowledge files:

```text
rag/knowledge/
├── requirements.md
├── test_cases.md
├── known_bugs.md
└── qa_guidelines.md
```

The RAG pipeline uses:

* Python
* Sentence Transformers
* ChromaDB
* Semantic similarity search

---

## 🔌 MCP Integration

The project uses the **Model Context Protocol (MCP)** to connect AI agents with QA and development tools.

Current MCP architecture:

```text
                         ┌─────────────────────────────┐
                         │        USER / QA ENGINEER   │
                         │   User Story / QA Request   │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                    ┌────────────────────────────────────┐
                    │       AI E2E QA AGENT               │
                    │   Complete QA Workflow Orchestrator │
                    └────────────────┬───────────────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
        ┌────────────────┐  ┌─────────────────┐  ┌─────────────────┐
        │    QA RAG MCP  │  │ TEST PLANNER    │  │   GITHUB MCP    │
        │   qa-rag       │  │     AGENT       │  │                 │
        └───────┬────────┘  └────────┬────────┘  └─────────────────┘
                │                    │
                ▼                    │
        ┌────────────────┐           │
        │ RAG MCP Server │           │
        │ mcp_server.py  │           │
        └───────┬────────┘           │
                ▼                    ▼
        ┌────────────────┐   ┌──────────────────────┐
        │ retrieve.py    │   │ PLAYWRIGHT TEST MCP  │
        └───────┬────────┘   └──────────┬───────────┘
                ▼                       │
        ┌────────────────┐              │
        │    ChromaDB    │              │
        └───────┬────────┘              │
                ▼                       ▼
        ┌────────────────┐       ┌───────────────┐
        │ QA KNOWLEDGE   │       │   BROWSER     │
        │                │       │  EXPLORATION  │
        │ Requirements   │       └───────┬───────┘
        │ Test Cases     │               │
        │ QA Guidelines  │               ▼
        │ Known Bugs     │       ┌───────────────┐
        └────────────────┘       │ TEST PLAN     │
                                 └───────┬───────┘
                                         │
                                         ▼
                            ┌────────────────────────┐
                            │ TEST GENERATOR AGENT    │
                            │                         │
                            │ Playwright Test MCP     │
                            └───────────┬────────────┘
                                        │
                                        ▼
                            ┌────────────────────────┐
                            │ PLAYWRIGHT E2E TESTS    │
                            │ tests/saucedemo-        │
                            │ checkout/               │
                            └───────────┬────────────┘
                                        │
                                        ▼
                            ┌────────────────────────┐
                            │    TEST EXECUTION       │
                            │   Chromium / Playwright │
                            └───────────┬────────────┘
                                        │
                                  ┌─────┴─────┐
                                  │           │
                                  ▼           ▼
                              PASS        FAILURE
                                  │           │
                                  │           ▼
                                  │  ┌────────────────────┐
                                  │  │ TEST HEALER AGENT  │
                                  │  │                    │
                                  │  │ Playwright Test MCP│
                                  │  └─────────┬──────────┘
                                  │            │
                                  │            ▼
                                  │      Debug / Diagnose
                                  │            │
                                  │       ┌────┴────┐
                                  │       ▼         ▼
                                  │   Fix Test   App Defect
                                  │       │         │
                                  │       └────┬────┘
                                  │            ▼
                                  │         Re-run
                                  │            │
                                  └────────────┤
                                               ▼
                                  ┌────────────────────────┐
                                  │     QA REPORTING       │
                                  │                        │
                                  │ Test Results           │
                                  │ Defects                │
                                  │ Evidence               │
                                  │ Healing Results        │
                                  └───────────┬────────────┘
                                              │
                                              ▼
                                  ┌────────────────────────┐
                                  │ test-evidence/         │
                                  │ reports/               │
                                  │ screenshots/           │
                                  └────────────────────────┘

```

### QA RAG MCP

The project contains a custom QA RAG MCP server:

```text
rag/mcp_server.py
```

It exposes QA knowledge retrieval to the AI workflow.

Primary tool:

```text
retrieve_qa_context
```

### MCP Configuration

MCP configuration is maintained in:

```text
.vscode/mcp.json
```

---

# 🏗️ Overall Architecture

```text
                         ┌──────────────────────┐
                         │      User Story      │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │     AI QA Agent      │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │     RAG Knowledge    │
                         │ Requirements / Tests │
                         │ Bugs / QA Guidelines │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │       MCP Layer      │
                         │  QA RAG / Playwright │
                         │       / GitHub       │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │    AI Test Planner   │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ Playwright Generator │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │   E2E Test Execution │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ Failure Analysis &   │
                         │ Automation Healing   │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │   AI / LLM Evaluation│
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │    CI/CD Quality     │
                         │        Gate          │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │      QA Reports      │
                         └──────────────────────┘
```

---

# 🧠 RAG Architecture

The RAG component converts the project's QA knowledge into searchable embeddings.

```text
                 QA Knowledge
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
    Requirements   Test Cases   Known Bugs
          │           │           │
          └───────────┼───────────┘
                      ↓
                QA Guidelines
                      ↓
                Text Ingestion
                      ↓
            Sentence Transformers
                      ↓
                  Embeddings
                      ↓
                  ChromaDB
                      ↓
             Similarity Search
                      ↓
             Relevant QA Context
                      ↓
                  AI Agent
```

### Example

```text
Query:
checkout mandatory fields and validation

             ↓

RAG Retrieval

             ↓

Relevant QA Context

• Checkout requirements
• Existing validation tests
• Known checkout defects
• QA guidelines

             ↓

AI Test Planning / Analysis
```

This allows the AI workflow to use **project-specific context** instead of relying only on generic LLM knowledge.

---

# 🔌 MCP Architecture

The custom QA RAG MCP server connects the RAG knowledge base with AI agents.

```text
AI Agent
   │
   ↓
MCP Client
   │
   ↓
QA RAG MCP Server
   │
   ↓
retrieve_qa_context
   │
   ↓
RAG Retrieval
   │
   ↓
ChromaDB
   │
   ↓
QA Knowledge
```

Other MCP integrations support browser automation, Playwright testing, and GitHub workflows.

---

# 🎭 Playwright E2E Automation

Playwright is used for browser-based E2E automation of SauceDemo.

The tests are organized around individual checkout scenarios instead of using one large monolithic test.

```text
tests/
├── saucedemo-checkout/
│   ├── tc-01-cart-review.spec.js
│   ├── tc-02-valid-checkout.spec.js
│   ├── tc-03-empty-validation.spec.js
│   ├── tc-04-invalid-checkout-data.spec.js
│   ├── tc-05-order-overview.spec.js
│   ├── tc-06-cancel-controls.spec.js
│   ├── tc-07-browser-back.spec.js
│   ├── tc-08-order-completion.spec.js
│   ├── tc-09-authentication-context.spec.js
│   └── tc-10-boundary-multi-item.spec.js
│
└── seed.spec.ts
```

Shared SauceDemo helpers are maintained in:

```text
tests/support/saucedemo.js
```

These helpers include reusable functionality for areas such as:

* Login
* Cart operations
* Checkout
* Test data
* Known-bug handling

---

# 📋 Test Planning

The project contains an AI-generated / AI-assisted checkout test plan:

```text
specs/
└── saucedemo-checkout-test-plan.md
```

The test planning workflow considers:

* User stories
* Acceptance criteria
* Existing test coverage
* Retrieved RAG context
* Known defects
* Negative scenarios
* Boundary scenarios

---

# 🧪 Test Coverage

The SauceDemo E2E workflow covers:

* Authentication
* Login
* Logout
* Product selection
* Add to cart
* Cart review
* Product removal
* Checkout
* Customer information
* Mandatory-field validation
* Invalid checkout data
* Whitespace-only input
* Checkout overview
* Order completion
* Cancel controls
* Browser back navigation
* Direct navigation
* Empty-cart behavior
* Boundary scenarios
* Multi-item scenarios
* Checkout calculation behavior
* Known defect validation

---

# 📊 Current Test Execution

The current checkout suite contains:

```text
Checkout test files          10
Focused checkout tests       31
Additional seed test          1
--------------------------------
Total tests                  32
```

### Current execution result

```text
Genuine functional passes    27
Known defects/observations    5
Unexpected failures           0
Flaky tests                   0
Skipped tests                 0
```

### Known issues currently reproduced

| ID     | Test   | Classification    |
| ------ | ------ | ----------------- |
| BUG-01 | TC-01d | Known defect      |
| BUG-02 | TC-04a | Known defect      |
| BUG-04 | TC-04b | Known defect      |
| OBS-01 | TC-09c | Known observation |
| BUG-03 | TC-10c | Known defect      |

The five known-issue tests remain in the suite because they provide regression coverage for documented application behavior.

The functional QA result is therefore:

```text
27 genuine functional passes
5 known issues reproduced
0 unexpected failures
```

---

# 🐞 Known-Bug Handling

Known application defects are explicitly identified using the `@known-bug` tag and the project's `knownBug()` helper.

Conceptually:

```text
Test Execution
      │
      ↓
Assertion Failure
      │
      ├───────────────┐
      ↓               ↓
Known Application   Unexpected
Defect              Failure
      │               │
      ↓               ↓
Known-Bug           Investigate
Classification      Automation /
      │              Application
      ↓
QA Defect Report
```

This prevents known product defects from being confused with unexpected automation failures.

When an application defect is fixed, the corresponding test can be converted into a normal regression test.

---

# 🔧 Failure Analysis & Automation Healing

The project includes an AI-assisted failure analysis and healing workflow.

Evidence from this workflow is maintained under:

```text
test-evidence/
├── exploratory-testing-results.md
└── automation-healing-results.md
```

The intended distinction is:

```text
Test Failure
     ↓
Failure Analysis
     ↓
Is the failure caused by automation?
     │
     ├── YES → Analyze / Heal automation
     │
     └── NO  → Treat as application behavior
                  ↓
               Document defect
```

The goal is to prevent automation healing from hiding genuine application defects.

---

# 📸 Test Evidence

The project stores visual and written QA evidence under:

```text
test-evidence/
├── screenshots/
├── exploratory-testing-results.md
└── automation-healing-results.md
```

Current screenshot evidence includes scenarios such as:

* Cart review
* Valid checkout overview
* Required-field validation
* Invalid checkout data
* Order overview
* Order completion
* Multi-item checkout

---

# 🧠 AI / LLM Evaluation

The project also includes an AI evaluation stage for evaluating AI-generated QA outputs.

The evaluation architecture is:

```text
Golden Test Cases
       ↓
AI Generated Output
       ↓
┌─────────────────────┐
│ Heuristic Evaluation│
└──────────┬──────────┘
           │
           +
           │
┌──────────▼──────────┐
│   LLM-as-a-Judge    │
└──────────┬──────────┘
           ↓
      Hybrid Score
           ↓
      Quality Gate
```

### Evaluation dimensions

The evaluation considers:

* Correctness
* Completeness
* Clarity
* Actionability
* Overall quality

### Evaluation weighting

```text
Heuristic evaluation      40%
LLM-as-a-Judge             60%
```

The project uses a local Ollama model for the LLM evaluation workflow:

```text
Ollama
└── llama3.2:3b
```

These evaluation weights and thresholds are **project-defined rules** for this portfolio project.

---

# 🚦 CI/CD Quality Gate

GitHub Actions is used to automate project workflows.

Workflow files:

```text
.github/workflows/
├── copilot-setup-steps.yml
└── playwright.yml
```

The AI evaluation quality gate is defined as:

```text
Average final score >= 95%
AND
Failed evaluations = 0
```

If the project-defined quality criteria are not met, the evaluation workflow can fail the quality gate.

> The 95% threshold is a project-specific quality gate and is not presented as an industry-wide standard.

---

# 🛠️ Tech Stack

| Technology              | Purpose                |
| ----------------------- | ---------------------- |
| Playwright              | E2E browser automation |
| TypeScript / JavaScript | Test automation        |
| Python                  | RAG and MCP services   |
| MCP                     | AI-to-tool integration |
| ChromaDB                | Vector database        |
| Sentence Transformers   | Text embeddings        |
| Ollama                  | Local LLM evaluation   |
| Llama 3.2 3B            | LLM-as-a-Judge         |
| GitHub Copilot          | AI-assisted workflow   |
| GitHub Actions          | CI/CD automation       |
| Git                     | Version control        |

---

# 📁 Complete Project Structure

```text
AI-Powered-E2E-QA-Automation-Agent/
│
├── .github/
│   ├── agents/
│   │   ├── ai-e2e-qa-agent.agent.md
│   │   ├── playwright-test-generator.agent.md
│   │   ├── playwright-test-healer.agent.md
│   │   └── playwright-test-planner.agent.md
│   │
│   └── workflows/
│       ├── copilot-setup-steps.yml
│       └── playwright.yml
│
├── .vscode/
│   └── mcp.json
│
├── rag/
│   ├── knowledge/
│   │   ├── known_bugs.md
│   │   ├── qa_guidelines.md
│   │   ├── requirements.md
│   │   └── test_cases.md
│   │
│   ├── api.py
│   ├── ingest.py
│   ├── mcp_server.py
│   ├── requirements.txt
│   └── retrieve.py
│
├── specs/
│   └── saucedemo-checkout-test-plan.md
│
├── test-evidence/
│   ├── screenshots/
│   ├── automation-healing-results.md
│   └── exploratory-testing-results.md
│
├── tests/
│   ├── saucedemo-checkout/
│   │   ├── tc-01-cart-review.spec.js
│   │   ├── tc-02-valid-checkout.spec.js
│   │   ├── tc-03-empty-validation.spec.js
│   │   ├── tc-04-invalid-checkout-data.spec.js
│   │   ├── tc-05-order-overview.spec.js
│   │   ├── tc-06-cancel-controls.spec.js
│   │   ├── tc-07-browser-back.spec.js
│   │   ├── tc-08-order-completion.spec.js
│   │   ├── tc-09-authentication-context.spec.js
│   │   └── tc-10-boundary-multi-item.spec.js
│   │
│   ├── support/
│   │   └── saucedemo.js
│   │
│   └── seed.spec.ts
│
├── reports/
│   ├── ecommerce-checkout-test-report.md
│   └── QA_EXECUTION_REPORT.md
│
├── user_stories/
│   └── Saucedemo-ecommerce.md
│
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── QA_E2E_Prompt.md
└── README.md
```

### Generated / local-only directories

The repository may also contain local/generated artifacts such as:

```text
.playwright-mcp/
rag/__pycache__/
```

These are not part of the core source architecture and should not be presented as application components in the README.

---

# ▶️ Getting Started

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd AI-Powered-E2E-QA-Automation-Agent
```

## 2. Install Node dependencies

```bash
npm ci
```

## 3. Install Chromium

```bash
npx playwright install chromium
```

## 4. Run the checkout suite

```bash
npx playwright test tests/saucedemo-checkout --project=chromium
```

## 5. Run the complete Playwright suite

```bash
npx playwright test
```

## 6. Run with browser visible

```bash
npx playwright test --headed
```

## 7. View the Playwright HTML report

```bash
npx playwright show-report
```

---

# 🐍 Setup the RAG Environment

Navigate to the RAG directory:

```bash
cd rag
```

Create a Python virtual environment:

```bash
python -m venv venv
```

### Windows

```powershell
.\venv\Scripts\Activate.ps1
```

### Install Python dependencies

```bash
pip install -r requirements.txt
```

### Build the knowledge base

```bash
python ingest.py
```

The RAG knowledge base is stored locally using ChromaDB.

Generated vector-database and Python cache files are excluded from the Git repository.

---

# 📄 QA Reports

The project maintains two primary QA reports:

```text
reports/
├── ecommerce-checkout-test-report.md
└── QA_EXECUTION_REPORT.md
```

### Ecommerce Checkout Test Report

Provides a concise view of:

* Test execution
* Functional results
* Known defects
* Test coverage
* QA observations

### QA Execution Report

Provides a detailed technical view of:

* Test execution
* Automation architecture
* Known-bug handling
* Defect classification
* RAG architecture
* MCP integration
* AI evaluation
* CI/CD quality gates
* Reproduction steps

---

# 🎯 Project Goals

This project demonstrates practical integration of:

```text
AI
 +
RAG
 +
MCP
 +
Playwright
 +
E2E Automation
 +
Failure Analysis
 +
Automation Healing
 +
LLM Evaluation
 +
CI/CD
```

The project explores how AI agents can assist QA engineers with:

* Requirement analysis
* QA knowledge retrieval
* Test planning
* Exploratory testing
* Test generation
* Browser automation
* Failure analysis
* Automation healing
* Known-defect tracking
* AI output evaluation
* Quality gates
* QA reporting

The goal is not to replace QA engineering. The goal is to demonstrate how **AI and automation can be integrated into a structured, practical E2E QA engineering workflow.**

---

# 👩‍💻 Author

**Sundus Firdous**

AI Automation Engineer | SDET
