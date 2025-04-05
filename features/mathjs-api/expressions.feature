Feature: Expressions

  [math.js](https://mathjs.org/) is available as a RESTful API at [api.mathjs.org](https://api.mathjs.org/).

  Evaluations can be done via GET or POST requests.
  The duration per evaluation of this free service is limited to 10 seconds,
  with a maximum of 10,000 requests per day.

  Rule: One expression - one result

    Scenario Outline: Basic expressions with token check

      Single expression requests can be evaluated using the [GET endpoint](https://api.mathjs.org/#get).

      When NewCust1 requests evaluation of 2 + 3
      Then NewCust1 should get single result 5
      And NewCust1 token should be logged

      Examples: Basic operators
        | actor            | expression | expected_result |
        | NewCust1       | 2 + 3      | 5               |
        | EuroCust1      | 2 - 3      | -1              |
        | NotLoggedInUser1 | 2 * 2    | 4               |

      Examples: Order of operations
        | actor            | expression | expected_result |
        | NewCust1       | 2 * 2 + 2  | 6               |
        | EuroCust1      | 2 + 2 * 2  | 6               |

  Rule: Multiple expressions - multiple results

    Scenario: Multiple expressions with token check

      Requests to evaluate multiple expression should be sent to the [POST endpoint](https://api.mathjs.org/#post).

      When NewCust1 requests evaluation of:
        | expression |
        | 2 + 3      |
        | 2 - 3      |
        | 2 * 2 + 2  |
        | 2 + 2 * 2  |
      Then NewCust1 should get multiple results:
        | expected_result |
        | 5               |
        | -1              |
        | 6               |
        | 6               |
      And NewCust1 token should be logged
