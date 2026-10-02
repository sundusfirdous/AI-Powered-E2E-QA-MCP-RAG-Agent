# SauceDemo Checkout Test Plan

## Application Overview

Validate the complete SauceDemo checkout flow on Chrome using standard_user / secret_sauce. The user story requires cart review, mandatory customer details, validation, an order overview with item/payment/shipping/pricing details, order confirmation, authenticated access, cart clearing, and navigation/back behavior. Exploratory browsing observed the cart without a visible cart total, the expected first-name-required message on empty submission, accurate one-item overview totals ($29.99 + $2.40 tax = $32.39), successful confirmation, and an empty cart after completion. Use fresh application state for each independent scenario. Existing TC-01 through TC-10 already cover the principal paths; keep scenarios independent and record defects rather than weakening expected results.

## Test Scenarios

### 1. SauceDemo Checkout

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-01 Cart review shows item details, total, and navigation controls

**File:** `tests/saucedemo-checkout/tc-01-cart-review.spec.js`

**Steps:**
  1. In a fresh browser context, log in as standard_user with password secret_sauce, add Sauce Labs Backpack, and open the cart.
    - expect: The cart page opens and its badge shows 1.
    - expect: Sauce Labs Backpack is listed with quantity 1, description, and price $29.99.
  2. Inspect the cart summary and available actions.
    - expect: A total consistent with item price and quantity is visible; report the observed missing total against AC1 if absent.
    - expect: Continue Shopping and Checkout controls are available.
  3. Select Continue Shopping, then reopen the cart and select Checkout.
    - expect: Continue Shopping returns to products without clearing the item.
    - expect: Checkout opens the checkout information page.

#### 1.2. TC-02 Valid checkout information advances to overview

**File:** `tests/saucedemo-checkout/tc-02-valid-checkout.spec.js`

**Steps:**
  1. From a fresh state, log in, add one product, open the cart, select Checkout, and fill First Name Test, Last Name Customer, and Zip/Postal Code 12345.
    - expect: All three fields accept the values.
    - expect: Cart context remains available with one item.
  2. Select Continue.
    - expect: The checkout overview opens and contains the selected item, quantity, description, and price.

#### 1.3. TC-03 Empty checkout fields show required validation

**File:** `tests/saucedemo-checkout/tc-03-empty-validation.spec.js`

**Steps:**
  1. From a fresh state, reach checkout information with one cart item and leave all fields empty.
    - expect: First Name, Last Name, and Zip/Postal Code fields and Continue are visible.
  2. Select Continue with all fields empty, then fill First Name only and submit again; next fill Last Name and submit with Postal Code empty.
    - expect: Each submission stays on the information page.
    - expect: The displayed error identifies the first missing field: First Name, then Last Name, then Zip/Postal Code.
    - expect: The overview cannot be reached until all required fields are provided.

#### 1.4. TC-04 Invalid checkout data is rejected

**File:** `tests/saucedemo-checkout/tc-04-invalid-checkout-data.spec.js`

**Steps:**
  1. Reach checkout information and enter special-character names (!!! and ###) and non-numeric postal code abc, then select Continue.
    - expect: Invalid information produces appropriate validation feedback and does not advance.
    - expect: If the values are accepted, record the known defect BUG-02.
  2. Try whitespace-only required values and then replace with valid values Test, Customer, and 12345.
    - expect: Whitespace-only inputs are rejected as empty/invalid with field-specific feedback.
    - expect: Valid inputs allow progression.

#### 1.5. TC-05 Order overview shows details, totals, and actions

**File:** `tests/saucedemo-checkout/tc-05-order-overview.spec.js`

**Steps:**
  1. Reach overview with one Backpack and valid checkout information.
    - expect: Item summary shows quantity 1, Backpack, description, and $29.99.
    - expect: Payment and shipping sections are present.
  2. Verify payment/shipping values and all displayed prices.
    - expect: Payment shows SauceCard #31337 and shipping shows Free Pony Express Delivery!.
    - expect: Item total is $29.99, tax is $2.40, and total is $32.39; total equals item total plus tax.
  3. Inspect overview actions.
    - expect: Cancel and Finish are visible and usable.

#### 1.6. TC-06 Cancel controls do not complete an order

**File:** `tests/saucedemo-checkout/tc-06-cancel-controls.spec.js`

**Steps:**
  1. Reach checkout information with an item in the cart and select Cancel.
    - expect: The application returns to the preceding cart/products flow.
    - expect: No order confirmation is shown and the item remains available.
  2. Repeat setup, reach overview, and select Cancel.
    - expect: The order is not completed and checkout-complete is not displayed.
    - expect: The cart remains available for review.

#### 1.7. TC-07 Browser Back navigation preserves checkout boundaries

**File:** `tests/saucedemo-checkout/tc-07-browser-back.spec.js`

**Steps:**
  1. Reach overview with valid information, then use browser Back.
    - expect: The information page is shown rather than the overview.
    - expect: Previously entered values are retained or cleared consistently; record unexpected loss if retention is required by product behavior.
  2. Continue again or use browser Forward, then navigate back through the checkout/cart flow without finishing.
    - expect: No duplicate/lost items or corrupted totals appear.
    - expect: No completed order is created.

#### 1.8. TC-08 Order completion confirms purchase and clears cart

**File:** `tests/saucedemo-checkout/tc-08-order-completion.spec.js`

**Steps:**
  1. Reach overview with one item and valid information, then select Finish.
    - expect: Checkout confirmation appears with a success message and delivery confirmation.
    - expect: The cart badge is empty.
  2. Select Back Home and inspect products/cart state.
    - expect: The products page opens.
    - expect: The cart remains empty.

#### 1.9. TC-09 Checkout requires authentication and valid cart context

**File:** `tests/saucedemo-checkout/tc-09-authentication-context.spec.js`

**Steps:**
  1. In a fresh unauthenticated browser context, navigate directly to checkout information.
    - expect: Checkout is blocked and the app redirects to login or an equivalent protected state.
  2. Log in with an empty cart and navigate directly to checkout overview.
    - expect: An empty-cart overview/order flow is prevented; no order can be completed without items and valid checkout data.
  3. Add an item and use the normal cart-to-checkout path.
    - expect: An authenticated user with a cart item can access checkout normally.

#### 1.10. TC-10 Multi-item and boundary totals stay consistent through checkout

**File:** `tests/saucedemo-checkout/tc-10-boundary-multi-item.spec.js`

**Steps:**
  1. From a fresh state, add Sauce Labs Onesie ($7.99) and Sauce Labs Fleece Jacket ($49.99), then inspect cart and overview.
    - expect: Each item appears once with correct quantity and price.
    - expect: The item total is $57.98 before tax and amounts remain arithmetically consistent; report floating-point precision problems against BUG-03.
  2. Complete checkout and inspect confirmation/cart state.
    - expect: Order confirmation is displayed and cart is cleared.
  3. Repeat checkout using one-character names and the shortest non-empty postal code accepted by the app.
    - expect: Boundary behavior is recorded without asserting undocumented minimum lengths.
