const { test, expect, PRODUCTS, byTest, login, addToCart, openCart, startCheckout, knownBug } = require('../support/saucedemo');

test.describe('SauceDemo checkout workflow', () => {
  // Each test gets a fresh browser context, so `page` below starts unauthenticated.
  test('TC-09a Unauthenticated access to checkout redirects to the login page', async ({ page }) => {
    await page.goto('/checkout-step-one.html');
    await expect(page).toHaveURL(/\/$/);
    await expect(byTest(page, 'login-button')).toBeVisible();
  });

  test('TC-09b Authenticated user with a cart can reach checkout information', async ({ signedInPage: page }) => {
    await addToCart(page, PRODUCTS.backpack);
    await openCart(page);
    await startCheckout(page);
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();
    await expect(byTest(page, 'firstName')).toBeVisible();
    await expect(byTest(page, 'lastName')).toBeVisible();
    await expect(byTest(page, 'postalCode')).toBeVisible();
  });

  test(
    'TC-09c Authenticated empty-cart direct visit to the overview is redirected',
    { tag: '@known-bug' },
    async ({ page }) => {
      await login(page);
      await page.goto('/checkout-step-two.html');
      knownBug('OBS-01', 'Authenticated empty-cart direct checkout remains on overview (low severity)');
      await expect(page).toHaveURL(/\/$/);
      await expect(byTest(page, 'login-button')).toBeVisible();
      await expect(page).not.toHaveURL(/checkout-step-two\.html|checkout-complete\.html/);
    }
  );
});
