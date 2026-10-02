# SauceDemo Checkout Test Execution Report

**Workflow:** SCRUM-101 SauceDemo checkout
**Application:** https://www.saucedemo.com
**Environment:** Chromium, 1280x720, `standard_user`
**Automation command:** `npx playwright test tests/saucedemo-checkout --project=chromium`

## 1. Executive Summary

The SauceDemo checkout workflow was originally planned as 10 high-level scenarios (TC-01 through TC-10). The automation suite was subsequently expanded into focused tests covering individual behaviors within each scenario.

The current checkout suite contains **31 focused automated tests**, plus **1 seed/login smoke test**, for a total of **32 tests** in a full Playwright run.

| Measure                               | Current Result |
| ------------------------------------- | -------------: |
| High-level scenarios                  |             10 |
| Focused checkout tests                |             31 |
| Seed/login smoke test                 |              1 |
| Total Playwright tests executed       |         **32** |
| Genuine functional passes             |         **27** |
| Known defects/observations reproduced |          **5** |
| Unexpected failures                   |          **0** |
| Flaky tests                           |          **0** |
| Skipped tests                         |          **0** |

### Important interpretation of the Playwright result

The terminal reports:

**`32 passed`**

This does **not** mean that all application behavior is defect-free.

Five tests intentionally validate conditions that are already documented as known defects or observations. Those tests are marked with the `@known-bug` tag and use the project's `knownBug()` handling.

Therefore:

* **Playwright execution result:** 32 tests completed without unexpected failures.
* **Functional result:** 27 scenarios passed expected application behavior.
* **Defect validation result:** 5 known defects/observations were successfully reproduced.
* **Unexpected failures:** 0.

This distinction prevents the Playwright headline from being interpreted as "the application has zero defects."

---

## 2. Manual Test Results

Manual exploratory testing was performed using Chromium at 1280x720.

| Test case | Manual status         | Result                                                                                                        |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| TC-01     | PASS with defect      | Cart item details and navigation worked; the required cart total was missing.                                 |
| TC-02     | PASS                  | Valid checkout data reached the overview.                                                                     |
| TC-03     | PASS                  | Required-field errors blocked incomplete submissions.                                                         |
| TC-04     | FAIL                  | Special-character names and non-numeric postal data were accepted and reached the overview.                   |
| TC-05     | PASS                  | Overview payment, shipping, item details, and totals were displayed.                                          |
| TC-06     | PASS                  | Cancel from information and overview preserved the cart and avoided completion.                               |
| TC-07     | PASS                  | Browser Back returned from overview to checkout information and the flow could continue.                      |
| TC-08     | PASS                  | Order confirmation displayed and completion cleared the cart.                                                 |
| TC-09     | PASS with observation | Unauthenticated checkout was protected; direct empty-cart overview behavior was tracked separately as OBS-01. |
| TC-10     | PASS with defect      | Multi-item checkout completed, but the item-total formatting defect was observed.                             |

### Manual evidence

* [TC-01 cart review](../test-evidence/screenshots/TC-01-cart-review.png)
* [TC-02 valid overview](../test-evidence/screenshots/TC-02-valid-overview.png)
* [TC-03 required validation](../test-evidence/screenshots/TC-03-required-validation.png)
* [TC-04 invalid data accepted](../test-evidence/screenshots/TC-04-invalid-data-accepted.png)
* [TC-05 overview](../test-evidence/screenshots/TC-05-overview.png)
* [TC-08 order completion](../test-evidence/screenshots/TC-08-order-complete.png)
* [TC-10 multi-item overview](../test-evidence/screenshots/TC-10-multi-item-overview.png)

Detailed manual observations are recorded in [exploratory-testing-results.md](../test-evidence/exploratory-testing-results.md).

---

## 3. Automated Test Results

Automation covers TC-01 through TC-10 in [tests/saucedemo-checkout](../tests/saucedemo-checkout/).

### Current Playwright execution

The latest full Chromium execution produced:

* **32 tests executed**
* **27 genuine functional passes**
* **5 known defects/observations reproduced**
* **0 unexpected failures**
* **0 flaky tests**
* **0 skipped tests**

The five defect/observation tests are:

| Test   | Classification    | Issue  |
| ------ | ----------------- | ------ |
| TC-01d | Known defect      | BUG-01 |
| TC-04a | Known defect      | BUG-02 |
| TC-04b | Known defect      | BUG-04 |
| TC-09c | Known observation | OBS-01 |
| TC-10c | Known defect      | BUG-03 |

The `✘` markers shown for these tests during the line-reporter execution indicate that their defect assertions were reproduced. Their failures are intentionally classified as known conditions, which is why the final Playwright summary reports the overall run as `32 passed`.

### Automated suite mapping

| Suite file                             | Tests                        | Known issue                |
| -------------------------------------- | ---------------------------- | -------------------------- |
| `tc-01-cart-review.spec.js`            | 01a, 01b, 01c, 01d           | BUG-01 (01d)               |
| `tc-02-valid-checkout.spec.js`         | 02a, 02b                     | —                          |
| `tc-03-empty-validation.spec.js`       | 03a, 03b, 03c, 03d           | —                          |
| `tc-04-invalid-checkout-data.spec.js`  | 04a, 04b, 04c                | BUG-02 (04a), BUG-04 (04b) |
| `tc-05-order-overview.spec.js`         | 05a, 05b, 05c                | —                          |
| `tc-06-cancel-controls.spec.js`        | 06a, 06b                     | —                          |
| `tc-07-browser-back.spec.js`           | 07a, 07b                     | —                          |
| `tc-08-order-completion.spec.js`       | 08a, 08b                     | —                          |
| `tc-09-authentication-context.spec.js` | 09a, 09b, 09c                | OBS-01 (09c)               |
| `tc-10-boundary-multi-item.spec.js`    | 10a, 10b, 10c, 10d, 10e, 10f | BUG-03 (10c)               |
| `seed.spec.ts`                         | seed login smoke test        | —                          |

**31 checkout tests + 1 seed test = 32 total tests.**

---

## 4. Defect Register

### BUG-01: Cart total missing

* **Severity:** Medium
* **Test:** TC-01d
* **Criterion:** AC1
* **Expected:** Cart displays item price and a total/subtotal calculation consistent with the item price and quantity.
* **Actual:** Item details and `$29.99` are displayed, but the expected cart total element is absent.
* **Evidence:** [TC-01-cart-review.png](../test-evidence/screenshots/TC-01-cart-review.png)

### BUG-02: Invalid checkout data is accepted

* **Severity:** Medium
* **Test:** TC-04a
* **Criterion:** AC5
* **Expected:** Invalid checkout values such as `!!!`, `###`, and `abc` are rejected with validation feedback.
* **Actual:** The application accepts the values and proceeds to the overview.
* **Evidence:** [TC-04-invalid-data-accepted.png](../test-evidence/screenshots/TC-04-invalid-data-accepted.png)

### BUG-03: Floating-point multi-item subtotal

* **Severity:** Low
* **Test:** TC-10c
* **Criterion:** AC3
* **Expected:** Item total is displayed as `$57.98`.
* **Actual:** The application renders `Item total: $57.980000000000004`.
* **Evidence:** [TC-10-multi-item-overview.png](../test-evidence/screenshots/TC-10-multi-item-overview.png)

### BUG-04: Whitespace-only checkout values are accepted

* **Severity:** Medium
* **Test:** TC-04b
* **Criterion:** AC5
* **Expected:** Whitespace-only first name, last name, and postal-code values are rejected with field validation.
* **Actual:** The application accepts the whitespace-only values and does not remain blocked by the expected validation.
* **Status:** Reproduced by the current automated test.

### OBS-01: Authenticated empty-cart direct overview remains accessible

* **Severity:** Low
* **Test:** TC-09c
* **Expected in the test:** Direct access to the empty-cart overview is redirected to a valid state.
* **Actual:** The authenticated user remains on `checkout-step-two.html`.
* **Classification:** Observation rather than confirmed defect against the stated acceptance criteria.
* **Reason:** The user story requires authentication for checkout but does not explicitly state that an authenticated user with an empty cart must be prevented from directly accessing the overview route.

---

## 5. Test Coverage

| Requirement                                                              | Covered by                 |
| ------------------------------------------------------------------------ | -------------------------- |
| AC1: Cart review, item details, total, navigation                        | TC-01, TC-10               |
| AC2: Checkout information and required fields                            | TC-02, TC-03               |
| AC3: Overview items, payment, shipping, subtotal, tax, total and actions | TC-02, TC-05, TC-07, TC-10 |
| AC4: Finish, confirmation and Back Home                                  | TC-08, TC-10               |
| AC5: Invalid and incomplete data validation                              | TC-03, TC-04, TC-10        |
| Authentication requirement                                               | TC-09                      |
| Cart cleared after order completion                                      | TC-08, TC-10               |
| Cancel and browser Back behavior                                         | TC-06, TC-07               |

### Current limitations

* Chromium is currently the tested browser.
* Firefox and WebKit are not part of the current execution.
* The SauceDemo application is a third-party demo application, so availability or behavior can change independently of this project.
* Known defects should remain tracked until the application behavior changes.

---

## 6. Final QA Interpretation

The automation framework successfully executes the checkout workflow and detects documented application issues.

The latest execution should therefore be interpreted as:

**27 functional passes + 5 known defect/observation validations + 0 unexpected failures.**

The Playwright headline of **32 passed** represents successful execution according to the test definitions; it should not be interpreted as a claim that every product requirement currently passes.

The project intentionally demonstrates both:

1. **Positive functional automation**, and
2. **Automated defect detection and validation.**

After an application defect is fixed, its corresponding `@known-bug` classification should be removed and the test should be allowed to validate the corrected behavior as a normal functional test.

---

## 7. Run the Tests

From the project root:

```bash
npm ci
npx playwright install chromium
npx playwright test tests/saucedemo-checkout --project=chromium
npx playwright show-report
```

For the complete project suite:

```bash
npx playwright test --project=chromium
```

The full project run currently includes the `seed.spec.ts` login smoke test, resulting in **32 tests**.

---

## 8. Repository Artifacts

Relevant project artifacts include:

* Playwright test suite: `tests/saucedemo-checkout/`
* Test plan: `specs/saucedemo-checkout-test-plan.md`
* User story: `user_stories/Saucedemo-ecommerce.md`
* Exploratory evidence: `test-evidence/exploratory-testing-results.md`
* Automation evidence: `test-evidence/automation-healing-results.md`
* Playwright HTML report: generated locally in `playwright-report/`
* RAG knowledge base: `rag/knowledge/`
* MCP server: `rag/mcp_server.py`
* AI agent definitions: `.github/agents/`
