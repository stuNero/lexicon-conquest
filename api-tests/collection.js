import getAllSessions from './requests/get-all-sessions.js';

export const name = 'LexiConquest API Tests';

export function preRequest() {
  pm.variables.set('baseUrl', 'http://localhost:5001');
}

export const order = [
  getAllSessions,
];