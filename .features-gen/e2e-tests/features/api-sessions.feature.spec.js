// Generated from: e2e-tests\features\api-sessions.feature
import { test } from "playwright-bdd";

test.describe('API Sessions', () => {

  test('Hämta alla sessions', async ({ Given, Then, And, page }) => { 
    await Given('att jag öppnar "/api/sessions" i webbläsaren', null, { page }); 
    await Then('ska statuskoden inte vara 404', null, { page }); 
    await And('svaret ska vara en JSON-array'); 
    await And('varje session ska ha en unik URL'); 
    await And('varje session ska ha en lista av players'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e-tests\\features\\api-sessions.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given att jag öppnar \"/api/sessions\" i webbläsaren","stepMatchArguments":[{"group":{"start":15,"value":"\"/api/sessions\"","children":[{"start":16,"value":"/api/sessions","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then ska statuskoden inte vara 404","stepMatchArguments":[{"group":{"start":26,"value":"404","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"And svaret ska vara en JSON-array","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And varje session ska ha en unik URL","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And varje session ska ha en lista av players","stepMatchArguments":[]}]},
]; // bdd-data-end