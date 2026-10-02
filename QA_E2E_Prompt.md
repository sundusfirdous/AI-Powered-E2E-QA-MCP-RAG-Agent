# End-to-End QA Workflow with Natural Language

## Workflow Overview

This prompt guides you through a complete end-to-end QA workflow using MCP servers and AI agents, from user story analysis through test planning, exploratory testing, automation, healing, reporting, and Git commit.

## Rules for Every Step

* Run all browser tests in Chrome (Chromium) only.
* Complete one step fully before starting the next.
* Provide a short status update after each completed step.
* If a browser action does not respond within 60 seconds, mark that check as `BLOCKED`, document the reason, and move on.
* Do not skip any workflow step.
* Use the user story as the primary source of acceptance criteria.
* Use RAG knowledge as supporting QA context, not as a replacement for the user story.
* Do not invent test results, defects, screenshots, or execution evidence.

---

# STEP 1: Read User Story

## Prompt

I need to start a new testing workflow.

Read the user story from:

`user_stories/Saucedemo-ecommerce.md`

Summarize the key requirements, acceptance criteria, application details, and testing scope.

## Expected Output

Provide:

* Summary of the user story
* Acceptance criteria
* Application URL
* Test credentials
* Key features to test
* Business rules
* Technical/testing constraints

After completing Step 1, provide a short status update.

---

# STEP 1.5: Retrieve QA Knowledge Using RAG

## Prompt

Now retrieve relevant QA knowledge from the `qa-rag` MCP server.

You MUST actually invoke the MCP tool:

`retrieve_qa_context`

Use a query based on the SauceDemo checkout user story and acceptance criteria.

The query should focus on:

* Checkout requirements
* Existing checkout test cases
* Mandatory field validation
* Known checkout defects
* QA testing guidelines
* Negative testing
* Boundary testing
* Navigation behavior
* Cart behavior
* Authentication behavior

## Important Rules

* Actually call `retrieve_qa_context`.
* Do not merely describe or simulate the RAG retrieval.
* Show the retrieved QA context before continuing to Step 2.
* Treat `user_stories/Saucedemo-ecommerce.md` as the primary source of acceptance criteria.
* Do not replace the user story with RAG results.
* Use RAG results as supporting QA knowledge.
* Avoid generating duplicate scenarios already covered by retrieved test cases.
* Consider known defects when designing negative and regression scenarios.
* Follow the retrieved QA testing guidelines.
* If RAG retrieval fails, report the failure and continue only if the user story provides enough information.

## Expected Output

Provide:

* Retrieved QA requirements
* Relevant existing test cases
* Relevant known defects
* Relevant QA testing guidelines
* Summary of how the retrieved context should influence test coverage

After completing Step 1.5, provide a short status update.

---

# STEP 2: Create Test Plan

## Prompt

Based on the user story and the retrieved RAG context, use the `playwright-test-planner` agent to create a comprehensive test plan.

The planner must:

1. Read the application URL and credentials from the user story.
2. Explore the application.
3. Understand all workflows mentioned in the acceptance criteria.
4. Use the RAG context as supporting QA knowledge.

Create a test plan covering:

* Happy path scenarios
* Negative scenarios
* Validation errors
* Empty fields
* Invalid data
* Special characters
* Edge cases
* Boundary conditions
* Navigation flows
* Browser back-button behavior
* UI element validation
* Cart behavior
* Authentication behavior
* Known defect regression scenarios

Save the test plan as:

`specs/saucedemo-checkout-test-plan.md`

Each test scenario must include:

* Test case ID, for example `TC-01`
* Clear test case title
* Acceptance criterion covered: AC1–AC5
* Detailed step-by-step instructions
* Expected result for each step
* Test data requirements

## Expected Output

* Complete test plan saved under `specs/`
* Organized test scenarios
* Coverage of AC1–AC5
* Relevant RAG-derived scenarios incorporated without duplication

After completing Step 2, provide a short status update.

---

# STEP 3: Perform Exploratory Testing

## Prompt

Now perform manual exploratory testing using Playwright MCP browser tools.

Read:

`specs/saucedemo-checkout-test-plan.md`

Use:

* Browser: Chromium only
* Viewport: 1280x720
* Do not resize the browser

Execute the test scenarios from the test plan.

For each scenario:

* Follow the documented steps.
* Verify expected results against actual behavior.
* Use reliable selectors.
* Record unexpected behavior.
* Identify potential defects.
* Capture screenshots at important states and error conditions.

Save screenshots under:

`test-evidence/screenshots/`

Document findings in:

`test-evidence/exploratory-testing-results.md`

The exploratory results must include:

* Test case ID
* PASS / FAIL / BLOCKED
* Actual result
* Expected result
* Observations
* Reliable selectors
* Bugs or inconsistencies
* Screenshot evidence where applicable

## Expected Output

* Manual test execution results
* Screenshots
* Exploratory testing findings
* Defects discovered
* Reliable selectors and UI behavior

After completing Step 3, provide a short status update.

---

# STEP 4: Generate Automation Scripts

## Prompt

Now create automated Playwright TypeScript tests using the `playwright-test-generator` agent.

Review:

`specs/saucedemo-checkout-test-plan.md`

and:

`test-evidence/exploratory-testing-results.md`

Use the exploratory testing results to:

* Reuse reliable selectors.
* Prefer stable IDs and `data-test` attributes.
* Use accessible roles where appropriate.
* Apply observed UI behavior.
* Incorporate discovered workarounds.
* Avoid fixed `waitForTimeout` calls.

Create TypeScript Playwright tests under:

`tests/saucedemo-checkout/`

Requirements:

* Use Playwright Test.
* Use TypeScript.
* Use `expect()` assertions.
* Use descriptive test names.
* Match test IDs and titles from the test plan.
* Follow Page Object Model principles where appropriate.
* Use proper `beforeEach` and `afterEach` hooks where needed.
* Use stable locators.
* Do not use fixed waits.
* Run using Chromium only.

After generating the tests, run:

```text
npx playwright test tests/saucedemo-checkout --project=chromium --reporter=line
```

## Expected Output

* TypeScript test files created under `tests/saucedemo-checkout/`
* Tests mapped to test-plan scenarios
* Initial automation execution results

After completing Step 4, provide a short status update.

---

# STEP 5: Execute and Heal Automation Tests

## Prompt

Execute all generated automation tests:

```text
npx playwright test tests/saucedemo-checkout --project=chromium --reporter=line
```

Identify all failures.

For each failing test, use the `playwright-test-healer` agent.

The healer should:

1. Analyze the failure.
2. Determine whether the problem is:

   * Selector
   * Timing
   * Assertion
   * Test data
   * Application behavior
   * Environment
3. Fix automation issues where appropriate.
4. Re-run the affected test.
5. Make a maximum of 3 healing attempts per test.

If a test still cannot be healed after 3 attempts:

* Use `test.fixme()` only when appropriate.
* Add a clear comment explaining the reason.
* Document the test as unresolved.

If the failure is caused by a genuine application defect:

* Do NOT change the assertion simply to make the test pass.
* Keep the test behaviorally correct.
* Record the defect in the test report.

Document:

* Initial pass/fail/blocked results
* Failing tests
* Healing attempts
* Fixes applied
* Final results
* Unresolved tests
* Real application defects

## Expected Output

* All automation tests executed
* Failed tests analyzed
* Appropriate failures healed
* Final automation results
* Healing summary
* Defect information

After completing Step 5, provide a short status update.

---

# STEP 6: Create Test Execution Report

## Prompt

Create a comprehensive test execution report using the results from:

Step 3:

`test-evidence/exploratory-testing-results.md`

Step 4:

Generated automation scripts

Step 5:

Automation execution and healing results

Save the report as:

`reports/ecommerce-checkout-test-report.md`

The report must include:

## Executive Summary

* Testing scope
* Environment
* Overall PASS/FAIL/BLOCKED summary

## Test Coverage

* Total test cases planned
* Total test cases executed
* Acceptance criteria covered
* Manual coverage
* Automation coverage
* Coverage gaps

## Manual Testing Results

* Exploratory testing results
* PASS/FAIL/BLOCKED status
* Observations
* Screenshots
* Defects discovered

Screenshots should reference:

`test-evidence/screenshots/`

## Automated Testing Results

* Initial execution results
* Final execution results
* Pass/fail counts
* Test suite summary

## Healing Summary

* Failed tests
* Healing attempts
* Changes made
* Tests remaining unresolved

## Defect Log

For each defect include:

* Bug ID
* Severity
* Title
* Description
* Steps to reproduce
* Expected behavior
* Actual behavior
* Evidence
* Environment

## Test Coverage Analysis

Explain:

* Which acceptance criteria are covered
* Manual versus automated coverage
* RAG-supported coverage
* Remaining gaps

## Next Steps

Document additional testing that would be useful.

Do not invent results or defects. Use only evidence generated during the workflow.

After completing Step 6, provide a short status update.

---

# STEP 7: Commit to Git Repository

## Repository

`https://github.com/reshma-pk/AI-E2EQAWorkflow-Playwright.git`

## Prompt

Commit the completed QA workflow artifacts to the Git repository.

Before committing:

* Check the current Git repository.
* Check the current branch and remote.
* Respect `.gitignore`.
* Do not commit `node_modules/`.
* Do not commit `test-results/`.
* Do not commit `playwright-report/`.
* Do not commit tokens, passwords, API keys, or other secrets.
* Do not overwrite unrelated existing work.

Stage the appropriate new and modified files.

Create a conventional commit with this message:

```text
feat(tests): Add complete test suite for Saucedemo checkout workflow
```

Push the changes to the configured repository only if the remote repository is confirmed to be the intended destination.

## Expected Output

Provide:

* Files committed
* Commit hash
* Branch
* Push status
* Summary of changes

Do not claim a successful push unless the push actually succeeds.

---

# COMPLETE WORKFLOW EXECUTION

Execute the complete workflow from STEP 1 through STEP 7.

Run everything using Chromium only.

The workflow is:

```text
STEP 1
Read User Story
        ↓
STEP 1.5
RAG Retrieval using retrieve_qa_context
        ↓
STEP 2
AI Test Planner
        ↓
STEP 3
Exploratory Testing
        ↓
STEP 4
Playwright Test Generator
        ↓
STEP 5
Test Execution + Healing
        ↓
STEP 6
Test Report
        ↓
STEP 7
Git Commit + Push
```

Do not skip STEP 1.5.

At STEP 1.5, actually invoke:

`qa-rag → retrieve_qa_context`

Show the retrieved context and explain briefly how it affects test coverage.

Complete each step before moving to the next.

Provide a short status update after each step.

If a browser action exceeds 60 seconds without responding, mark it `BLOCKED`, document the reason, and continue where possible.

Do not fabricate test results, screenshots, defects, tool calls, or Git operations.

---

# VIDEO DEMO — SHORT COMBINED PROMPT

I want to demonstrate a complete end-to-end QA workflow using natural language, MCP servers, RAG, and AI agents.

Run everything in Chrome (Chromium) only.

### STEP 1 — READ USER STORY

Read:

`user_stories/Saucedemo-ecommerce.md`

Provide a brief summary of the requirements and acceptance criteria.

### STEP 1.5 — RAG KNOWLEDGE RETRIEVAL

Actually invoke the MCP tool:

`retrieve_qa_context`

from:

`qa-rag`

Retrieve relevant QA requirements, existing test cases, known defects, and QA guidelines.

Show the retrieved context and explain briefly how it improves test coverage.

### STEP 2 — CREATE TEST PLAN

Use the `playwright-test-planner` agent.

Explore the application and create:

`specs/saucedemo-checkout-test-plan.md`

### STEP 3 — EXPLORATORY TESTING

Execute the test plan using Playwright MCP.

Use Chromium at 1280x720.

Save screenshots to:

`test-evidence/screenshots/`

Save findings to:

`test-evidence/exploratory-testing-results.md`

### STEP 4 — GENERATE AUTOMATION

Use the `playwright-test-generator` agent.

Generate TypeScript Playwright tests under:

`tests/saucedemo-checkout/`

Use selectors and insights discovered during exploratory testing.

### STEP 5 — EXECUTE AND HEAL

Run:

```text
npx playwright test tests/saucedemo-checkout --project=chromium --reporter=line
```

Use the `playwright-test-healer` agent for failures.

Maximum 3 healing attempts per test.

Do not modify assertions to hide real application defects.

### STEP 6 — CREATE REPORT

Create:

`reports/ecommerce-checkout-test-report.md`

Include:

* Manual results
* Automation results
* Healing summary
* Defects
* Screenshots
* Acceptance-criteria coverage
* Testing gaps

### STEP 7 — COMMIT

Check the configured Git remote before pushing.

Commit the completed artifacts using:

```text
feat(tests): Add complete test suite for Saucedemo checkout workflow
```

Push only if the configured remote is the intended repository.

Execute the complete workflow and provide status updates after every step.

---

## Files Used

* `user_stories/Saucedemo-ecommerce.md`
* `QA_E2E_Prompt.md`
* `README.md`
* `E2E_QA_Workflow_Prompts.docx`

Track the tools and referenced files used during the workflow.
