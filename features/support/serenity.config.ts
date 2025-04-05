import { Before, BeforeAll, defineParameterType } from '@cucumber/cucumber';
import { actorCalled, actorInTheSpotlight, configure, engage } from '@serenity-js/core';
import path from 'path';
import { LoginService } from '../../src/config/LoginService';
import { ConfigurationHelper } from '../../src/config/ConfigurationHelper';
import environmentConfig from '../../config/environment.json';
import { TokenStore } from '../../src/config/TokenStore';

import { Actors } from '../../src';

/**
 * @desc
 *  Set up Serenity/JS reporting services and perform login setup before any scenarios are executed
 *
 * @see https://serenity-js.org/handbook/reporting/index.html
 */
BeforeAll(async function () {
    try {
        // Initialize configuration
        ConfigurationHelper.initialize({
            env: process.env.TEST_ENV || 'local',
            config: environmentConfig
        });

        // Configure Serenity/JS
        configure({
            // Configure Serenity/JS reporting services
            crew: [
                [ '@serenity-js/console-reporter', { theme: 'auto' } ],
                [ '@serenity-js/core:ArtifactArchiver', { outputDirectory: path.resolve(__dirname, '../../target/site/serenity') } ],
            ],
        });

        // Perform login setup
        console.log('\nStarting BeforeAll setup...');
        console.log('Current environment:', ConfigurationHelper.getLoginServiceUrl());
        
        const loginService = LoginService.getInstance();
        console.log('LoginService initialized');
        
        const users = ConfigurationHelper.getAllUsers();
        console.log('Users to login:', Object.keys(users).length);
        
        await loginService.loginAllUsers();
        console.log('All users logged in successfully\n');

        // Create ASCII table of login status
        const tokenStore = TokenStore.getInstance();
        const allUsers = Object.entries(users);
        
        // Calculate column widths
        const usernameWidth = Math.max(...allUsers.map(([username]) => username.length), 'Username'.length);
        const statusWidth = Math.max('Token Status'.length, 20);
        
        // Create table header
        const header = [
            'Username'.padEnd(usernameWidth),
            'Token Status'.padEnd(statusWidth)
        ].join(' | ');
        
        const separator = '-'.repeat(header.length);
        
        console.log('\nLogin Status Summary:');
        console.log(separator);
        console.log(header);
        console.log(separator);
        
        // Add rows for each user
        allUsers.forEach(([username, userConfig]) => {
            const tokenInfo = tokenStore.getToken(username);
            let status;
            
            if (userConfig.no_token) {
                status = 'no token required';
            } else if (tokenInfo) {
                const tokenPreview = tokenInfo.token.substring(0, 3) + '... (10 more chars)';
                status = tokenPreview;
            } else {
                status = 'login failed';
            }
            
            console.log([
                username.padEnd(usernameWidth),
                status.padEnd(statusWidth)
            ].join(' | '));
        });
        
        console.log(separator + '\n');

    } catch (error) {
        console.error('Failed to setup test environment:', error);
        throw error;
    }
});

/**
 * Engage Serenity/JS Actors before each scenario
 *
 * @see https://serenity-js.org/modules/core/function/index.html#static-function-engage
 */
Before(function () {
    engage(new Actors(this.parameters.baseApiUrl));
});

/**
 * @desc
 *  Map the '{actor}' token in Cucumber Expression to an Actor object referenced by a given name.
 *
 * @example
 *  import { Actor } from '@serenity-js/core';
 *  import { Given } from '@cucumber/cucumber';
 *
 *  Given('{actor} is registered', (actor: Actor) =>
 *      actor.attemptsTo(
 *          // ...
 *      ));
 *
 * @see https://serenity-js.org/handbook/thinking-in-serenity-js/screenplay-pattern.html#actors
 * @see https://cucumber.io/docs/cucumber/cucumber-expressions/
 * @see https://serenity-js.org/modules/core/function/index.html#static-function-actorCalled
 */
defineParameterType({
    regexp: /[A-Za-z0-9]+/,
    transformer(name: string) {
        return actorCalled(name);
    },
    name: 'actor',
});

/**
 * @desc
 *  Retrieve the most recently referenced actor using their pronoun.
 *
 * @example
 *  import { Actor } from '@serenity-js/core';
 *  import { Given } from '@cucumber/cucumber';
 *
 *  Given('{pronoun} is registered', (actor: Actor) =>
 *      actor.attemptsTo(
 *          // ...
 *      ));
 *
 * @see https://serenity-js.org/handbook/thinking-in-serenity-js/screenplay-pattern.html#actors
 * @see https://cucumber.io/docs/cucumber/cucumber-expressions/
 * @see https://serenity-js.org/modules/core/function/index.html#static-function-actorCalled
 */
defineParameterType({
    regexp: /he|she|they|his|her|their/,
    transformer() {
        return actorInTheSpotlight();
    },
    name: 'pronoun',
});
