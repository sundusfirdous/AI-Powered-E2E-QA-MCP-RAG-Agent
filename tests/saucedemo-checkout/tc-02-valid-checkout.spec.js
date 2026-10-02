const { test, expect, PRODUCTS, byTest, reachCheckoutInfo, fillCustomerInfo } = require('../support/saucedemo');

test.describe('SauceDemo checkout workflow', () => {
  test('TC-02a Checkout information form shows required fields and controls', async ({ signedInPage: page }) => {
    await reachCheckoutInfo(page, PRODUCTS.backpack);
    await expect(byTest(page, 'title')).toHaveText('Checkout: Your Information');
    await expect(byTest(page, 'firstName')).toBeVisible();
    await expect(byTest(page, 'lastName')).toBeVisible();
    await expect(byTest(page, 'postalCode')).toBeVisible();
    await expect(byTest(page, 'cancel')).toBeEnabled();
    await expect(byTest(page, 'continue')).toBeEnabled();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-02b Valid checkout information advances to order overview', async ({ signedInPage: page }) => {
    await reachCheckoutInfo(page, PRODUCTS.backpack);
    await fillCustomerInfo(page);
    await byTest(page, 'continue').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(byTest(page, 'title')).toHaveText('Checkout: Overview');
    const overviewItem = page.locator('.cart_item');
    await expect(overviewItem).toContainText('Sauce Labs Backpack');
    await expect(overviewItem.locator('.cart_quantity')).toHaveText('1');
    await expect(overviewItem).toContainText('$29.99');
  });
});
