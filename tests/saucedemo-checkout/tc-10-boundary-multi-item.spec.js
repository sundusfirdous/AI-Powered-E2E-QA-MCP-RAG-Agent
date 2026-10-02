const { test, expect, PRODUCTS, byTest, addToCart, openCart, startCheckout, fillCustomerInfo, reachOverview, knownBug } = require('../support/saucedemo');

const TWO_ITEMS = [PRODUCTS.onesie, PRODUCTS.fleeceJacket];

test.describe('SauceDemo checkout workflow', () => {
  test('TC-10a Cart lists both products with quantities and prices', async ({ signedInPage: page }) => {
    await expect(byTest(page, 'title')).toHaveText('Products');
    await addToCart(page, ...TWO_ITEMS);
    await openCart(page);
    await expect(byTest(page, 'title')).toHaveText('Your Cart');
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(byTest(page, 'item-2-title-link')).toHaveText('Sauce Labs Onesie');
    await expect(byTest(page, 'item-5-title-link')).toHaveText('Sauce Labs Fleece Jacket');
    await expect(page.locator('.cart_item').nth(0).locator('.cart_quantity')).toHaveText('1');
    await expect(page.locator('.cart_item').nth(1).locator('.cart_quantity')).toHaveText('1');
    await expect(page.getByText('$7.99')).toBeVisible();
    await expect(page.getByText('$49.99')).toBeVisible();
  });

  test('TC-10b Multi-item overview lists both products', async ({ signedInPage: page }) => {
    await reachOverview(page, ...TWO_ITEMS);
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(byTest(page, 'item-2-title-link')).toHaveText('Sauce Labs Onesie');
    await expect(byTest(page, 'item-5-title-link')).toHaveText('Sauce Labs Fleece Jacket');
  });

  test(
    'TC-10c Multi-item item total is rounded to two decimal places',
    { tag: '@known-bug' },
    async ({ signedInPage: page }) => {
      await reachOverview(page, ...TWO_ITEMS);
      knownBug('BUG-03', 'Floating-point total (subtotal is not rounded)');
      await expect(byTest(page, 'subtotal-label')).toHaveText('Item total: $57.98');
    }
  );

  test('TC-10d Multi-item tax and total are consistent', async ({ signedInPage: page }) => {
    await reachOverview(page, ...TWO_ITEMS);
    await expect(byTest(page, 'tax-label')).toHaveText('Tax: $4.64');
    await expect(byTest(page, 'total-label')).toHaveText('Total: $62.62');
  });

  test('TC-10e Finishing a multi-item order clears the cart', async ({ signedInPage: page }) => {
    await reachOverview(page, ...TWO_ITEMS);
    await byTest(page, 'finish').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(byTest(page, 'title')).toHaveText('Checkout: Complete!');
    await expect(byTest(page, 'complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('TC-10f Boundary values (one-character names, postal code 1) complete an order', async ({ signedInPage: page }) => {
    await addToCart(page, ...TWO_ITEMS);
    await openCart(page);
    await startCheckout(page);
    await fillCustomerInfo(page, { firstName: 'A', lastName: 'B', postalCode: '1' });
    await byTest(page, 'continue').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(byTest(page, 'title')).toHaveText('Checkout: Overview');
    await byTest(page, 'finish').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(byTest(page, 'complete-header')).toHaveText('Thank you for your order!');
    await byTest(page, 'back-to-products').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
