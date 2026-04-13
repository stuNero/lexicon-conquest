import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();  // ← Bara Given och Then

let jsonResponse = null;

Given('att jag öppnar {string} i webbläsaren', async ({ page }, path) => {
  await page.goto(path);
  const bodyText = await page.locator('body').textContent();
  jsonResponse = JSON.parse(bodyText);
});

Then('ska statuskoden inte vara {int}', async ({ page }) => {
  const title = await page.title();
  expect(title).not.toBe('404 Not Found');
});

Then('svaret ska vara en JSON-array', async () => {
  expect(Array.isArray(jsonResponse)).toBe(true);
});

Then('varje session ska ha en unik URL', async () => {
  const urls = jsonResponse.map(session => session.url);
  const uniqueUrls = new Set(urls);
  expect(urls.length).toBe(uniqueUrls.size);
});

Then('varje session ska ha en lista av players', async () => {
  jsonResponse.forEach(session => {
    expect(session).toHaveProperty('players');
    expect(Array.isArray(session.players)).toBe(true);
  });
});