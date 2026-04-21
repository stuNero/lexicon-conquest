export default {
  method: 'DELETE',
  url: '{{baseUrl}}/api/sessions/{{sessionUrl}}'
};

export function postResponse() {
  pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
  });
}