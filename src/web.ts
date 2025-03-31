import { WebPlugin } from '@capacitor/core';
import type {
  VoiceVideoCallPlugin,
  InitConfig,
  CallOptions,
  CallData,
  CallStats,
  ScreenShareOptions,
  RecordingOptions,
  MediaControls,
  Participant,
  NetworkConfig,
  NetworkStatus,
  SecurityOptions,
  CallMetrics,
  BackgroundOptions,
  UIOptions,
  SignalType,
  SignalPayload
} from './definitions';
import { CallManager } from './CallManager';

export class VoiceVideoCallWeb extends WebPlugin implements VoiceVideoCallPlugin {
  private callManager: CallManager | null = null;

  constructor() {
    super({
      name: 'VoiceVideoCall',
      platforms: ['web'],
    });
  }

  async initialize(config: InitConfig): Promise<void> {
    try {
      this.callManager = new CallManager();
      await this.callManager.initialize(config);
    } catch (error) {
      throw new Error(`Failed to initialize: ${error.message}`);
    }
  }

  async startCall(options: CallOptions): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.startCall(options);
  }

  async acceptCall(options: { roomId: string; callerId: string }): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.acceptCall(options.roomId, options.callerId);
  }

  async rejectCall(options: { roomId: string; callerId: string }): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.rejectCall(options.roomId, options.callerId);
  }

  async endCall(): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.endCall();
  }

  onCallReceived(callback: (data: CallData) => void): void {
    if (!this.callManager) {
      console.warn('Plugin not initialized. Call initialize() first.');
      return;
    }
    this.callManager.on('callReceived', callback);
  }

  onCallEnded(callback: () => void): void {
    if (!this.callManager) {
      console.warn('Plugin not initialized. Call initialize() first.');
      return;
    }
    this.callManager.on('callEnded', callback);
  }

  // Call Quality and Statistics
  async getCallStats(): Promise<CallStats> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    return this.callManager.getCallStats();
  }

  onCallQualityChanged(callback: (stats: CallStats) => void): void {
    if (!this.callManager) {
      console.warn('Plugin not initialized. Call initialize() first.');
      return;
    }
    this.callManager.on('callQualityChanged', callback);
  }

  // Screen Sharing
  async startScreenShare(options: ScreenShareOptions): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.startScreenShare(options);
  }

  async stopScreenShare(): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.stopScreenShare();
  }

  onScreenShareStarted(callback: () => void): void {
    if (!this.callManager) {
      console.warn('Plugin not initialized. Call initialize() first.');
      return;
    }
    this.callManager.on('screenShareStarted', callback);
  }

  onScreenShareStopped(callback: () => void): void {
    if (!this.callManager) {
      console.warn('Plugin not initialized. Call initialize() first.');
      return;
    }
    this.callManager.on('screenShareStopped', callback);
  }

  // Recording
  async startRecording(options: RecordingOptions): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.startRecording(options);
  }

  async stopRecording(): Promise<string> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    return this.callManager.stopRecording();
  }

  onRecordingStateChanged(callback: (state: 'started' | 'stopped' | 'failed') => void): void {
    if (!this.callManager) {
      console.warn('Plugin not initialized. Call initialize() first.');
      return;
    }
    this.callManager.on('recordingStateChanged', callback);
  }

  // Media Controls
  async muteAudio(): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.muteAudio();
  }

  async unmuteAudio(): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.unmuteAudio();
  }

  async muteVideo(): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.muteVideo();
  }

  async unmuteVideo(): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.unmuteVideo();
  }

  async switchCamera(): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.switchCamera();
  }

  async setMediaControls(controls: MediaControls): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.setMediaControls(controls);
  }

  // Network Methods
  async setNetworkConfig(config: NetworkConfig): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.setNetworkConfig(config);
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    return this.callManager.getNetworkStatus();
  }

  onNetworkStatusChanged(callback: (status: NetworkStatus) => void): void {
    if (!this.callManager) {
      console.warn('Plugin not initialized. Call initialize() first.');
      return;
    }
    this.callManager.on('networkStatusChanged', callback);
  }

  // Security Methods
  async setSecurityOptions(options: SecurityOptions): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.setSecurityOptions(options);
  }

  async generateCallToken(): Promise<string> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    return this.callManager.generateCallToken();
  }

  async validateCallToken(token: string): Promise<boolean> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    return this.callManager.validateCallToken(token);
  }

  // Analytics Methods
  async getCallMetrics(): Promise<CallMetrics> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    return this.callManager.getCallMetrics();
  }

  async exportCallLogs(): Promise<string> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    return this.callManager.exportCallLogs();
  }

  onMetricsUpdated(callback: (metrics: CallMetrics) => void): void {
    if (!this.callManager) {
      console.warn('Plugin not initialized. Call initialize() first.');
      return;
    }
    this.callManager.on('metricsUpdated', callback);
  }

  // Background Mode Methods
  async setBackgroundMode(options: BackgroundOptions): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.setBackgroundMode(options);
  }

  onBackgroundModeChanged(callback: (isBackground: boolean) => void): void {
    if (!this.callManager) {
      console.warn('Plugin not initialized. Call initialize() first.');
      return;
    }
    this.callManager.on('backgroundModeChanged', callback);
  }

  // UI Methods
  async showCallUI(options: UIOptions): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.showCallUI(options);
  }

  async hideCallUI(): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.hideCallUI();
  }

  async customizeCallUI(options: Partial<UIOptions>): Promise<void> {
    if (!this.callManager) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }
    await this.callManager.customizeCallUI(options);
  }
}