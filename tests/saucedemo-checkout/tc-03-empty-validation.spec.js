const { test, expect, PRODUCTS, byTest, reachCheckoutInfo } = require('../support/saucedemo');

test.describe('SauceDemo checkout workflow', () => {
  test.beforeEach(async ({ signedInPage: page }) => {
    await reachCheckoutInfo(page, PRODUCTS.backpack);
  });

  test('TC-03a Empty submission requires a first name', async ({ page }) => {
    await byTest(page, 'continue').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(byTest(page, 'error')).toContainText('Error: First Name is required');
  });

  test('TC-03b First name alone requires a last name', async ({ page }) => {
    await byTest(page, 'firstName').fill('Test');
    await byTest(page, 'continue').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(byTest(page, 'error')).toContainText('Error: Last Name is required');
  });

  test('TC-03c First and last name without postal code are rejected', async ({ page }) => {
    await byTest(page, 'firstName').fill('Test');
    await byTest(page, 'lastName').fill('Customer');
    await byTest(page, 'continue').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(byTest(page, 'error')).toContainText('Error: Postal Code is required');
  });

  test('TC-03d Dismissing the error keeps the entered values', async ({ page }) => {
    await byTest(page, 'firstName').fill('Test');
    await byTest(page, 'lastName').fill('Customer');
    await byTest(page, 'continue').click();
    await expect(byTest(page, 'error')).toBeVisible();
    await byTest(page, 'error-button').click();
    await expect(byTest(page, 'firstName')).toHaveValue('Test');
    await expect(byTest(page, 'lastName')).toHaveValue('Customer');
  });
});
