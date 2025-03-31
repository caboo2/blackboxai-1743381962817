import { WebPlugin } from '@capacitor/core';
import type {
  VoiceVideoCallPlugin,
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
  UIOptions
} from './definitions';

export class VoiceVideoCallWeb extends WebPlugin implements VoiceVideoCallPlugin {
  constructor() {
    super({
      name: 'VoiceVideoCall',
      platforms: ['web'],
    });
  }

  // Original methods
  async startCall(options: CallOptions): Promise<void> {
    console.warn('VoiceVideoCall.startCall is not implemented for web');
    throw this.unimplemented('Not implemented on web.');
  }

  async acceptCall(options: { roomId: string }): Promise<void> {
    console.warn('VoiceVideoCall.acceptCall is not implemented for web');
    throw this.unimplemented('Not implemented on web.');
  }

  async rejectCall(options: { roomId: string }): Promise<void> {
    console.warn('VoiceVideoCall.rejectCall is not implemented for web');
    throw this.unimplemented('Not implemented on web.');
  }

  async endCall(): Promise<void> {
    console.warn('VoiceVideoCall.endCall is not implemented for web');
    throw this.unimplemented('Not implemented on web.');
  }

  onCallReceived(callback: (data: CallData) => void): void {
    console.warn('VoiceVideoCall.onCallReceived is not implemented for web');
  }

  onCallEnded(callback: () => void): void {
    console.warn('VoiceVideoCall.onCallEnded is not implemented for web');
  }

  // Call Quality and Statistics
  async getCallStats(): Promise<CallStats> {
    throw this.unimplemented('Not implemented on web.');
  }

  onCallQualityChanged(callback: (stats: CallStats) => void): void {
    console.warn('VoiceVideoCall.onCallQualityChanged is not implemented for web');
  }

  // Screen Sharing
  async startScreenShare(options: ScreenShareOptions): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async stopScreenShare(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  onScreenShareStarted(callback: () => void): void {
    console.warn('VoiceVideoCall.onScreenShareStarted is not implemented for web');
  }

  onScreenShareStopped(callback: () => void): void {
    console.warn('VoiceVideoCall.onScreenShareStopped is not implemented for web');
  }

  // Recording
  async startRecording(options: RecordingOptions): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async stopRecording(): Promise<string> {
    throw this.unimplemented('Not implemented on web.');
  }

  onRecordingStateChanged(callback: (state: 'started' | 'stopped' | 'failed') => void): void {
    console.warn('VoiceVideoCall.onRecordingStateChanged is not implemented for web');
  }

  // Advanced Call Controls
  async muteAudio(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async unmuteAudio(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async muteVideo(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async unmuteVideo(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async switchCamera(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async setMediaControls(controls: MediaControls): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  // Multi-Party Calls
  async addParticipant(participantId: string): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async removeParticipant(participantId: string): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async getParticipants(): Promise<Participant[]> {
    throw this.unimplemented('Not implemented on web.');
  }

  onParticipantJoined(callback: (participant: Participant) => void): void {
    console.warn('VoiceVideoCall.onParticipantJoined is not implemented for web');
  }

  onParticipantLeft(callback: (participantId: string) => void): void {
    console.warn('VoiceVideoCall.onParticipantLeft is not implemented for web');
  }

  // Network Handling
  async setNetworkConfig(config: NetworkConfig): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    throw this.unimplemented('Not implemented on web.');
  }

  onNetworkStatusChanged(callback: (status: NetworkStatus) => void): void {
    console.warn('VoiceVideoCall.onNetworkStatusChanged is not implemented for web');
  }

  // Security
  async setSecurityOptions(options: SecurityOptions): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async generateCallToken(): Promise<string> {
    throw this.unimplemented('Not implemented on web.');
  }

  async validateCallToken(token: string): Promise<boolean> {
    throw this.unimplemented('Not implemented on web.');
  }

  // Analytics
  async getCallMetrics(): Promise<CallMetrics> {
    throw this.unimplemented('Not implemented on web.');
  }

  async exportCallLogs(): Promise<string> {
    throw this.unimplemented('Not implemented on web.');
  }

  onMetricsUpdated(callback: (metrics: CallMetrics) => void): void {
    console.warn('VoiceVideoCall.onMetricsUpdated is not implemented for web');
  }

  // Background Mode
  async setBackgroundMode(options: BackgroundOptions): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  onBackgroundModeChanged(callback: (isBackground: boolean) => void): void {
    console.warn('VoiceVideoCall.onBackgroundModeChanged is not implemented for web');
  }

  // UI Components
  async showCallUI(options: UIOptions): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async hideCallUI(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async customizeCallUI(options: Partial<UIOptions>): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }
}