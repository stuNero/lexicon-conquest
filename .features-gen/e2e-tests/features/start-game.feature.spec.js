// Generated from: e2e-tests\features\start-game.feature
import { test } from "playwright-bdd";

test.describe('Start Game', () => {

  test('Host can start the game after all players are ready', async ({ Given, When, Then, And, page }) => { 
    await Given('a new session is created with host "Host"', null, { page }); 
    await And('another player "Player2" joins the session', null, { page }); 
    await When('both players toggle ready', null, { page }); 
    await Then('the host can start the game', null, { page }); 
    await And('the session is marked as inGame', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e-tests\\features\\start-game.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given a new session is created with host \"Host\"","stepMatchArguments":[{"group":{"start":35,"value":"\"Host\"","children":[{"start":36,"value":"Host","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And another player \"Player2\" joins the session","stepMatchArguments":[{"group":{"start":15,"value":"\"Player2\"","children":[{"start":16,"value":"Player2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When both players toggle ready","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the host can start the game","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And the session is marked as inGame","stepMatchArguments":[]}]},
]; // bdd-data-end