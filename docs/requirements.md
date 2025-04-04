# Test Automation Requirements

## Implementation Order
Requirements are listed in the order they should be implemented. Each requirement builds upon the previous ones.

## 1. Environment Profiles
- Support multiple environment profiles (prd, stg, uat, local, dev)
- Local should be the default profile
- Each profile should have its own configuration including:
  - API endpoints
  - Environment-specific settings
  - Profile-specific users and credentials
- Example profile structure:
  ```json
  {
    "environments": {
      "local": {
        "baseUrl": "http://localhost:3000",
        "mathApiUrl": "http://api.mathjs.org/v4/",
        "users": {
          "admin1": {
            "username": "admin1_local",
            "password": "pass_local",
            "description": "Full access admin user with read and write permissions"
          },
          "admin2": {
            "username": "admin2_local",
            "password": "pass_local",
            "description": "Read-only admin user"
          },
          "customer1": {
            "username": "cust1_local",
            "password": "pass_local",
            "description": "Standard customer user with read access"
          }
        }
      },
      "dev": {
        "baseUrl": "https://dev-api.example.com",
        "mathApiUrl": "http://api.mathjs.org/v4/",
        "users": {
          "admin1": {
            "username": "admin1_dev",
            "password": "pass_dev",
            "description": "Full access admin user with read and write permissions"
          },
          "admin2": {
            "username": "admin2_dev",
            "password": "pass_dev",
            "description": "Read-only admin user"
          },
          "customer1": {
            "username": "cust1_dev",
            "password": "pass_dev",
            "description": "Standard customer user with read access"
          }
        }
      },
      "uat": {
        "baseUrl": "https://uat-api.example.com",
        "mathApiUrl": "http://api.mathjs.org/v4/",
        "users": {
          "admin1": {
            "username": "admin1_uat",
            "password": "pass_uat",
            "description": "Full access admin user with read and write permissions"
          },
          "admin2": {
            "username": "admin2_uat",
            "password": "pass_uat",
            "description": "Read-only admin user"
          },
          "customer1": {
            "username": "cust1_uat",
            "password": "pass_uat",
            "description": "Standard customer user with read access"
          }
        }
      },
      "stg": {
        "baseUrl": "https://stg-api.example.com",
        "mathApiUrl": "http://api.mathjs.org/v4/",
        "users": {
          "admin1": {
            "username": "admin1_stg",
            "password": "pass_stg",
            "description": "Full access admin user with read and write permissions"
          },
          "admin2": {
            "username": "admin2_stg",
            "password": "pass_stg",
            "description": "Read-only admin user"
          },
          "customer1": {
            "username": "cust1_stg",
            "password": "pass_stg",
            "description": "Standard customer user with read access"
          }
        }
      },
      "prd": {
        "baseUrl": "https://api.example.com",
        "mathApiUrl": "http://api.mathjs.org/v4/",
        "users": {
          "admin1": {
            "username": "admin1_prd",
            "password": "pass_prd",
            "description": "Full access admin user with read and write permissions"
          },
          "admin2": {
            "username": "admin2_prd",
            "password": "pass_prd",
            "description": "Read-only admin user"
          },
          "customer1": {
            "username": "cust1_prd",
            "password": "pass_prd",
            "description": "Standard customer user with read access"
          }
        }
      }
    }
  }
  ```

## 2. Shared Test Setup
- Create a shared setup that runs once before all tests
- Implement a mechanism to:
  - Log in multiple test users (up to 20) via API
  - Store authentication tokens in a shared configuration
  - Make tokens accessible across parallel test executions
- Support different user types:
  - AdminReadOnlyJohn
  - SignedOutCust1
  - SignedInCust2
  - [Other user types to be defined]

## 3. Login API Integration
- Integrate provided local login API
- Implement secure storage of credentials
- Support different authentication methods if needed
- Handle token refresh/expiry

## 4. Feature-Level Authentication
- Pass authentication information to each feature
- Features should be able to:
  - Pick up appropriate user context
  - Use correct authentication token
  - Handle different user roles

## 5. Token Management
- Create a shared token store
- Implement token retrieval by actor name
- Support token refresh mechanisms
- Handle token expiry scenarios

## 6. User Documentation
- Document all test users with profile-specific information:
  - Username (varies by profile)
  - Password (varies by profile)
  - Role
  - Permissions
  - Profile-specific credentials
- Example user documentation:
  ```yaml
  AdminReadOnlyJohn:
    local:
      username: john_local
      password: local_pass
    dev:
      username: john_dev
      password: dev_pass
    uat:
      username: john_uat
      password: uat_pass
    stg:
      username: john_stg
      password: stg_pass
    prd:
      username: john_prd
      password: prd_pass
    role: admin
    permissions: read_only
  
  SignedInCust1:
    local:
      username: cust1_local
      password: local_pass
    dev:
      username: cust1_dev
      password: dev_pass
    uat:
      username: cust1_uat
      password: uat_pass
    stg:
      username: cust1_stg
      password: stg_pass
    prd:
      username: cust1_prd
      password: prd_pass
    role: customer
    permissions: full_access
  ```
- Store credentials securely using environment variables or secrets management
- Support different credentials per environment
- Ensure credentials are never hardcoded in test files

## 7. New API Integration
- Add support for two new APIs
- Create feature files for new APIs
- Implement step definitions
- Follow existing patterns for consistency

## 8. Test Tagging System
Implement comprehensive tagging system with categories:
- critical-path
- prod-safe
- smoke-test (quick verification of critical paths)
- regression-test (comprehensive testing)
- feature-name
- feature-sub-name (Swagger section)
- [Additional tags to be defined]

### Test Types and Their Purpose

#### Smoke Tests
- Purpose: Quick verification of critical functionality
- Characteristics:
  - Run first in the test suite
  - Focus on basic system health
  - Quick execution (5-15 minutes)
  - Cover essential user journeys
- Examples:
  - Basic authentication
  - Core CRUD operations
  - Essential integration points

#### Regression Tests
- Purpose: Comprehensive verification of all functionality
- Characteristics:
  - Run after smoke tests
  - Cover all features and scenarios
  - Longer execution time
  - Include edge cases and error scenarios
- Examples:
  - All API endpoints
  - Complex workflows
  - Error handling
  - Data validation
  - Integration scenarios

## 9. Cross-API Integration Tests
- Support tests that span multiple APIs
- Example: Company service calling User service
- Handle dependencies between different Swagger APIs
- Manage data flow between services

## 10. Complex API Data Flows
- Support complex data flows like:
  - API2 + API3 results → API4
  - Multiple API chaining
  - Data transformation between APIs

## 11. JSON Handling in Feature Files
- Support JSON representation in feature files
- Implement exact JSON matching
- Support partial JSON matching:
  - Match only specified properties
  - Ignore unspecified properties
  - Support nested object matching
  - Handle array comparisons
- Example formats:

### Exact Matching Example
```gherkin
When I send request with data:
  """
  {
    "name": "John",
    "age": 30,
    "address": {
      "street": "123 Main St",
      "city": "Boston"
    }
  }
  """
Then I should get response with status 200 and exactly matching:
  """
  {
    "id": "123",
    "name": "John",
    "age": 30,
    "address": {
      "street": "123 Main St",
      "city": "Boston"
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
  """
```

### Partial Matching Example
```gherkin
When I search for users with filter:
  """
  {
    "name": "John",
    "active": true
  }
  """
Then I should get response with status 200 and partially matching:
  """
  {
    "users": [
      {
        "id": "123",
        "name": "John",
        "active": true
      }
    ],
    "total": 1
  }
  """
# Note: This will match as long as the specified properties match,
# ignoring any additional properties in the response
```

## 12. JSON File Loading
- Support loading JSON from file system
- JSON files can be used for:
  - Request payloads
  - Expected responses
  - Test data
- Example usage in feature files:
  ```gherkin
  When I send request with data from file "request.json"
  Then I should get response matching file "expected_response.json"
  ```

## 13. API Test Automation Structure
- Create subfolder structure for API test automation:
  ```
  src/
  └── apis/
      └── automation/
          └── json/
              └── math-api/
                  ├── au__loginuser.json
                  ├── us__createuser.json
                  └── cp__createcompany.json
  ```
- Each JSON file should contain:
  ```json
  {
    "request": {
      // Request payload
    },
    "response": {
      // Expected response
    },
    "actor": "AdminReadOnlyJohn",
    "expectedHttpCode": 200,
    "responsePartialMatch": true
  }
  ```
- File naming convention:
  - Format: `groupcode__methodname.json`
  - Use abbreviations:
    - GroupCode: 2 characters (e.g., au for auth, cp for companyprofile)
    - MethodName: full method name in lowercase (e.g., loginuser, createcompany)
  - Examples:
    - `au__loginuser.json` = auth__loginuser
    - `us__createuser.json` = user__createuser
    - `cp__createcompany.json` = companyprofile__createcompany
