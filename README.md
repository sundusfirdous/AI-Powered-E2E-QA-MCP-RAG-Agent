# AI-Powered E2E QA Automation Agent

An AI-driven QA automation workflow that combines **Playwright, MCP, RAG, and AI agents** to support the complete E2E testing lifecycle — from requirements analysis and test planning to test execution, failure analysis, and reporting.

The project uses **SauceDemo** as the application under test.

---

## 🚀 Overview

Traditional E2E automation usually requires QA engineers to manually analyze requirements, create test cases, write automation scripts, execute tests, and investigate failures.

This project demonstrates how an AI-assisted workflow can help automate these activities.

### Workflow

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
Failure Analysis & Healing
    ↓
QA Report
```

---

## ✨ Key Features

### 🤖 AI QA Agent

Orchestrates the overall QA workflow and coordinates the specialized testing agents.

### 🧠 RAG-Based QA Knowledge

Retrieves relevant QA information from a knowledge base containing:

* Requirements
* Existing test cases
* Known defects
* QA testing guidelines

### 🔌 MCP Integration

Uses the **Model Context Protocol (MCP)** to connect AI agents with testing and QA tools.

### 🎭 Playwright Automation

Uses Playwright for browser-based E2E testing of the SauceDemo application.

### 📋 AI Test Planning

Creates structured test plans based on:

* User stories
* Acceptance criteria
* Retrieved QA knowledge
* Existing test coverage
* Known defects
* Negative and boundary scenarios

### 🧪 Test Generation

Generates Playwright tests covering functional and negative E2E scenarios.

### 🔧 Failure Analysis & Healing

Analyzes failed tests and distinguishes between:

* Automation issues
* Application defects

Genuine automation issues can then be fixed and re-tested.

### 📊 QA Reporting

Produces test evidence and QA reports containing:

* Test coverage
* Execution results
* Defects
* Failure analysis
* Evidence

---

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │   User Story    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   AI QA Agent   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   RAG + MCP     │
                    │ QA Knowledge    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │  Test Planner   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   Playwright    │
                    │ Test Generation │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Test Execution  │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Failure Analysis│
                    │   & Healing     │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   QA Report     │
                    └─────────────────┘
```

---

## 🧠 RAG Architecture

The RAG component uses **ChromaDB** and **Sentence Transformers** to retrieve relevant QA knowledge.

```text
QA Knowledge
     │
     ├── Requirements
     ├── Test Cases
     ├── Known Bugs
     └── QA Guidelines
             ↓
        Text Embeddings
             ↓
          ChromaDB
             ↓
       Similarity Search
             ↓
       Relevant QA Context
             ↓
          AI Agent
```

Example:

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
```

This allows the AI workflow to use project-specific QA knowledge during test planning and analysis.

---

## 🔌 MCP Integration

MCP provides a standardized way for the AI workflow to interact with external tools.

```text
AI QA Agent
     │
     ├── QA RAG MCP
     │
     ├── Playwright MCP
     │
     ├── Playwright Test MCP
     │
     └── GitHub MCP
```

The QA RAG MCP server exposes the following tool:

```text
retrieve_qa_context
```

It retrieves relevant QA knowledge based on the agent's query.

---

## 🛠️ Tech Stack

| Technology              | Purpose                |
| ----------------------- | ---------------------- |
| Playwright              | E2E browser automation |
| TypeScript / JavaScript | Test automation        |
| Python                  | RAG and MCP services   |
| MCP                     | AI-to-tool integration |
| ChromaDB                | Vector database        |
| Sentence Transformers   | Text embeddings        |
| GitHub Copilot          | AI agent workflow      |
| Git                     | Version control        |

---

## 📁 Project Structure

```text
AI-Powered-E2E-QA-Automation-Agent/
│
├── .github/
│   ├── agents/
│   │   ├── ai-e2e-qa-agent.agent.md
│   │   ├── playwright-test-planner.agent.md
│   │   ├── playwright-test-generator.agent.md
│   │   └── playwright-test-healer.agent.md
│   │
│   └── workflows/
│       ├── copilot-setup-steps.yml
│       └── playwright.yml
│
├── rag/
│   ├── knowledge/
│   │   ├── requirements.md
│   │   ├── test_cases.md
│   │   ├── known_bugs.md
│   │   └── qa_guidelines.md
│   │
│   ├── ingest.py
│   ├── retrieve.py
│   ├── api.py
│   ├── mcp_server.py
│   └── requirements.txt
│
├── specs/
│   └── saucedemo-checkout-test-plan.md
│
├── tests/
│   └── saucedemo-checkout/
│
├── test-evidence/
│   ├── screenshots/
│   ├── exploratory-testing-results.md
│   └── automation-healing-results.md
│
├── reports/
│   └── ecommerce-checkout-test-report.md
│
├── user_stories/
│   └── Saucedemo-ecommerce.md
│
├── .gitignore
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 🧪 Test Coverage

The SauceDemo E2E workflow covers:

* User authentication
* Product selection
* Add to cart
* Cart review
* Product removal
* Checkout
* Mandatory field validation
* Invalid checkout data
* Order overview
* Order completion
* Navigation
* Browser back behavior
* Boundary scenarios
* Known defect validation

---

## ▶️ Getting Started

### 1. Install Node.js dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Run the tests

```bash
npx playwright test
```

### 4. Run tests with the browser visible

```bash
npx playwright test --headed
```

### 5. View the Playwright report

```bash
npx playwright show-report
```

---

## 🧠 Setup RAG

Navigate to the RAG directory:

```bash
cd rag
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Build the QA knowledge base:

```bash
python ingest.py
```

The knowledge base is stored locally using ChromaDB.

---

## 📊 Test Evidence

The project maintains evidence throughout the QA workflow.

### Evidence includes

* Exploratory testing results
* Automated test results
* Screenshots
* Failure analysis
* Healing results
* Known defect validation
* Final QA report

This makes the project more than a collection of Playwright scripts — it demonstrates an **end-to-end QA engineering workflow**.

---

## 🎯 Project Goals

This project demonstrates practical implementation of:

**AI + RAG + MCP + Playwright + E2E Test Automation**

It explores how AI agents can assist QA engineers with:

* Requirement analysis
* QA knowledge retrieval
* Test planning
* Test generation
* Browser automation
* Failure analysis
* Test healing
* QA reporting

---

## 👩‍💻 Author

**Sundus Firdous**

AI Automation Engineer | SDET

