import test from '@playwright/test';


// getByRole
test( 'Simple Login with getByRole', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // email
    await page.getByRole("textbox", { name: "email"}).fill("joseantille@gmail.com");
});