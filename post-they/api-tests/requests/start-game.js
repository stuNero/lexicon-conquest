export default {
  method: 'POST',
  url: '{{baseUrl}}/api/sessions/start/{{sessionUrl}}',
  header: {
    'Content-Type': 'application/json'
  },
  body: {
    boardSize: 10
  }
};

export function postResponse() {
  pm.test("status code is 200", () => {
    pm.response.to.have.status(200);
  });

  pm.test("session is in game", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('inGame', true);
  });

  pm.test('board is created with expected size', () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('board');
    pm.expect(json.board).to.be.an('object');
    pm.expect(json.board).to.have.property('tiles');
    pm.expect(json.board.tiles).to.have.lengthOf(100);
  });

  pm.test('session includes current turn metadata', () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('turnNumber', 1);
    pm.expect(json).to.have.property('currentPlayerId');
    pm.expect(json.currentPlayerId).to.equal(pm.collectionVariables.get('hostPlayerId'));
  });
}
