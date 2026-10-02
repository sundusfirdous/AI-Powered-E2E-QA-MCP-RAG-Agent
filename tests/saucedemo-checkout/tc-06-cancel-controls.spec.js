const { test, expect, PRODUCTS, byTest, reachCheckoutInfo, reachOverview, openCart } = require('../support/saucedemo');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-06a Cancel from checkout information returns to the cart', async ({ signedInPage: page }) => {
    await reachCheckoutInfo(page, PRODUCTS.backpack);
    await byTest(page, 'cancel').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page).not.toHaveURL(/checkout-complete\.html/);
    await expect(byTest(page, 'item-4-title-link')).toBeVisible();
  });

  test('TC-06b Cancel from the overview leaves checkout and keeps the cart', async ({ signedInPage: page }) => {
    await reachOverview(page, PRODUCTS.backpack);
    await byTest(page, 'cancel').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page).not.toHaveURL(/checkout-complete\.html/);
    await expect(byTest(page, 'title')).toHaveText('Products');
    await openCart(page);
    await expect(byTest(page, 'item-4-title-link')).toHaveText('Sauce Labs Backpack');
  });
});
