export interface VoiceVideoCallPlugin {
  // Original methods
  startCall(options: { roomId: string; callType: 'audio' | 'video' }): Promise<void>;
  acceptCall(options: { roomId: string }): Promise<void>;
  rejectCall(options: { roomId: string }): Promise<void>;
  endCall(): Promise<void>;
  onCallReceived(callback: (data: CallData) => void): void;
  onCallEnded(callback: () => void): void;

  // Call Quality and Statistics
  getCallStats(): Promise<CallStats>;
  onCallQualityChanged(callback: (stats: CallStats) => void): void;

  // Screen Sharing
  startScreenShare(options: ScreenShareOptions): Promise<void>;
  stopScreenShare(): Promise<void>;
  onScreenShareStarted(callback: () => void): void;
  onScreenShareStopped(callback: () => void): void;

  // Recording
  startRecording(options: RecordingOptions): Promise<void>;
  stopRecording(): Promise<string>;
  onRecordingStateChanged(callback: (state: RecordingState) => void): void;

  // Advanced Call Controls
  muteAudio(): Promise<void>;
  unmuteAudio(): Promise<void>;
  muteVideo(): Promise<void>;
  unmuteVideo(): Promise<void>;
  switchCamera(): Promise<void>;
  setMediaControls(controls: MediaControls): Promise<void>;

  // Multi-Party Calls
  addParticipant(participantId: string): Promise<void>;
  removeParticipant(participantId: string): Promise<void>;
  getParticipants(): Promise<Participant[]>;
  onParticipantJoined(callback: (participant: Participant) => void): void;
  onParticipantLeft(callback: (participantId: string) => void): void;

  // Network Handling
  setNetworkConfig(config: NetworkConfig): Promise<void>;
  getNetworkStatus(): Promise<NetworkStatus>;
  onNetworkStatusChanged(callback: (status: NetworkStatus) => void): void;

  // Security
  setSecurityOptions(options: SecurityOptions): Promise<void>;
  generateCallToken(): Promise<string>;
  validateCallToken(token: string): Promise<boolean>;

  // Analytics
  getCallMetrics(): Promise<CallMetrics>;
  exportCallLogs(): Promise<string>;
  onMetricsUpdated(callback: (metrics: CallMetrics) => void): void;

  // Background Mode
  setBackgroundMode(options: BackgroundOptions): Promise<void>;
  onBackgroundModeChanged(callback: (isBackground: boolean) => void): void;

  // UI Components
  showCallUI(options: UIOptions): Promise<void>;
  hideCallUI(): Promise<void>;
  customizeCallUI(options: Partial<UIOptions>): Promise<void>;
}

// Original interfaces
export interface CallOptions {
  roomId: string;
  callType: 'audio' | 'video';
}

export interface CallData {
  callerId: string;
  roomId: string;
  callType: 'audio' | 'video';
}

// New interfaces for enhancements
export interface CallStats {
  bitrate: number;
  packetLoss: number;
  roundTripTime: number;
  audioLevel: number;
  videoResolution?: {
    width: number;
    height: number;
    frameRate: number;
  };
}

export interface ScreenShareOptions {
  audio: boolean;
  systemAudio?: boolean;
}

export interface RecordingOptions {
  type: 'audio' | 'video' | 'both';
  quality?: 'low' | 'medium' | 'high';
  storage: 'local' | 'cloud';
}

export type RecordingState = 'started' | 'stopped' | 'failed';

export interface MediaControls {
  enableNoiseSupression?: boolean;
  enableEchoCancellation?: boolean;
  enableAutoGainControl?: boolean;
  videoQuality?: 'low' | 'medium' | 'high';
}

export interface Participant {
  id: string;
  name: string;
  mediaState: {
    audio: boolean;
    video: boolean;
    screen?: boolean;
  };
}

export interface NetworkConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize?: number;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export interface NetworkStatus {
  connected: boolean;
  quality: 'poor' | 'medium' | 'good';
  bandwidth: number;
}

export interface SecurityOptions {
  encryption: 'default' | 'e2ee';
  roomPassword?: string;
  allowedDomains?: string[];
}

export interface CallMetrics {
  duration: number;
  quality: {
    audio: number;
    video?: number;
  };
  networkStats: {
    packetsLost: number;
    jitter: number;
    roundTripTime: number;
  };
  events: Array<{
    type: string;
    timestamp: number;
    data: any;
  }>;
}

export interface BackgroundOptions {
  enabled: boolean;
  audioOnly?: boolean;
  keepAlive?: boolean;
  notification?: {
    title: string;
    message: string;
    icon?: string;
  };
}

export interface UIOptions {
  theme: 'light' | 'dark' | 'system';
  layout: 'grid' | 'spotlight' | 'sidebar';
  buttons: {
    mute?: boolean;
    video?: boolean;
    screenShare?: boolean;
    participants?: boolean;
    chat?: boolean;
  };
}

export interface RTCIceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}