export default {
  method: 'POST',
  url: '{{baseUrl}}/api/sessions/{{sessionUrl}}',
  header: {
    'Content-Type': 'application/json'
  },
  body: {
    userName: "player4",
    ready: false
  }
};

export function postResponse() {
  pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
  });
}
