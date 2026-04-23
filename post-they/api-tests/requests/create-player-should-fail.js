export default {
  method: 'POST',
  url: '{{baseUrl}}/api/sessions/{{sessionUrl}}',
  header: {
    'Content-Type': 'application/json'
  },
  body: {
    userName: "Adam"
  }
};
export function postResponse() {
  pm.test("Create player returns 400 for session full", () => {
    pm.response.to.have.status(400);
  });

  const json = pm.response.json();

  pm.test("Create player full session returns correct message", () => {
    pm.expect(json).to.have.property('message', 'Session is full (max 4 players)');
  });
}
