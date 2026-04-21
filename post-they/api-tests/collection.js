import createSession from './requests/create-session.js';
import getAllSessions from './requests/get-all-sessions.js';
import deleteSession from './requests/delete-session.js';
import createPlayer from './requests/create-player.js';
import toggleReady from './requests/toggle-ready.js';
import toggleReadyHost from './requests/toggle-ready-host.js';
import getSessionByUrl from './requests/get-session-by-url.js';
import startGame from './requests/start-game.js';

export const name = 'LexiConquest API Tests';

export function preRequest() {
  pm.variables.set('baseUrl', 'http://localhost:5001');
}

export const order = [
  createSession,
  getAllSessions,
  getSessionByUrl,
  createPlayer,
  toggleReady,
  toggleReadyHost,
  startGame,
  deleteSession
];