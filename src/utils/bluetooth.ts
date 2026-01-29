/**
 * Web Bluetooth Service for Carcassonne Score Tracker
 * 
 * IMPORTANT BROWSER COMPATIBILITY NOTES:
 * - Chrome/Chromium (Desktop & Android): Full support ✓
 * - Edge (Desktop): Full support ✓
 * - Chrome/Firefox/Safari (iOS): NOT SUPPORTED ✗ (All iOS browsers use WebKit)
 * - Safari (macOS): NOT SUPPORTED ✗
 * - Firefox (Desktop): Limited/No support ✗
 * 
 * CRITICAL: iOS does not support Web Bluetooth in ANY browser due to Apple's
 * App Store requirement that all browsers use WebKit. This includes Chrome,
 * Firefox, and any other browser on iOS.
 * 
 * This service provides device-to-device synchronization when supported.
 */

import type { GameResult } from '../types';

// Web Bluetooth API Type Definitions
declare global {
  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
    addEventListener(type: 'gattserverdisconnected', listener: () => void): void;
    removeEventListener(type: 'gattserverdisconnected', listener: () => void): void;
  }

  interface BluetoothRemoteGATTServer {
    device: BluetoothDevice;
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    device: BluetoothDevice;
    uuid: string;
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    service: BluetoothRemoteGATTService;
    uuid: string;
    value?: DataView;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
    removeEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
  }

  interface RequestDeviceOptions {
    filters?: Array<{ services?: string[]; name?: string; namePrefix?: string }>;
    optionalServices?: string[];
  }

  interface Bluetooth {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  }

  interface Navigator {
    bluetooth?: Bluetooth;
  }
}

// Custom Bluetooth Service UUID for Carcassonne
const CARCASSONNE_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const DATA_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';
const COMMAND_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef2';

export interface SyncStatus {
  isSupported: boolean;
  isConnected: boolean;
  deviceName?: string;
  lastSyncTime?: Date;
  error?: string;
}

export type SyncEventType = 'connected' | 'disconnected' | 'dataReceived' | 'error' | 'syncComplete';

export interface SyncEvent {
  type: SyncEventType;
  data?: GameResult[];
  error?: string;
  deviceName?: string;
}

export type SyncEventListener = (event: SyncEvent) => void;

class BluetoothSyncService {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private dataCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private commandCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private listeners: SyncEventListener[] = [];

  /**
   * Check if Web Bluetooth is supported in the current browser
   */
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 
           navigator.bluetooth !== undefined &&
           typeof (navigator.bluetooth as Bluetooth).requestDevice === 'function';
  }

  /**
   * Get current connection status
   */
  getStatus(): SyncStatus {
    return {
      isSupported: this.isSupported(),
      isConnected: this.device?.gatt?.connected || false,
      deviceName: this.device?.name,
      lastSyncTime: undefined, // Can be tracked separately
    };
  }

  /**
   * Add an event listener for sync events
   */
  addEventListener(listener: SyncEventListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove an event listener
   */
  removeEventListener(listener: SyncEventListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of an event
   */
  private notifyListeners(event: SyncEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in sync event listener:', error);
      }
    });
  }

  /**
   * Connect to another device as a client
   */
  async connect(): Promise<void> {
    if (!this.isSupported()) {
      const error = 'Web Bluetooth is not supported in this browser';
      this.notifyListeners({ type: 'error', error });
      throw new Error(error);
    }

    try {
      // Request a device
      this.device = await navigator.bluetooth!.requestDevice({
        filters: [
          { services: [CARCASSONNE_SERVICE_UUID] }
        ],
        optionalServices: [CARCASSONNE_SERVICE_UUID]
      });

      // Add disconnect listener
      this.device.addEventListener('gattserverdisconnected', () => {
        this.handleDisconnect();
      });

      // Connect to GATT server
      this.server = await this.device.gatt!.connect();
      
      // Get the service
      const service = await this.server.getPrimaryService(CARCASSONNE_SERVICE_UUID);
      
      // Get characteristics
      this.dataCharacteristic = await service.getCharacteristic(DATA_CHARACTERISTIC_UUID);
      this.commandCharacteristic = await service.getCharacteristic(COMMAND_CHARACTERISTIC_UUID);

      // Set up notifications for data updates
      await this.dataCharacteristic.startNotifications();
      this.dataCharacteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
        this.handleDataReceived(event);
      });

      this.notifyListeners({ 
        type: 'connected', 
        deviceName: this.device.name 
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.notifyListeners({ type: 'error', error: errorMessage });
      throw error;
    }
  }

  /**
   * Start advertising as a server (peripheral mode)
   * Note: This requires Web Bluetooth Advertising API which is experimental
   */
  async startAdvertising(): Promise<void> {
    // Web Bluetooth Advertising API is experimental and not widely supported
    throw new Error('Bluetooth advertising is not yet supported. Please use another device to connect.');
  }

  /**
   * Disconnect from the current device
   */
  async disconnect(): Promise<void> {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.handleDisconnect();
  }

  /**
   * Handle disconnection
   */
  private handleDisconnect(): void {
    this.device = null;
    this.server = null;
    this.dataCharacteristic = null;
    this.commandCharacteristic = null;
    this.notifyListeners({ type: 'disconnected' });
  }

  /**
   * Send game data to connected device
   */
  async sendData(games: GameResult[]): Promise<void> {
    if (!this.dataCharacteristic) {
      throw new Error('Not connected to a device');
    }

    try {
      const data = JSON.stringify(games);
      const encoder = new TextEncoder();
      const encoded = encoder.encode(data);

      // Bluetooth characteristics have a size limit (typically 512 bytes)
      // For large data, we need to chunk it
      const chunkSize = 512;
      for (let i = 0; i < encoded.length; i += chunkSize) {
        const chunk = encoded.slice(i, i + chunkSize);
        await this.dataCharacteristic.writeValue(chunk);
      }

      this.notifyListeners({ type: 'syncComplete' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.notifyListeners({ type: 'error', error: errorMessage });
      throw error;
    }
  }

  /**
   * Request data from connected device
   */
  async requestData(): Promise<void> {
    if (!this.commandCharacteristic) {
      throw new Error('Not connected to a device');
    }

    try {
      const command = new TextEncoder().encode('REQUEST_DATA');
      await this.commandCharacteristic.writeValue(command);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.notifyListeners({ type: 'error', error: errorMessage });
      throw error;
    }
  }

  /**
   * Handle received data from characteristic
   */
  private handleDataReceived(event: Event): void {
    try {
      const target = event.target as unknown as BluetoothRemoteGATTCharacteristic;
      const value = target.value;
      if (!value) return;

      const decoder = new TextDecoder();
      const data = decoder.decode(value);
      const games: GameResult[] = JSON.parse(data);

      this.notifyListeners({ 
        type: 'dataReceived', 
        data: games 
      });
    } catch (error) {
      console.error('Error handling received data:', error);
      this.notifyListeners({ 
        type: 'error', 
        error: 'Failed to parse received data' 
      });
    }
  }

  /**
   * Get browser compatibility information
   */
  getBrowserCompatibility(): {
    browser: string;
    isSupported: boolean;
    message: string;
  } {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check if running on iOS (iPhone, iPad, iPod)
    // ALL browsers on iOS use WebKit and have the same limitations
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      // On iOS, all browsers (including Chrome) use WebKit and don't support Web Bluetooth
      const browserName = userAgent.includes('crios') ? 'Chrome (iOS)' : 
                         userAgent.includes('fxios') ? 'Firefox (iOS)' : 
                         userAgent.includes('safari') ? 'Safari (iOS)' : 
                         'Browser (iOS)';
      return {
        browser: browserName,
        isSupported: false,
        message: 'Web Bluetooth is not supported on iOS. All iOS browsers use WebKit which lacks this feature. Please use QR Code sync instead.'
      };
    }
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return {
        browser: 'Chrome',
        isSupported: this.isSupported(),
        message: 'Chrome has full Web Bluetooth support'
      };
    } else if (userAgent.includes('edg')) {
      return {
        browser: 'Edge',
        isSupported: this.isSupported(),
        message: 'Edge has full Web Bluetooth support'
      };
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return {
        browser: 'Safari',
        isSupported: false,
        message: 'Safari does not support Web Bluetooth. Please use Chrome or Edge on desktop/Android, or use QR Code sync.'
      };
    } else if (userAgent.includes('firefox')) {
      return {
        browser: 'Firefox',
        isSupported: false,
        message: 'Firefox has limited Web Bluetooth support. Please use Chrome or Edge on desktop/Android, or use QR Code sync.'
      };
    } else {
      return {
        browser: 'Unknown',
        isSupported: this.isSupported(),
        message: this.isSupported() 
          ? 'Web Bluetooth is supported' 
          : 'Web Bluetooth is not supported in this browser. Please use QR Code sync.'
      };
    }
  }
}

// Export a singleton instance
export const bluetoothSync = new BluetoothSyncService();
