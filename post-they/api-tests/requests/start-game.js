export default {
  // request
  method: 'POST',
  url: '{{baseUrl}}/api/sessions/start/{{sessionUrl}}',
  header: {
    'Content-Type': 'application/json'
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
}