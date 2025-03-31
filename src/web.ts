import { WebPlugin } from '@capacitor/core';
import type { VoiceVideoCallPlugin, CallOptions, CallData } from './definitions';

export class VoiceVideoCallWeb extends WebPlugin implements VoiceVideoCallPlugin {
  constructor() {
    super({
      name: 'VoiceVideoCall',
      platforms: ['web'],
    });
  }

  async startCall(options: CallOptions): Promise<void> {
    console.warn('VoiceVideoCall.startCall is not implemented for web');
    throw new Error('VoiceVideoCall.startCall is not implemented for web');
  }

  async acceptCall(options: { roomId: string }): Promise<void> {
    console.warn('VoiceVideoCall.acceptCall is not implemented for web');
    throw new Error('VoiceVideoCall.acceptCall is not implemented for web');
  }

  async rejectCall(options: { roomId: string }): Promise<void> {
    console.warn('VoiceVideoCall.rejectCall is not implemented for web');
    throw new Error('VoiceVideoCall.rejectCall is not implemented for web');
  }

  async endCall(): Promise<void> {
    console.warn('VoiceVideoCall.endCall is not implemented for web');
    throw new Error('VoiceVideoCall.endCall is not implemented for web');
  }

  onCallReceived(callback: (data: CallData) => void): void {
    console.warn('VoiceVideoCall.onCallReceived is not implemented for web');
  }

  onCallEnded(callback: () => void): void {
    console.warn('VoiceVideoCall.onCallEnded is not implemented for web');
  }
}