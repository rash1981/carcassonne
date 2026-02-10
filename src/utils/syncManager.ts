/**
 * Sync Manager for handling data synchronization and conflict resolution
 */

import type { GameResult } from '../types';
import { getGameResults, saveGameResult } from './storage';
import { bluetoothSync, type SyncEvent } from './bluetooth';

export interface SyncState {
  isSyncing: boolean;
  lastSyncTime?: Date;
  error?: string;
}

class SyncManager {
  private syncState: SyncState = {
    isSyncing: false,
  };
  private stateListeners: Array<(state: SyncState) => void> = [];

  constructor() {
    // Listen to bluetooth sync events
    bluetoothSync.addEventListener(this.handleSyncEvent.bind(this));
  }

  /**
   * Add a listener for sync state changes
   */
  addStateListener(listener: (state: SyncState) => void): void {
    this.stateListeners.push(listener);
  }

  /**
   * Remove a state listener
   */
  removeStateListener(listener: (state: SyncState) => void): void {
    const index = this.stateListeners.indexOf(listener);
    if (index > -1) {
      this.stateListeners.splice(index, 1);
    }
  }

  /**
   * Notify all state listeners
   */
  private notifyStateListeners(): void {
    this.stateListeners.forEach(listener => {
      try {
        listener(this.syncState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Update sync state
   */
  private updateState(updates: Partial<SyncState>): void {
    this.syncState = { ...this.syncState, ...updates };
    this.notifyStateListeners();
  }

  /**
   * Handle bluetooth sync events
   */
  private handleSyncEvent(event: SyncEvent): void {
    switch (event.type) {
      case 'connected':
        this.updateState({ error: undefined });
        break;
      
      case 'disconnected':
        this.updateState({ isSyncing: false });
        break;
      
      case 'dataReceived':
        if (event.data) {
          const gamesAdded = this.mergeGameData(event.data);
          this.updateState({ 
            lastSyncTime: new Date(),
            isSyncing: false,
            error: gamesAdded > 0 ? undefined : 'No new games to sync'
          });
        }
        break;
      
      case 'syncComplete':
        this.updateState({ 
          lastSyncTime: new Date(),
          isSyncing: false,
          error: undefined
        });
        break;
      
      case 'error':
        this.updateState({ 
          isSyncing: false,
          error: event.error 
        });
        break;
    }
  }

  /**
   * Get current sync state
   */
  getState(): SyncState {
    return { ...this.syncState };
  }

  /**
   * Initiate a sync with a connected device
   */
  async syncWithDevice(): Promise<void> {
    try {
      this.updateState({ isSyncing: true, error: undefined });

      // Get local games
      const localGames = getGameResults();

      // Send local games to connected device
      await bluetoothSync.sendData(localGames);

      // Request games from connected device
      await bluetoothSync.requestData();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      this.updateState({ 
        isSyncing: false, 
        error: errorMessage 
      });
      throw error;
    }
  }

  /**
   * Merge received game data with local data
   * This handles conflict resolution by keeping games unique by date and players
   */
  private mergeGameData(receivedGames: GameResult[]): number {
    try {
      const localGames = getGameResults();
      
      // Create a map of local games by their unique key (date + player names)
      const localGameMap = new Map<string, GameResult>();
      localGames.forEach(game => {
        const key = this.getGameKey(game);
        localGameMap.set(key, game);
      });

      // Add received games that don't exist locally
      let newGamesCount = 0;
      receivedGames.forEach(game => {
        const key = this.getGameKey(game);
        if (!localGameMap.has(key)) {
          saveGameResult(game);
          newGamesCount++;
        }
      });

      console.log(`Sync complete: Added ${newGamesCount} new games`);
      return newGamesCount;
    } catch (error) {
      console.error('Error merging game data:', error);
      throw error;
    }
  }

  /**
   * Generate a unique key for a game result
   * Uses date and sorted player names to create a unique identifier
   */
  private getGameKey(game: GameResult): string {
    const playerNames = game.players
      .map(p => p.name)
      .sort()
      .join(',');
    return `${game.date}_${playerNames}`;
  }

  /**
   * Export all game data for manual sharing
   */
  exportGameData(): string {
    const games = getGameResults();
    return JSON.stringify(games, null, 2);
  }

  /**
   * Import game data from JSON string
   */
  importGameData(jsonData: string): { success: boolean; gamesAdded: number; error?: string } {
    try {
      const importedGames: GameResult[] = JSON.parse(jsonData);
      
      if (!Array.isArray(importedGames)) {
        return { 
          success: false, 
          gamesAdded: 0, 
          error: 'Invalid data format' 
        };
      }

      // Validate structure of each game
      for (const game of importedGames) {
        if (!game.players || !Array.isArray(game.players) || 
            !game.date || !game.winner || !Array.isArray(game.winner)) {
          return {
            success: false,
            gamesAdded: 0,
            error: 'Invalid game data structure'
          };
        }
      }

      const gamesAdded = this.mergeGameData(importedGames);
      
      return { 
        success: true, 
        gamesAdded
      };
    } catch (error) {
      return { 
        success: false, 
        gamesAdded: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Export singleton instance
export const syncManager = new SyncManager();
