import test from '@playwright/test';

test( 'Simple Login', async ({ page }) => {
    await page.goto('https://www.google.com/');
});