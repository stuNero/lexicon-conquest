import createSession from './requests/create-session.js';
import getAllSessions from './requests/get-all-sessions.js';
import deleteSession from './requests/delete-session.js';
import createPlayer from './requests/create-player.js';
import createPlayer2 from './requests/create-player-2.js';
import createPlayer3 from './requests/create-player-3.js';
import toggleReady from './requests/toggle-ready.js';
import toggleReadyAgain from './requests/toggle-ready-again.js';
import toggleReadyHost from './requests/toggle-ready-host.js';
import getSessionByUrl from './requests/get-session-by-url.js';
import startGame from './requests/start-game.js';
import createPlayerNoSession from './requests/create-player-no-session.js';
import createPlayerShouldFail from './requests/create-player-should-fail.js';
import toggleReadyTofalse from './requests/toggle-ready-tofalse.js';

export const name = 'LexiConquest API Tests';

export function preRequest() {
  pm.variables.set('baseUrl', 'http://localhost:5001');
}

export const order = [
  createPlayerNoSession,
  createSession,
  getAllSessions,
  getSessionByUrl,
  createPlayer,
  toggleReady,
  toggleReadyTofalse,
  toggleReadyAgain,
  toggleReadyHost,
  startGame,
  createPlayer2,
  createPlayer3,
  createPlayerShouldFail,
  deleteSession
];
