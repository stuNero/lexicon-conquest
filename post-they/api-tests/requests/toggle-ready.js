export default {
  method: 'PUT',
  url: '{{baseUrl}}/api/players/?url={{sessionUrl}}&id={{playerId}}'
};

export function postResponse() {
  pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
  });

  const json = pm.response.json();
  const playerId = pm.collectionVariables.get('playerId');
  const player = json.players.find(player => player.id === playerId);

  pm.test('Response contains session dto', () => {
    pm.expect(json).to.have.property('url', pm.collectionVariables.get('sessionUrl'));
    pm.expect(json).to.have.property('players');
    pm.expect(json.players).to.be.an('array');
  });

  pm.test('Joined player is now ready', () => {
    pm.expect(player).to.exist;
    pm.expect(player.ready).to.equal(true);
  });
}
