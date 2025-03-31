import { 
  InitConfig, 
  CallOptions, 
  CallStats, 
  ScreenShareOptions,
  RecordingOptions,
  MediaControls,
  NetworkConfig,
  NetworkStatus,
  SecurityOptions,
  CallMetrics,
  BackgroundOptions,
  UIOptions,
  SignalType,
  SignalPayload
} from './definitions';

declare const easyrtc: any;
declare const OneSignal: any;

export class CallManager {
  private easyrtc: any;
  private oneSignal: any;
  private activeRoom: string | null = null;
  private activeCall: boolean = false;
  private eventListeners: Map<string, Function[]> = new Map();
  private localStream: MediaStream | null = null;
  private remoteStreams: Map<string, MediaStream> = new Map();
  private screenShareStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;

  constructor() {
    this.setupEventListeners();
  }

  public async initialize(config: InitConfig): Promise<void> {
    try {
      await this.initializeOneSignal(config.onesignal);
      await this.initializeEasyRTC(config.easyrtc);
    } catch (error) {
      throw new Error(`Failed to initialize: ${error.message}`);
    }
  }

  public async startCall(options: CallOptions): Promise<void> {
    try {
      const mediaConstraints = {
        audio: true,
        video: options.callType === 'video'
      };
      
      this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      await this.sendCallNotification(options);

      return new Promise<void>((resolve, reject) => {
        easyrtc.joinRoom(
          options.roomId,
          null,
          () => {
            this.activeRoom = options.roomId;
            this.activeCall = true;
            easyrtc.addStreamToCall(this.localStream);
            resolve();
          },
          (errorCode: string, errorText: string) => {
            reject(new Error(`Failed to join room: ${errorText}`));
          }
        );
      });
    } catch (error) {
      throw new Error(`Failed to start call: ${error.message}`);
    }
  }

  public async acceptCall(roomId: string, callerId: string): Promise<void> {
    try {
      if (!this.localStream) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
      }

      await new Promise<void>((resolve, reject) => {
        easyrtc.joinRoom(
          roomId,
          null,
          () => {
            this.activeRoom = roomId;
            this.activeCall = true;
            easyrtc.addStreamToCall(this.localStream);
            resolve();
          },
          reject
        );
      });

      await this.sendSignal({
        type: SignalType.CALL_ACCEPT,
        roomId,
        callerId,
        receiverId: callerId,
        easyrtcSessionId: await this.getEasyRTCId()
      });
    } catch (error) {
      throw new Error(`Failed to accept call: ${error.message}`);
    }
  }

  public async rejectCall(roomId: string, callerId: string): Promise<void> {
    try {
      await this.sendSignal({
        type: SignalType.CALL_REJECT,
        roomId,
        callerId,
        receiverId: callerId
      });
    } catch (error) {
      throw new Error(`Failed to reject call: ${error.message}`);
    }
  }

  public async endCall(): Promise<void> {
    try {
      if (this.activeRoom && this.activeCall) {
        await this.sendSignal({
          type: SignalType.CALL_END,
          roomId: this.activeRoom,
          callerId: await this.getEasyRTCId(),
          receiverId: '*'
        });
        
        easyrtc.leaveRoom(this.activeRoom);
        this.cleanup();
      }
    } catch (error) {
      throw new Error(`Failed to end call: ${error.message}`);
    }
  }

  public async getCallStats(): Promise<CallStats> {
    return new Promise<CallStats>((resolve) => {
      easyrtc.getStats(null, (stats: any) => {
        resolve(this.parseCallStats(stats));
      });
    });
  }

  public async startScreenShare(options: ScreenShareOptions): Promise<void> {
    try {
      this.screenShareStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: options.audio
      });

      if (this.activeCall) {
        easyrtc.addStreamToCall(this.screenShareStream, 'screen');
      }

      this.emit('screenShareStarted', {});
    } catch (error) {
      throw new Error(`Failed to start screen sharing: ${error.message}`);
    }
  }

  public async stopScreenShare(): Promise<void> {
    if (this.screenShareStream) {
      this.screenShareStream.getTracks().forEach(track => track.stop());
      if (this.activeCall) {
        easyrtc.removeStreamFromCall(this.screenShareStream, 'screen');
      }
      this.screenShareStream = null;
      this.emit('screenShareStopped', {});
    }
  }

  public async startRecording(options: RecordingOptions): Promise<void> {
    // Implementation
  }

  public async stopRecording(): Promise<string> {
    return new Promise<string>((resolve) => resolve(''));
  }

  public async muteAudio(): Promise<void> {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => track.enabled = false);
    }
  }

  public async unmuteAudio(): Promise<void> {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => track.enabled = true);
    }
  }

  public async muteVideo(): Promise<void> {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => track.enabled = false);
    }
  }

  public async unmuteVideo(): Promise<void> {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => track.enabled = true);
    }
  }

  public async switchCamera(): Promise<void> {
    // Implementation
  }

  public async setMediaControls(controls: MediaControls): Promise<void> {
    // Implementation
  }

  public async setNetworkConfig(config: NetworkConfig): Promise<void> {
    // Implementation
  }

  public async getNetworkStatus(): Promise<NetworkStatus> {
    return {
      connected: true,
      quality: 'good',
      bandwidth: 0
    };
  }

  public async setSecurityOptions(options: SecurityOptions): Promise<void> {
    // Implementation
  }

  public async generateCallToken(): Promise<string> {
    return new Promise<string>((resolve) => resolve(''));
  }

  public async validateCallToken(token: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => resolve(true));
  }

  public async getCallMetrics(): Promise<CallMetrics> {
    return {
      duration: 0,
      quality: { audio: 0 },
      networkStats: {
        packetsLost: 0,
        jitter: 0,
        roundTripTime: 0
      },
      events: []
    };
  }

  public async exportCallLogs(): Promise<string> {
    return new Promise<string>((resolve) => resolve(''));
  }

  public async setBackgroundMode(options: BackgroundOptions): Promise<void> {
    // Implementation
  }

  public async showCallUI(options: UIOptions): Promise<void> {
    // Implementation
  }

  public async hideCallUI(): Promise<void> {
    // Implementation
  }

  public async customizeCallUI(options: Partial<UIOptions>): Promise<void> {
    // Implementation
  }

  public on(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }

  private async initializeOneSignal(config: InitConfig['onesignal']): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        OneSignal.init({
          appId: config.appId,
          notifyButton: { enable: false },
          allowLocalhostAsSecureOrigin: true,
        });
        OneSignal.setDefaultNotificationUrl(window.location.origin);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private async initializeEasyRTC(config: InitConfig['easyrtc']): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        easyrtc.setSocketUrl(config.serverUrl);
        if (config.enableDebug) {
          easyrtc.enableDebug(true);
        }
        easyrtc.connect(config.appName || 'default', 
          () => {
            this.setupEasyRTCListeners();
            resolve();
          },
          (errorCode: string, errorText: string) => {
            reject(new Error(`EasyRTC connection failed: ${errorText}`));
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupEventListeners(): void {
    document.addEventListener('deviceready', () => {
      OneSignal.setNotificationWillShowInForegroundHandler(
        (notificationReceivedEvent: any) => {
          const notification = notificationReceivedEvent.getNotification();
          const data = notification.additionalData;
          if (data.type === SignalType.CALL_OFFER) {
            this.emit('callReceived', {
              callerId: data.callerId,
              roomId: data.roomId,
              callType: data.callType,
              metadata: data.metadata
            });
          }
        }
      );
    });
  }

  private setupEasyRTCListeners(): void {
    easyrtc.setRoomOccupantListener((roomName: string, occupants: any) => {
      this.emit('participantsChanged', Object.keys(occupants));
    });

    easyrtc.setStreamAcceptor((easyrtcid: string, stream: MediaStream) => {
      this.remoteStreams.set(easyrtcid, stream);
      this.emit('streamReceived', { easyrtcid, stream });
    });

    easyrtc.setDisconnectListener(() => {
      this.handleDisconnection();
    });
  }

  private async getEasyRTCId(): Promise<string> {
    return new Promise<string>((resolve) => {
      resolve(easyrtc.myEasyrtcid);
    });
  }

  private async sendCallNotification(options: CallOptions): Promise<void> {
    const notification = {
      contents: {
        en: `Incoming ${options.callType} call${options.metadata?.callerName ? ' from ' + options.metadata.callerName : ''}`
      },
      headings: { en: 'Incoming Call' },
      data: {
        type: SignalType.CALL_OFFER,
        roomId: options.roomId,
        callType: options.callType,
        callerId: await this.getEasyRTCId(),
        metadata: options.metadata
      },
      include_player_ids: [options.receiverId],
      android_channel_id: "voice_video_calls",
      priority: 10,
      ttl: 30
    };

    await OneSignal.postNotification(notification);
  }

  private async sendSignal(payload: SignalPayload): Promise<void> {
    const notification = {
      contents: { en: 'Call Signal' },
      data: payload,
      include_player_ids: [payload.receiverId],
      android_channel_id: "voice_video_calls",
      priority: 10,
      ttl: 30
    };

    await OneSignal.postNotification(notification);
  }

  private handleDisconnection(): void {
    if (this.activeCall) {
      this.cleanup();
      this.emit('callEnded', {});
    }
  }

  private cleanup(): void {
    this.activeCall = false;
    this.activeRoom = null;
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    this.remoteStreams.forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
    this.remoteStreams.clear();

    if (this.screenShareStream) {
      this.screenShareStream.getTracks().forEach(track => track.stop());
      this.screenShareStream = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
  }

  private parseCallStats(stats: any): CallStats {
    return {
      bitrate: stats.bitrate || 0,
      packetLoss: stats.packetLoss || 0,
      roundTripTime: stats.roundTripTime || 0,
      audioLevel: stats.audioLevel || 0,
      videoResolution: stats.resolution ? {
        width: stats.resolution.width,
        height: stats.resolution.height,
        frameRate: stats.resolution.frameRate
      } : undefined
    };
  }
}