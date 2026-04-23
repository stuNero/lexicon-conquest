export default {
  method: 'GET',
  url: '{{baseUrl}}/api/sessions?url={{sessionUrl}}'
};

export function postResponse() {
  pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
  });

  const json = pm.response.json();
  
  pm.test('Response is an array', () => {
    pm.expect(json).to.be.an('array');
  });
  
  pm.test('Returns exactly one session', () => {
    pm.expect(json).to.have.lengthOf(1);
  });
  
  pm.test('Session url matches requested url', () => {
    pm.expect(json[0].url).to.equal(pm.collectionVariables.get('sessionUrl'));
  });
  
  pm.test('Session contains players array', () => {
    pm.expect(json[0]).to.have.property('players');
    pm.expect(json[0].players).to.be.an('array');
  });

  pm.test('Session contains game state fields', () => {
    pm.expect(json[0]).to.have.property('inGame');
    pm.expect(json[0]).to.have.property('turnNumber');
    pm.expect(json[0]).to.have.property('playerScores');
  });
}
