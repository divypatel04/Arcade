import AsyncStorage from '@react-native-async-storage/async-storage';
import { valorantApi } from './valorant.api';
import { getMatches, saveMatch } from '@lib/supabase';
import { generateAgentStats, generateMapStats, generateSeasonStats, mergeAgentStats, mergeMapStats } from '@utils/dataGenerators';
import type { Match } from '@context/DataContext';

const UPDATE_STATUS_KEY = '@arcade_update_status';
const LAST_UPDATE_KEY = '@arcade_last_update';

export interface UpdateStatus {
  isUpdating: boolean;
  progress: number;
  lastUpdate: string | null;
  error: string | null;
}

class ProcessService {
  private isProcessing = false;

  /**
   * Get current update status
   */
  async getUpdateStatus(): Promise<UpdateStatus> {
    try {
      const statusStr = await AsyncStorage.getItem(UPDATE_STATUS_KEY);
      if (statusStr) {
        return JSON.parse(statusStr);
      }
    } catch (error) {
      console.error('Error getting update status:', error);
    }

    return {
      isUpdating: false,
      progress: 0,
      lastUpdate: null,
      error: null,
    };
  }

  /**
   * Set update status
   */
  private async setUpdateStatus(status: UpdateStatus): Promise<void> {
    try {
      await AsyncStorage.setItem(UPDATE_STATUS_KEY, JSON.stringify(status));
    } catch (error) {
      console.error('Error setting update status:', error);
    }
  }

  /**
   * Process and update user data
   */
  async processUserData(
    userId: string,
    puuid: string,
    region: string
  ): Promise<{
    success: boolean;
    newMatches: number;
    error?: string;
  }> {
    if (this.isProcessing) {
      return {
        success: false,
        newMatches: 0,
        error: 'Update already in progress',
      };
    }

    this.isProcessing = true;

    try {
      // Update status
      await this.setUpdateStatus({
        isUpdating: true,
        progress: 0,
        lastUpdate: null,
        error: null,
      });

      // Step 1: Fetch existing matches from database (10%)
      await this.setUpdateStatus({
        isUpdating: true,
        progress: 10,
        lastUpdate: null,
        error: null,
      });

      const existingMatches = await getMatches(userId);
      const existingMatchIds = new Set(existingMatches.map(m => m.matchId));

      // Step 2: Fetch new matches from Valorant API (40%)
      await this.setUpdateStatus({
        isUpdating: true,
        progress: 40,
        lastUpdate: null,
        error: null,
      });

      const apiMatches = await valorantApi.batchFetchMatches(region, puuid, 20, 3);

      // Step 3: Filter out existing matches (50%)
      await this.setUpdateStatus({
        isUpdating: true,
        progress: 50,
        lastUpdate: null,
        error: null,
      });

      const newMatches = apiMatches.filter(m => !existingMatchIds.has(m.matchId));

      if (newMatches.length === 0) {
        await this.setUpdateStatus({
          isUpdating: false,
          progress: 100,
          lastUpdate: new Date().toISOString(),
          error: null,
        });

        this.isProcessing = false;
        return {
          success: true,
          newMatches: 0,
        };
      }

      // Step 4: Save new matches to database (70%)
      await this.setUpdateStatus({
        isUpdating: true,
        progress: 70,
        lastUpdate: null,
        error: null,
      });

      for (const match of newMatches) {
        await saveMatch(userId, match);
      }

      // Step 5: Generate and update stats (90%)
      await this.setUpdateStatus({
        isUpdating: true,
        progress: 90,
        lastUpdate: null,
        error: null,
      });

      // TODO: Generate and save agent, map, weapon stats to database
      // This would involve calling the data generators and saving to Supabase

      // Complete
      await this.setUpdateStatus({
        isUpdating: false,
        progress: 100,
        lastUpdate: new Date().toISOString(),
        error: null,
      });

      this.isProcessing = false;

      return {
        success: true,
        newMatches: newMatches.length,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await this.setUpdateStatus({
        isUpdating: false,
        progress: 0,
        lastUpdate: null,
        error: errorMessage,
      });

      this.isProcessing = false;

      return {
        success: false,
        newMatches: 0,
        error: errorMessage,
      };
    }
  }

  /**
   * Check if data needs updating
   */
  async needsUpdate(): Promise<boolean> {
    try {
      const lastUpdateStr = await AsyncStorage.getItem(LAST_UPDATE_KEY);
      if (!lastUpdateStr) return true;

      const lastUpdate = new Date(lastUpdateStr);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      // Update if more than 1 hour has passed
      return hoursSinceUpdate >= 1;
    } catch (error) {
      console.error('Error checking update need:', error);
      return true;
    }
  }

  /**
   * Clear update status
   */
  async clearUpdateStatus(): Promise<void> {
    try {
      await AsyncStorage.removeItem(UPDATE_STATUS_KEY);
    } catch (error) {
      console.error('Error clearing update status:', error);
    }
  }
}

export const processService = new ProcessService();
export default processService;
