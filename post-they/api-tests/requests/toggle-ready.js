export default {
  method: 'PUT',
  url: '{{baseUrl}}/api/players/?url={{sessionUrl}}&id={{playerId}}'
};

export function postResponse() {

  pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
  });
}