export default {
  method: 'GET',
  url: '{{baseUrl}}/api/sessions'  // ← Blir http://localhost:5173/api/sessions
};

export function postResponse() {
  pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
  });

  const json = pm.response.json();
  
  pm.test('Response is an array', () => {
    pm.expect(json).to.be.an('array');
  });
  
 
}