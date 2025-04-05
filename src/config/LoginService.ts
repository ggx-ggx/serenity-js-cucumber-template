import axios from 'axios';
import { ConfigurationHelper } from './ConfigurationHelper';
import { TokenStore, TokenInfo } from './TokenStore';
import sharedConfig from '../../config/shared-config.json';

export class LoginService {
  private static instance: LoginService;
  private tokenStore: TokenStore;

  private constructor() {
    this.tokenStore = TokenStore.getInstance();
  }

  static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  async loginUser(username: string, password: string): Promise<TokenInfo> {
    const loginUrl = `${ConfigurationHelper.getLoginServiceUrl()}/public/login`;
    console.log(`Attempting login for user: ${username} at ${loginUrl}`);
    
    try {
      const response = await axios.post(loginUrl, {
        username,
        pwd: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`Login successful for user: ${username}`);
      const tokenInfo: TokenInfo = {
        token: response.data.aaaa_token,
        userInfo: response.data.user_info,
        session: response.data.session,
        additional_data: response.data.additional_data
      };

      this.tokenStore.setToken(username, tokenInfo);
      return tokenInfo;
    } catch (error: any) {
      console.error(`Login failed for user ${username}:`, error.message);
      throw new Error(`Login failed for user ${username}: ${error.message}`);
    }
  }

  async loginAllUsers(): Promise<void> {
    const users = ConfigurationHelper.getAllUsers();
    const maxConcurrent = sharedConfig.parallelLogin.maxConcurrent;
    const retryAttempts = sharedConfig.parallelLogin.retryAttempts;
    const retryDelayMs = sharedConfig.parallelLogin.retryDelayMs;

    console.log('Starting parallel login process');
    console.log(`Max concurrent logins: ${maxConcurrent}`);
    console.log(`Retry attempts: ${retryAttempts}`);
    console.log(`Retry delay: ${retryDelayMs}ms`);

    // Filter out users with no_token property
    const usersToLogin = Object.entries(users)
      .filter(([_, user]) => !user.no_token)
      .map(([username, _]) => username);

    console.log(`Total users to login: ${usersToLogin.length}`);
    console.log('Users to login:', usersToLogin);

    // Process users in batches
    for (let i = 0; i < usersToLogin.length; i += maxConcurrent) {
      const batch = usersToLogin.slice(i, i + maxConcurrent);
      console.log(`Processing batch ${i/maxConcurrent + 1}:`, batch);
      
      const loginPromises = batch.map(username => 
        this.retryLogin(username, users[username].password, retryAttempts, retryDelayMs)
      );
      
      await Promise.all(loginPromises);
      console.log(`Batch ${i/maxConcurrent + 1} completed`);
    }
  }

  private async retryLogin(
    username: string, 
    password: string, 
    attempts: number, 
    delayMs: number
  ): Promise<void> {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${attempts} for user ${username}`);
        await this.loginUser(username, password);
        return;
      } catch (error: any) {
        if (attempt === attempts) {
          console.error(`All retry attempts failed for user ${username}`);
          throw error;
        }
        console.log(`Retrying login for ${username} in ${delayMs}ms`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  getToken(username: string): TokenInfo | undefined {
    return this.tokenStore.getToken(username);
  }

  clearTokens(): void {
    this.tokenStore.clearAllTokens();
  }
} 