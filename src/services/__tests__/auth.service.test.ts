import { Linking } from 'react-native';
import { authService } from '../auth.service';

// Mock dependencies
jest.mock('react-native', () => ({
  Linking: {
    canOpenURL: jest.fn(),
    openURL: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

// Mock fetch for API calls
global.fetch = jest.fn() as jest.Mock;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initiateOAuth', () => {
    it('should initiate OAuth flow successfully', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (Linking.openURL as jest.Mock).mockResolvedValue(undefined);

      await authService.initiateOAuth();

      expect(Linking.canOpenURL).toHaveBeenCalled();
      expect(Linking.openURL).toHaveBeenCalled();
      const callArgs = (Linking.openURL as jest.Mock).mock.calls[0][0];
      expect(callArgs).toContain('auth.riotgames.com/authorize');
    });

    it('should throw error if URL cannot be opened', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(false);

      await expect(authService.initiateOAuth()).rejects.toThrow(
        'Cannot open authorization URL'
      );
    });
  });

  describe('handleOAuthCallback', () => {
    it('should handle OAuth callback successfully with valid state', async () => {
      // First initiate OAuth to store the state
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (Linking.openURL as jest.Mock).mockResolvedValue(undefined);
      
      await authService.initiateOAuth();
      
      // Get the state that was generated (stored internally)
      const openUrlCall = (Linking.openURL as jest.Mock).mock.calls[0][0];
      const stateMatch = openUrlCall.match(/state=([^&]+)/);
      const state = stateMatch ? stateMatch[1] : 'test-state';
      
      const mockCode = 'auth-code-123';
      const mockUrl = `arcadeapp://auth/callback?code=${mockCode}&state=${state}`;

      // Mock token exchange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'access-token-123',
          refresh_token: 'refresh-token-123',
          expires_in: 3600,
          token_type: 'Bearer',
          scope: 'openid offline_access',
        }),
      });

      // Mock account info fetch
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          puuid: 'user-puuid-123',
          game_name: 'TestPlayer',
          tag_line: 'NA1',
        }),
      });

      const result = await authService.handleOAuthCallback(mockUrl);

      expect(result.authState.accessToken).toBe('access-token-123');
      expect(result.user.gameName).toBe('TestPlayer');
      expect(result.user.tagLine).toBe('NA1');
    });

    it('should throw error for invalid state', async () => {
      const mockUrl = 'arcadeapp://auth/callback?code=code-123&state=invalid-state-xyz';

      await expect(authService.handleOAuthCallback(mockUrl)).rejects.toThrow(
        'Invalid state parameter'
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token successfully', async () => {
      const mockRefreshToken = 'refresh-token-123';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'new-access-token-123',
          refresh_token: 'new-refresh-token-123',
          expires_in: 3600,
          token_type: 'Bearer',
          scope: 'openid offline_access',
        }),
      });

      const result = await authService.refreshToken(mockRefreshToken);

      expect(global.fetch).toHaveBeenCalled();
      expect(result.refreshToken).toBe('new-refresh-token-123');
      expect((global as any).fetch).toHaveBeenCalled();
    });

    it('should throw error if refresh fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(authService.refreshToken('invalid-token')).rejects.toThrow();
    });
  });
});


