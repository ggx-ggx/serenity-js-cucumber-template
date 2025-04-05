import { ConfigurationHelper } from './ConfigurationHelper';

export interface TokenInfo {
  token: string;
  userInfo: {
    user_guid: string;
    username: string;
    email: string;
    role: string;
    description: string;
  };
  session: {
    id: string;
    expires_in: number;
    created_at: string;
  };
  additional_data: any;
}

export class TokenStore {
  private static instance: TokenStore;
  private tokens: Map<string, TokenInfo> = new Map();
  private expiryCheckInterval: NodeJS.Timeout;

  private constructor() {
    // Start checking for expired tokens
    this.expiryCheckInterval = setInterval(() => this.checkExpiredTokens(), 60000);
  }

  static getInstance(): TokenStore {
    if (!TokenStore.instance) {
      TokenStore.instance = new TokenStore();
    }
    return TokenStore.instance;
  }

  setToken(username: string, tokenInfo: TokenInfo): void {
    this.tokens.set(username, tokenInfo);
  }

  getToken(username: string): TokenInfo | undefined {
    return this.tokens.get(username);
  }

  clearToken(username: string): void {
    this.tokens.delete(username);
  }

  clearAllTokens(): void {
    this.tokens.clear();
  }

  private checkExpiredTokens(): void {
    const now = new Date();
    for (const [username, tokenInfo] of this.tokens.entries()) {
      const expiryDate = new Date(tokenInfo.session.created_at);
      expiryDate.setSeconds(expiryDate.getSeconds() + tokenInfo.session.expires_in);
      
      if (now > expiryDate) {
        this.clearToken(username);
      }
    }
  }

  destroy(): void {
    clearInterval(this.expiryCheckInterval);
    this.clearAllTokens();
  }
} 