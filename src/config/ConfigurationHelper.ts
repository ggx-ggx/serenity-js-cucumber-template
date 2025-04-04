import { Actor } from '@serenity-js/core';

export class ConfigurationHelper {
    private static config: any;
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
            username: envUsers[userKey].username,
            password: envUsers[userKey].password
        };
    }

    static getBaseUrl(): string {
        return this.config.environments[this.environment].baseUrl;
    }

    static getMathApiUrl(): string {
        return this.config.environments[this.environment].mathApiUrl;
    }

    static getActorPermissions(actorName: string): string[] {
        return this.config.actorTypes[actorName].permissions;
    }
} 