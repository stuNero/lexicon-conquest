export default {
  method: 'POST',
  url: '{{baseUrl}}/api/sessions/wrongurl',
  header: {
    'Content-Type': 'application/json'
  },
  body: {
    userName: "Adam",
    ready: false
  }
};

export function postResponse() {
  pm.test("Create player returns 404 for missing session", () => {
    pm.response.to.have.status(404);
  });
}
