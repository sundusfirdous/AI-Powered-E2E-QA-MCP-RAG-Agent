const { test, expect, PRODUCTS, byTest, reachOverview } = require('../support/saucedemo');

test.describe('SauceDemo checkout workflow', () => {
  test.beforeEach(async ({ signedInPage: page }) => {
    await reachOverview(page, PRODUCTS.backpack);
  });

  test('TC-05a Overview shows item summary, payment and shipping information', async ({ page }) => {
    const item = page.locator('.cart_item');
    await expect(item.locator('.cart_quantity')).toHaveText('1');
    await expect(item.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    await expect(item.locator('[data-test="inventory-item-desc"]')).toHaveText(
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
    );
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    await expect(byTest(page, 'payment-info-value')).toHaveText('SauceCard #31337');
    await expect(byTest(page, 'shipping-info-value')).toHaveText('Free Pony Express Delivery!');
  });

  test('TC-05b Overview total equals item total plus tax', async ({ page }) => {
    await expect(byTest(page, 'total-info-label')).toHaveText('Price Total');
    const itemTotalText = await byTest(page, 'subtotal-label').textContent();
    const taxText = await byTest(page, 'tax-label').textContent();
    const totalText = await byTest(page, 'total-label').textContent();
    expect(itemTotalText).toContain('Item total: $29.99');
    expect(taxText).toContain('Tax: $2.40');
    expect(totalText).toContain('Total: $32.39');
    const itemTotal = Number(itemTotalText.replace(/[^0-9.]/g, ''));
    const tax = Number(taxText.replace(/[^0-9.]/g, ''));
    const total = Number(totalText.replace(/[^0-9.]/g, ''));
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('TC-05c Overview actions are visible, enabled and labelled', async ({ page }) => {
    await expect(byTest(page, 'cancel')).toHaveText('Cancel');
    await expect(byTest(page, 'cancel')).toBeEnabled();
    await expect(byTest(page, 'finish')).toHaveText('Finish');
    await expect(byTest(page, 'finish')).toBeEnabled();
  });
});
