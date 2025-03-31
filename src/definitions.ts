export interface VoiceVideoCallPlugin {
  startCall(options: { roomId: string; callType: 'audio' | 'video' }): Promise<void>;
  acceptCall(options: { roomId: string }): Promise<void>;
  rejectCall(options: { roomId: string }): Promise<void>;
  endCall(): Promise<void>;
  onCallReceived(callback: (data: { 
    callerId: string; 
    roomId: string; 
    callType: 'audio' | 'video' 
  }) => void): void;
  onCallEnded(callback: () => void): void;
}

export interface CallOptions {
  roomId: string;
  callType: 'audio' | 'video';
}

export interface CallData {
  callerId: string;
  roomId: string;
  callType: 'audio' | 'video';
}

export interface WebRTCSessionDescription {
  type: 'offer' | 'answer';
  sdp: string;
}

export interface IceCandidate {
  candidate: string;
  sdpMLineIndex: number;
  sdpMid: string;
}