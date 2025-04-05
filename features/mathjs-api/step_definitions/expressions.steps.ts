import { Given, When, Then, DataTable, Before, BeforeAll } from '@cucumber/cucumber';
import { actorCalled, Actor } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { GetRequest, PostRequest, Send, LastResponse } from '@serenity-js/rest';
import { ConfigurationHelper } from '../../../src/config/ConfigurationHelper';
import { TokenStore } from '../../../src/config/TokenStore';
import chalk from 'chalk';

// Print feature name before each scenario
Before(function() {
    console.log(chalk.blueBright.bold.bgWhite('\nFeature: Expressions: Basic expressions with token check'));
});

// Helper function to extract values from a DataTable
const column = (table: DataTable, columnName: string): string[] => {
    const rows = table.hashes();
    
    // If first row is an object with the columnName as key
    if (rows.length > 0 && typeof rows[0] === 'object' && columnName in rows[0]) {
        return rows.map(row => row[columnName]);
    }
    
    // Otherwise treat as array and use index
    const rawRows = table.raw();
    const columnIndex = rawRows[0].indexOf(columnName);
    return rawRows.slice(1).map(row => row[columnIndex]);
};

Given(/(.*?) is a registered user/, (name: string) => {
    console.log(chalk.whiteBright.bold.bgWhite(`\nGiven ${name} is a registered user`));
    actorCalled(name);
});

When(/(.*?) requests evaluation of (.*)/, (name: string, expression: string) => {
    console.log(chalk.whiteBright.bold.bgWhite(`\nWhen ${name} requests evaluation of ${expression}`));
    return actorCalled(name).attemptsTo(
        Send.a(GetRequest.to(`/v4/?expr=${encodeURIComponent(expression)}`))
    );
});

Then(/(.*?) should get single result (.*)/, (name: string, expectedResult: string) => {
    console.log(chalk.whiteBright.bold.bgWhite(`\nThen ${name} should get single result ${expectedResult}`));
    return actorCalled(name).attemptsTo(
        Ensure.that(LastResponse.body(), equals(Number(expectedResult)))
    );
});

When(/(.*?) requests evaluation of:/, (name: string, expressionsTable: DataTable) => {
    console.log(chalk.whiteBright.bold.bgWhite(`\nWhen ${name} requests evaluation of:`));
    const expressions = column(expressionsTable, 'expression');
    console.log('\nExpressions to evaluate:', expressions);
    
    return actorCalled(name).attemptsTo(
        Send.a(PostRequest.to('/v4/').with({
            "expr": expressions,
            "precision": 14
        }))
    );
});

Then(/(.*?) should get multiple results:/, (name: string, expectedResultsTable: DataTable) => {
    console.log(chalk.whiteBright.bold.bgWhite(`\nThen ${name} should get multiple results:`));
    const expectedResults = column(expectedResultsTable, 'expected_result');
    
    // Log the full API response
    const response = LastResponse.body<any>();
    console.log('API Response:', JSON.stringify(response, null, 2));
    
    return actorCalled(name).attemptsTo(
        Ensure.that(LastResponse.body<any>().result, equals(expectedResults))
    );
});

Then(/(.*?) token should be logged/, (name: string) => {
    console.log(chalk.whiteBright.bold.bgWhite(`\nThen ${name} token should be logged`));
    const tokenStore = TokenStore.getInstance();
    const tokenInfo = tokenStore.getToken(name);
    
    if (tokenInfo) {
        console.log(chalk.greenBright.bold.bgWhite(`Token for ${name}: ${tokenInfo.token}`));
    } else {
        console.log(chalk.greenBright.bold.bgWhite(`No token found for ${name} (no_token flag is set)`));
    }
});
