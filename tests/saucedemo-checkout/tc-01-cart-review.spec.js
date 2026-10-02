const { test, expect, PRODUCTS, byTest, addToCart, openCart, startCheckout, knownBug } = require('../support/saucedemo');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-01a Cart review shows item details and navigation controls', async ({ signedInPage: page }) => {
    await addToCart(page, PRODUCTS.backpack);
    await openCart(page);
    await expect(byTest(page, 'title')).toHaveText('Your Cart');
    const cartItem = page.locator('.cart_item');
    await expect(cartItem).toContainText('Sauce Labs Backpack');
    await expect(cartItem).toContainText('$29.99');
    await expect(cartItem.locator('.cart_quantity')).toHaveText('1');
    await expect(byTest(page, 'continue-shopping')).toBeEnabled();
    await expect(byTest(page, 'checkout')).toBeEnabled();
  });

  test('TC-01b Continue shopping preserves the cart item', async ({ signedInPage: page }) => {
    await addToCart(page, PRODUCTS.backpack);
    await openCart(page);
    await byTest(page, 'continue-shopping').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await openCart(page);
    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
  });

  test('TC-01c Checkout from the cart opens checkout information', async ({ signedInPage: page }) => {
    await addToCart(page, PRODUCTS.backpack);
    await openCart(page);
    await startCheckout(page);
    await expect(byTest(page, 'title')).toHaveText('Checkout: Your Information');
  });

  test(
    'TC-01d Cart page shows a total consistent with item price and quantity',
    { tag: '@known-bug' },
    async ({ signedInPage: page }) => {
      await addToCart(page, PRODUCTS.backpack);
      await openCart(page);
      knownBug('BUG-01', 'Cart total missing (AC1)');
      await expect(byTest(page, 'total-label')).toBeVisible();
    }
  );
});
