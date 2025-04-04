# Tools and Dependencies

## Core Testing Framework

### Serenity/JS (@serenity-js/*)
- **Purpose**: Main testing framework providing:
  - Screenplay pattern for better test organization
  - Built-in reporting
  - REST API testing capabilities
  - Assertions library
- **Key Packages**:
  - `@serenity-js/core`: Core functionality
  - `@serenity-js/assertions`: Test assertions
  - `@serenity-js/rest`: REST API testing
  - `@serenity-js/cucumber`: Cucumber integration
  - `@serenity-js/console-reporter`: Test reporting

### Cucumber (@cucumber/cucumber)
- **Purpose**: BDD testing framework
- **Features**:
  - Gherkin syntax for readable tests
  - Step definitions
  - Data tables support
  - Scenario outlines

## Environment Management

### cross-env
- **Purpose**: Ensures environment variables work across platforms
- **Why We Chose It Over .env Files**:
  1. **Better for Our Use Case**:
     - Works well with our JSON configuration
     - Supports complex data structures
     - Better for managing multiple users/roles
  
  2. **Platform Independence**:
     - Windows uses `set VAR=value`
     - Unix uses `VAR=value`
     - cross-env handles these differences automatically
  
  3. **CI/CD Friendly**:
     - Easy to override in pipelines
     - No file management needed
     - Works consistently in all environments
  
  4. **Simple Implementation**:
     - No need for additional file parsing
     - Direct integration with npm scripts
     - Clear variable scope

## Development Tools

### TypeScript
- **Purpose**: Adds static typing to JavaScript
- **Related Packages**:
  - `typescript`: The compiler
  - `ts-node`: Run TypeScript directly
  - `@types/node`: Node.js type definitions

### ESLint
- **Purpose**: Code quality and style enforcement
- **Plugins**:
  - `@typescript-eslint/eslint-plugin`: TypeScript rules
  - `eslint-plugin-import`: Import/export validation
  - `eslint-plugin-simple-import-sort`: Import organization
  - `eslint-plugin-unused-imports`: Dead code detection
  - `eslint-plugin-unicorn`: Additional best practices

## Utility Tools

### rimraf
- **Purpose**: Cross-platform directory cleanup
- **Usage**: Cleans test reports directory

### npm-failsafe
- **Purpose**: Ensures cleanup runs even if tests fail
- **Usage**: Wraps test commands for reliable cleanup

### tiny-types
- **Purpose**: Value object implementation
- **Usage**: Used by Serenity/JS for type safety

### mkdirp
- **Purpose**: Cross-platform directory creation
- **Usage**: Creates necessary directories for tests

### http-server
- **Purpose**: Simple HTTP server
- **Usage**: Serves test reports locally

## Version Requirements

```json
"engines": {
  "node": "^18.12 || ^20 || ^22.0.0"
}
```

## Tool Integration Flow

1. **Test Execution Flow**:
```
npm run test:dev
↓
cross-env sets TEST_ENV=dev
↓
npm test runs
↓
failsafe ensures cleanup
↓
cucumber-js executes tests
↓
serenity-js manages execution
↓
reports generated
```

2. **Environment Configuration Flow**:
```
cross-env sets environment
↓
cucumber loads config
↓
serenity-js uses config
↓
tests run with correct settings
```

## Best Practices

1. **Environment Variables**:
   - Use cross-env for environment switching
   - Keep sensitive data in secure storage
   - Use JSON for complex configurations

2. **Test Organization**:
   - Follow Serenity/JS patterns
   - Use TypeScript for type safety
   - Keep ESLint rules enabled

3. **Maintenance**:
   - Regular dependency updates
   - Code quality checks
   - Consistent formatting
