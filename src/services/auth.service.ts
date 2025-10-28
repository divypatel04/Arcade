import { Linking } from 'react-native';
import ENV from '@config/env';
import type { AuthState, User } from '@context/AuthContext';

// Riot OAuth Configuration
const RIOT_OAUTH_URL = 'https://auth.riotgames.com/authorize';
const RIOT_TOKEN_URL = 'https://auth.riotgames.com/token';
const REDIRECT_URI = 'arcadeapp://auth/callback';

interface RiotAuthConfig {
  clientId: string;
  clientSecret: string;
  scope: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface RiotAccount {
  puuid: string;
  game_name: string;
  tag_line: string;
}

class AuthService {
  private config: RiotAuthConfig;
  private authorizationCode: string | null = null;

  constructor() {
    // Load from environment variables
    this.config = {
      clientId: ENV.RIOT_CLIENT_ID,
      clientSecret: ENV.RIOT_CLIENT_SECRET,
      scope: 'openid offline_access',
    };
  }

  /**
   * Initialize OAuth flow by opening Riot's authorization page
   */
  async initiateOAuth(): Promise<void> {
    const state = this.generateRandomState();
    
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: this.config.scope,
      state: state,
    });

    const authUrl = `${RIOT_OAUTH_URL}?${params.toString()}`;

    // Store state for verification
    await this.storeState(state);

    // Open browser for OAuth
    const supported = await Linking.canOpenURL(authUrl);
    if (supported) {
      await Linking.openURL(authUrl);
    } else {
      throw new Error('Cannot open authorization URL');
    }
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleOAuthCallback(url: string): Promise<{ authState: AuthState; user: User }> {
    try {
      // Parse callback URL
      const { code, state } = this.parseCallbackUrl(url);

      // Verify state
      const storedState = await this.getStoredState();
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for tokens
      const tokenResponse = await this.exchangeCodeForToken(code);

      // Fetch user account info
      const account = await this.fetchRiotAccount(tokenResponse.access_token);

      // Build auth state
      const authState: AuthState = {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: Date.now() + tokenResponse.expires_in * 1000,
      };

      // Build user object
      const user: User = {
        id: account.puuid,
        riotId: `${account.game_name}#${account.tag_line}`,
        gameName: account.game_name,
        tagLine: account.tag_line,
        region: 'na1', // Default region, should be detected or selected by user
        puuid: account.puuid,
      };

      // Clean up stored state
      await this.clearStoredState();

      return { authState, user };
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  /**
   * Exchange authorization code for access token
   */
  private async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    try {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      });

      const response = await fetch(RIOT_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token exchange failed: ${error}`);
      }

      const data: TokenResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthState> {
    try {
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      });

      const response = await fetch(RIOT_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data: TokenResponse = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Fetch Riot account information
   */
  private async fetchRiotAccount(accessToken: string): Promise<RiotAccount> {
    try {
      const response = await fetch('https://americas.api.riotgames.com/riot/account/v1/accounts/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account info');
      }

      const data: RiotAccount = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch account error:', error);
      throw error;
    }
  }

  /**
   * Parse OAuth callback URL
   */
  private parseCallbackUrl(url: string): { code: string; state: string } {
    // Extract query parameters manually for React Native compatibility
    const queryStart = url.indexOf('?');
    if (queryStart === -1) {
      throw new Error('Invalid callback URL');
    }

    const queryString = url.substring(queryStart + 1);
    const params = queryString.split('&').reduce((acc, param) => {
      const [key, value] = param.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);

    const code = params.code;
    const state = params.state;

    if (!code || !state) {
      throw new Error('Missing code or state in callback URL');
    }

    return { code, state };
  }

  /**
   * Generate random state for CSRF protection
   */
  private generateRandomState(): string {
    // Generate random string for React Native
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Store state for verification
   */
  private async storeState(state: string): Promise<void> {
    // In a real app, store this securely
    // For now, we'll use a simple in-memory storage
    this.authorizationCode = state;
  }

  /**
   * Get stored state
   */
  private async getStoredState(): Promise<string | null> {
    return this.authorizationCode;
  }

  /**
   * Clear stored state
   */
  private async clearStoredState(): Promise<void> {
    this.authorizationCode = null;
  }
}

export const authService = new AuthService();
export default authService;
