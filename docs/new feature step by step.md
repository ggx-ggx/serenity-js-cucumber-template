# Adding a New Feature - Step by Step Guide

This guide walks you through the process of adding a new feature to the test suite, using the mathjs-api as a reference example.

## 0. User Configuration (if needed)

If your feature requires new user types, you must add them to all environments in `config/environment.json`:

```json
{
  "environments": {
    "local": {
      "users": {
        "NewUserType": {"username": "newuser_local", "password": "pass_local", "description": "Description of the user type"}
      }
    },
    "dev": {
      "users": {
        "NewUserType": {"username": "newuser_dev", "password": "pass_dev", "description": "Description of the user type"}
      }
    }
    // ... other environments
  }
}
```

Important notes about user configuration:
- Add the same user type to ALL environments (local, dev, uat, stg, prd)
- Keep the user key consistent across environments
- Include username, password, and description for each user
- For users that should not receive authentication tokens, add `"no_token": true`
- Use compressed single-line formatting for better readability

## 1. Create Feature File Structure

Create a new directory for your API under `features/` following this structure:
```
features/
└── your-api-name/
    ├── your-feature.feature
    └── step_definitions/
        └── your-feature.steps.ts
```

Example from mathjs-api:
```
features/
└── mathjs-api/
    ├── expressions.feature
    └── step_definitions/
        └── expressions.steps.ts
```

## 2. Write Feature File

Create a `.feature` file with your test scenarios. Follow this template:

```gherkin
Feature: [Feature Name]

  [Optional description of the feature]

  Rule: [Rule Name]

    Scenario: [Scenario Name]
      When [Actor] [action]
      Then [pronoun] [expected outcome]

    Scenario Outline: [Scenario Name]
      When [Actor] [action] <parameter>
      Then [pronoun] [expected outcome] <expected_value>

      Examples:
        | parameter | expected_value |
        | value1    | result1        |
        | value2    | result2        |
```

Example from mathjs-api:
```gherkin
Feature: Expressions

  [math.js](https://mathjs.org/) is available as a RESTful API at [api.mathjs.org](https://api.mathjs.org/).

  Rule: One expression - one result

    Scenario Outline: Basic expressions
      When Sandra requests evaluation of <expression>
      Then she should get <expected_result>

      Examples: Basic operators
        | expression | expected_result |
        | 2 + 3      | 5               |
        | 2 - 3      | -1              |
```

## 3. Create Step Definitions

Create a `.steps.ts` file with your step definitions. Follow this template:

```typescript
import { DataTable, Then, When } from '@cucumber/cucumber';
import { Ensure, equals, property } from '@serenity-js/assertions';
import { Actor } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';
import { YourApiActions } from '../../../src/apis/your-api/actions/requests';

When('{actor} [action] {string}', 
    (actor: Actor, parameter: string) =>
        actor.attemptsTo(
            YourApiActions.someAction(parameter)
        )
);

Then('{pronoun} should [expected outcome]',
    (actor: Actor) =>
        actor.attemptsTo(
            Ensure.that(LastResponse.status(), equals(200))
        )
);
```

Example from mathjs-api:
```typescript
import { DataTable, Then, When } from '@cucumber/cucumber';
import { Ensure, equals, property } from '@serenity-js/assertions';
import { Actor } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';
import { RequestEvaluation } from '../../../src/maths-api/RequestEvaluation';

When('{actor} requests evaluation of {}', 
    (actor: Actor, expression: string) =>
        actor.attemptsTo(
            RequestEvaluation.ofASingleExpression(expression)
        )
);

Then('{pronoun} should get {float}',
    (actor: Actor, expectedResult: number) =>
        actor.attemptsTo(
            Ensure.that(LastResponse.body<number>(), equals(expectedResult))
        )
);
```

## 4. Create API Actions

Create your API actions in the `src/apis/` directory:

```typescript
import { Task } from '@serenity-js/core';
import { Send, GetRequest, PostRequest } from '@serenity-js/rest';
import { BaseApi } from '../../common/BaseApi';

export class YourApiActions extends BaseApi {
    static {
        this.baseUrl = process.env.YOUR_API_URL || 'http://localhost:3000';
        this.apiName = 'your-api';
    }

    static someAction(parameter: string): Task {
        return Task.where(`#actor performs some action with ${parameter}`,
            this.sendRequest(null, 'POST', '/endpoint', { parameter })
        );
    }
}
```

Example from mathjs-api:
```typescript
import { Task } from '@serenity-js/core';
import { GetRequest, LastResponse, PostRequest, Send } from '@serenity-js/rest';
import { GetApiPath, UrlEncodedExpression } from './get-endpoint';

export const RequestEvaluation = {
    ofASingleExpression: (expression: string): Task =>
        Task.where(`#actor requests evaluation of "${expression}"`,
            Send.a(GetRequest.to(GetApiPath.for(UrlEncodedExpression.from(expression)))),
            Ensure.that(LastResponse.status(), equals(200)),
        ),

    ofMultipleExpressions: (expressions: string[]): Task =>
        Task.where(`#actor requests evaluation of multiple expressions`,
            Send.a(PostRequest.to('/v4').with({ expr: expressions })),
            Ensure.that(LastResponse.status(), equals(200)),
        ),
};
```

## 5. Update Configuration

If your API needs specific configuration, update the Cucumber configuration in `cucumber.js`:

```javascript
module.exports = {
    default: `
        --require=features/**/*.ts
        --require-module=ts-node/register
        --format=@serenity-js/cucumber
        --world-parameters={
            "baseApiUrl":"http://api.mathjs.org/v4/",
            "yourApiUrl":"http://localhost:3000"
        }
    `,
}
```

## 6. Run Tests

Run your tests using:
```bash
npm test
```

## Best Practices

1. **Naming Conventions**:
   - Use descriptive names for features and scenarios
   - Follow the existing naming pattern for consistency
   - Use camelCase for TypeScript files and kebab-case for feature files

2. **Step Definitions**:
   - Keep step definitions focused and single-purpose
   - Use type annotations for parameters
   - Follow the existing pattern for actor and pronoun usage

3. **API Actions**:
   - Extend the BaseApi class for common functionality
   - Use Task.where for composing activities
   - Include proper error handling

4. **Feature Files**:
   - Include clear descriptions
   - Use Scenario Outlines for similar test cases
   - Keep scenarios focused and independent

5. **Documentation**:
   - Include comments explaining complex logic
   - Document API endpoints and expected responses
   - Keep this guide updated with new patterns
