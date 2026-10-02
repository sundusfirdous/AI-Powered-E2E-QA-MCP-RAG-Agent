const { test, expect, PRODUCTS, byTest, reachOverview, fillCustomerInfo } = require('../support/saucedemo');

async function expectOnePackOverview(page) {
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(byTest(page, 'title')).toHaveText('Checkout: Overview');
  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(byTest(page, 'item-4-title-link')).toHaveText('Sauce Labs Backpack');
  await expect(page.locator('.cart_quantity')).toHaveText('1');
  await expect(byTest(page, 'subtotal-label')).toHaveText('Item total: $29.99');
  await expect(byTest(page, 'tax-label')).toHaveText('Tax: $2.40');
  await expect(byTest(page, 'total-label')).toHaveText('Total: $32.39');
}

test.describe('SauceDemo checkout workflow', () => {
  test('TC-07a Browser Back from the overview returns to checkout information', async ({ signedInPage: page }) => {
    await reachOverview(page, PRODUCTS.backpack);
    await expectOnePackOverview(page);
    await page.goBack();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(byTest(page, 'title')).toHaveText('Checkout: Your Information');
    await expect(byTest(page, 'checkout')).toHaveCount(0);
  });

  test('TC-07b Re-entering information after Back shows an unchanged overview', async ({ signedInPage: page }) => {
    await reachOverview(page, PRODUCTS.backpack);
    await page.goBack();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await fillCustomerInfo(page);
    await byTest(page, 'continue').click();
    await expectOnePackOverview(page);
  });
});
