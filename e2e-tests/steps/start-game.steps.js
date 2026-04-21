import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

let sessionUrl = null;
let hostPlayerId = null;
let otherPlayerId = null;

Given('a new session is created with host {string}', async ({ page }, hostName) => {
  await page.goto('/');
  const result = await page.evaluate(async (hostName) => {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: hostName })
    });
    const body = await response.json();
    return { status: response.status, body };
  }, hostName);

  expect(result.status).toBe(201);
  expect(result.body).toHaveProperty('url');
  expect(result.body).toHaveProperty('player');
  sessionUrl = result.body.url;
  hostPlayerId = result.body.player.id;
});

Given('another player {string} joins the session', async ({ page }, playerName) => {
  expect(sessionUrl).not.toBeNull();

  const result = await page.evaluate(async ({ sessionUrl, playerName }) => {
    const response = await fetch(`/api/sessions/${sessionUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: playerName })
    });
    const body = await response.json();
    return { status: response.status, body };
  }, { sessionUrl, playerName });

  expect(result.status).toBe(200);
  expect(result.body).toHaveProperty('id');
  otherPlayerId = result.body.id;
});

When('both players toggle ready', async ({ page }) => {
  expect(sessionUrl).not.toBeNull();
  expect(hostPlayerId).not.toBeNull();
  expect(otherPlayerId).not.toBeNull();

  const toggle = async (playerId) => {
    return page.evaluate(async ({ sessionUrl, playerId }) => {
      const response = await fetch(`/api/players?url=${sessionUrl}&id=${playerId}`, {
        method: 'PUT'
      });
      return response.status;
    }, { sessionUrl, playerId });
  };

  const firstStatus = await toggle(hostPlayerId);
  const secondStatus = await toggle(otherPlayerId);

  expect(firstStatus).toBe(200);
  expect(secondStatus).toBe(200);
});

Then('the host can start the game', async ({ page }) => {
  expect(sessionUrl).not.toBeNull();
  const result = await page.evaluate(async (sessionUrl) => {
    const response = await fetch(`/api/sessions/start/${sessionUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const body = await response.json();
    return { status: response.status, body };
  }, sessionUrl);

  expect(result.status).toBe(200);
  expect(result.body).toHaveProperty('inGame', true);
});

Then('the session is marked as inGame', async ({ page }) => {
  expect(sessionUrl).not.toBeNull();
  const result = await page.evaluate(async (sessionUrl) => {
    const response = await fetch(`/api/sessions?url=${sessionUrl}`);
    const body = await response.json();
    return { status: response.status, body };
  }, sessionUrl);

  expect(result.status).toBe(200);
  expect(Array.isArray(result.body)).toBe(true);
  expect(result.body[0]).toHaveProperty('inGame', true);
});
