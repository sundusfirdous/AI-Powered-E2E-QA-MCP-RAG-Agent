const { test, expect, PRODUCTS, byTest, reachCheckoutInfo, fillCustomerInfo, knownBug } = require('../support/saucedemo');

test.describe('SauceDemo checkout workflow', () => {
  test.beforeEach(async ({ signedInPage: page }) => {
    await reachCheckoutInfo(page, PRODUCTS.backpack);
  });

  test(
    'TC-04a Invalid names and a non-numeric postal code are rejected with a format error',
    { tag: '@known-bug' },
    async ({ page }) => {
      await fillCustomerInfo(page, { firstName: '!!!', lastName: '###', postalCode: 'abc' });
      await byTest(page, 'continue').click();
      knownBug('BUG-02', 'Invalid data accepted (AC5)');
      await expect(page).toHaveURL(/checkout-step-one\.html/);
      await expect(byTest(page, 'error')).toBeVisible();
      await expect(byTest(page, 'error')).toContainText(/invalid|format|valid/i);
    }
  );

  test(
    'TC-04b Whitespace-only values stay blocked with a field error',
    { tag: '@known-bug' },
    async ({ page }) => {
      await fillCustomerInfo(page, { firstName: '   ', lastName: 'A', postalCode: '   ' });
      await byTest(page, 'continue').click();
      knownBug('BUG-04', 'Whitespace-only checkout values accepted (AC5)');
      await expect(page).toHaveURL(/checkout-step-one\.html/);
      await expect(byTest(page, 'error')).toBeVisible();
    }
  );

  test('TC-04c Valid values after a validation error reach the overview', async ({ page }) => {
    await byTest(page, 'continue').click();
    await expect(byTest(page, 'error')).toBeVisible();
    await fillCustomerInfo(page);
    await byTest(page, 'continue').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
