const { test, expect, PRODUCTS, byTest, reachOverview } = require('../support/saucedemo');

test.describe('SauceDemo checkout workflow', () => {
  test.beforeEach(async ({ signedInPage: page }) => {
    await reachOverview(page, PRODUCTS.backpack);
    await byTest(page, 'finish').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test('TC-08a Finish shows the confirmation and clears the cart badge', async ({ page }) => {
    await expect(byTest(page, 'title')).toHaveText('Checkout: Complete!');
    await expect(byTest(page, 'complete-header')).toHaveText('Thank you for your order!');
    await expect(byTest(page, 'complete-text')).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );
    await expect(byTest(page, 'back-to-products')).toBeVisible();
    await expect(byTest(page, 'back-to-products')).toBeEnabled();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('TC-08b Back Home returns to Products with an empty cart', async ({ page }) => {
    await byTest(page, 'back-to-products').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(byTest(page, 'title')).toHaveText('Products');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });
});
