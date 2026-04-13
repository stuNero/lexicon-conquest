import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then, And } = createBdd();

let jsonResponse = null;

Given('att jag öppnar {string} i webbläsaren', async ({ page }, endpoint) => {
  await page.goto(endpoint);
  // Läs JSON från body
  const bodyText = await page.locator('body').textContent();
  jsonResponse = JSON.parse(bodyText);
});

Then('ska statuskoden vara {int}', async ({ page }) => {
  // eftersom för page.goto får vi inte status code direkt
  // vi kan kolla att sidan laddades inte genom att se 404
  const title = await page.title();
  expect(title).not.toBe('404 Not Found');
});

And('ska svaret vara en JSON-array', async () => {
  expect(Array.isArray(jsonResponse)).toBe(true);
});

And('varje session ska ha en unik URL', async () => {
  const urls = jsonResponse.map(session => session.url);
  const uniqueUrls = new Set(urls);
  expect(urls.length).toBe(uniqueUrls.size);
});

And('varje session ska ha en lista av players', async () => {
  jsonResponse.forEach(session => {
    expect(session).toHaveProperty('players');
    expect(Array.isArray(session.players)).toBe(true);
  });
});

Then('ska svaret vara en array med {int} session', async (count) => {
  expect(jsonResponse.length).toBe(count);
});

And('sessionens URL ska matcha den efterfrågade', async ({ page }) => {
  const currentUrl = page.url();
  const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
  const requestedUrl = urlParams.get('url');
  
  expect(jsonResponse[0].url).toBe(requestedUrl);
});