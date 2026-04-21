export default {
  // request
  method: 'POST',
  url: '{{baseUrl}}/api/sessions/{{sessionUrl}}',
  header: {
    'Content-Type': 'application/json'
  },
  body: {
    userName: "jenny",
    ready: false
  }
};

export function postResponse() {
  // assertion 
  pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
  });

  const json = pm.response.json();
  
  pm.test('Response contains player id', () => {
    pm.expect(json).to.have.property('id');
  });
  
  pm.test('Response contains correct userName', () => {
    pm.expect(json).to.have.property('userName', 'jenny');
  });
  
  pm.test('Response contains ready status', () => {
    pm.expect(json).to.have.property('ready', false);
  });
  
  pm.collectionVariables.set('playerId', json.id);
}