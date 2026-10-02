// Shared fixtures and helpers for the SauceDemo checkout suite.
// Not a spec file (no .spec suffix), so Playwright never runs it directly.
const base = require('@playwright/test');

const { expect } = base;

/** Credentials default to SauceDemo's public demo account; override via env. */
const CREDENTIALS = {
  username: process.env.SAUCE_USERNAME || 'standard_user',
  password: process.env.SAUCE_PASSWORD || 'secret_sauce',
};

const CUSTOMER = { firstName: 'Test', lastName: 'Customer', postalCode: '12345' };

const PRODUCTS = {
  backpack: { name: 'Sauce Labs Backpack', slug: 'sauce-labs-backpack', id: 4, price: '$29.99' },
  onesie: { name: 'Sauce Labs Onesie', slug: 'sauce-labs-onesie', id: 2, price: '$7.99' },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', slug: 'sauce-labs-fleece-jacket', id: 5, price: '$49.99' },
};

/** Locator for a `data-test` attribute. */
const byTest = (page, name) => page.locator(`[data-test="${name}"]`);

/** Log in and land on the Products page. Relies on `baseURL` from the config. */
async function login(page, { username, password } = CREDENTIALS) {
  await page.goto('/');
  await byTest(page, 'username').fill(username);
  await byTest(page, 'password').fill(password);
  await byTest(page, 'login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
}

/** Add products to a fresh (empty) cart and verify the cart badge. */
async function addToCart(page, ...products) {
  for (const product of products) {
    await byTest(page, `add-to-cart-${product.slug}`).click();
    await expect(byTest(page, `remove-${product.slug}`)).toBeVisible();
  }
  await expect(page.locator('.shopping_cart_badge')).toHaveText(String(products.length));
}

async function openCart(page) {
  await byTest(page, 'shopping-cart-link').click();
  await expect(page).toHaveURL(/cart\.html/);
}

async function startCheckout(page) {
  await byTest(page, 'checkout').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
}

async function fillCustomerInfo(page, { firstName, lastName, postalCode } = CUSTOMER) {
  await byTest(page, 'firstName').fill(firstName);
  await byTest(page, 'lastName').fill(lastName);
  await byTest(page, 'postalCode').fill(postalCode);
}

/** Cart -> checkout information form, with the given products in the cart. */
async function reachCheckoutInfo(page, ...products) {
  await addToCart(page, ...(products.length ? products : [PRODUCTS.backpack]));
  await openCart(page);
  await startCheckout(page);
}

/** Cart -> checkout overview, filled with valid customer data. */
async function reachOverview(page, ...products) {
  await reachCheckoutInfo(page, ...products);
  await fillCustomerInfo(page);
  await byTest(page, 'continue').click();
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(byTest(page, 'title')).toHaveText('Checkout: Overview');
}

/**
 * Mark the REST of this test as an expected failure for a known product defect.
 *
 * Call it immediately before the single defect assertion, after all setup. Anything
 * that throws earlier (login, selectors, navigation) is NOT covered and fails the
 * test normally, so these tests cannot hide unrelated regressions. When the defect
 * is fixed the assertion passes and Playwright fails the test with
 * "Expected to fail, but passed" - the signal to delete the call.
 */
function knownBug(id, description) {
  base.test.info().annotations.push({ type: 'bug', description: `${id}: ${description}` });
  base.test.fail(true, `${id}: ${description}`);
}

const test = base.test.extend({
  /** A page that is already logged in as the standard user (fresh context per test). */
  signedInPage: async ({ page }, use) => {
    await login(page);
    await use(page);
  },
});

module.exports = {
  test,
  expect,
  CREDENTIALS,
  CUSTOMER,
  PRODUCTS,
  byTest,
  login,
  addToCart,
  openCart,
  startCheckout,
  fillCustomerInfo,
  reachCheckoutInfo,
  reachOverview,
  knownBug,
};
