export default {
  method: 'PUT',
  url: '{{baseUrl}}/api/players/?url={{sessionUrl}}&id={{hostPlayerId}}'
};

export function postResponse() {
  pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
  });

  const json = pm.response.json();
  const hostPlayerId = pm.collectionVariables.get('hostPlayerId');
  const hostPlayer = json.players.find(player => player.id === hostPlayerId);

  pm.test('Response contains session dto', () => {
    pm.expect(json).to.have.property('url', pm.collectionVariables.get('sessionUrl'));
    pm.expect(json).to.have.property('players');
    pm.expect(json.players).to.be.an('array');
  });

  pm.test('Host player is now ready', () => {
    pm.expect(hostPlayer).to.exist;
    pm.expect(hostPlayer.ready).to.equal(true);
  });
}
