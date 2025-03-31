export interface VoiceVideoCallPlugin {
  // Configuration
  initialize(config: InitConfig): Promise<void>;
  
  // Call Methods
  startCall(options: CallOptions): Promise<void>;
  acceptCall(options: { roomId: string; callerId: string }): Promise<void>;
  rejectCall(options: { roomId: string; callerId: string }): Promise<void>;
  endCall(): Promise<void>;
  
  // Event Listeners
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

  // Media Controls
  muteAudio(): Promise<void>;
  unmuteAudio(): Promise<void>;
  muteVideo(): Promise<void>;
  unmuteVideo(): Promise<void>;
  switchCamera(): Promise<void>;
  setMediaControls(controls: MediaControls): Promise<void>;

  // Network
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

  // UI
  showCallUI(options: UIOptions): Promise<void>;
  hideCallUI(): Promise<void>;
  customizeCallUI(options: Partial<UIOptions>): Promise<void>;
}

export interface InitConfig {
  // EasyRTC Configuration
  easyrtc: {
    serverUrl: string;
    appName?: string;
    enableDebug?: boolean;
  };
  // OneSignal Configuration
  onesignal: {
    appId: string;
    notificationConfig?: {
      sound?: string;
      priority?: 'default' | 'high';
      timeToLive?: number;
    };
  };
}

export interface CallOptions {
  roomId: string;
  callType: 'audio' | 'video';
  receiverId: string; // OneSignal user ID
  metadata?: {
    callerName?: string;
    callerAvatar?: string;
    [key: string]: any;
  };
}

export interface CallData {
  callerId: string;
  roomId: string;
  callType: 'audio' | 'video';
  easyrtcSessionId?: string;
  metadata?: {
    callerName?: string;
    callerAvatar?: string;
    [key: string]: any;
  };
}

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

export enum SignalType {
  CALL_OFFER = 'call_offer',
  CALL_ACCEPT = 'call_accept',
  CALL_REJECT = 'call_reject',
  CALL_END = 'call_end'
}

export interface SignalPayload {
  type: SignalType;
  roomId: string;
  callerId: string;
  receiverId: string;
  easyrtcSessionId?: string;
  metadata?: any;
}