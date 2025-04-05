import { Actor } from '@serenity-js/core';

interface UserConfig {
  password: string;
  description: string;
  no_token?: boolean;
}

interface EnvironmentConfig {
  baseUrl: string;
  mathApiUrl: string;
  'login-svc-base-url': string;
  users: Record<string, UserConfig>;
}

interface Config {
  environments: Record<string, EnvironmentConfig>;
}

export class ConfigurationHelper {
    private static config: Config;
    private static environment: string;

    static initialize(worldParameters: any) {
        this.environment = worldParameters.env;
        this.config = worldParameters.config;
    }

    static getActorCredentials(userKey: string): { username: string, password: string } {
        const envUsers = this.config.environments[this.environment].users;
        
        if (!envUsers[userKey]) {
            throw new Error(`User ${userKey} not found in ${this.environment} environment`);
        }

        return {
            username: userKey,
            password: envUsers[userKey].password
        };
    }

    static getBaseUrl(): string {
        return this.config.environments[this.environment].baseUrl;
    }

    static getMathApiUrl(): string {
        return this.config.environments[this.environment].mathApiUrl;
    }

    static getLoginServiceUrl(): string {
        return this.config.environments[this.environment]['login-svc-base-url'];
    }

    static getAllUsers(): Record<string, UserConfig> {
        return this.config.environments[this.environment].users;
    }
} 