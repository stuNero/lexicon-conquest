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

  pm.test('Response contains url', () => {
    pm.expect(json).to.have.property('url');
  });

  pm.test('Response contains players array', () => {
    pm.expect(json).to.have.property('player');
    pm.expect(json.player).to.be.an('object');
  });

  pm.collectionVariables.set('sessionUrl', json.url);
  pm.collectionVariables.set('hostPlayerId', json.player.id);
}