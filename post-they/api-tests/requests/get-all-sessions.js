export default {
  method: 'GET',
  url: '{{baseUrl}}/api/sessions'
};

export function postResponse() {
  pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
  });

  const json = pm.response.json();

  pm.test('Response is an array', () => {
    pm.expect(json).to.be.an('array');
  });
  
  pm.test('Each session has url and players properties', () => {
    if (json.length > 0) {
      json.forEach(session => {
        pm.expect(session).to.have.property('url');
        pm.expect(session).to.have.property('players');
        pm.expect(session.players).to.be.an('array');
        pm.expect(session).to.have.property('inGame');
        pm.expect(session).to.have.property('turnNumber');
        pm.expect(session).to.have.property('playerScores');
      });
    }
  });
}
