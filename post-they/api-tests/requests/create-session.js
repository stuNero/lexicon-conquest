export default {
  method: 'POST',
  url: '{{baseUrl}}/api/sessions',
  header: {
    'Content-Type': 'application/json'
  },
  body: {
    userName: "Adam"  
  }
};

export function postResponse() {
  pm.test('Status code is 201', () => {
    pm.response.to.have.status(201);
  });

  const json = pm.response.json();

  pm.test('Response contains success message', () => {
    pm.expect(json).to.have.property('message', 'Session created');
  });

  pm.test('Response contains url', () => {
    pm.expect(json).to.have.property('url');
  });

  pm.test('Response contains players array', () => {
    pm.expect(json).to.have.property('players');
    pm.expect(json.players).to.be.an('array').with.lengthOf(1);
  });

  pm.test('Response contains host player object', () => {
    pm.expect(json).to.have.property('player');
    pm.expect(json.player).to.be.an('object');
  });

  pm.test('Host player matches request payload', () => {
    pm.expect(json.player).to.have.property('userName', 'Adam');
    pm.expect(json.player).to.have.property('isHost', true);
    pm.expect(json.player).to.have.property('ready', false);
  });

  pm.collectionVariables.set('sessionUrl', json.url);
  pm.collectionVariables.set('hostPlayerId', json.player.id);
}
