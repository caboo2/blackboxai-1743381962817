# Capacitor Voice Video Call Plugin

A Capacitor plugin that enables voice and video calling functionality using WebRTC, with EasyRTC for signaling and OneSignal for offline notifications.

## Features

- Voice and video calling using WebRTC/EasyRTC
- Push notifications for offline users via OneSignal
- Cross-platform support (iOS and Android)
- Screen sharing capabilities
- Call recording
- Call quality monitoring
- Multi-party calls
- Background mode support

## Installation

```bash
npm install capacitor-voice-video-call
npx cap sync
```

## Configuration

### 1. Initialize the Plugin

```typescript
import { VoiceVideoCall } from 'capacitor-voice-video-call';

await VoiceVideoCall.initialize({
  easyrtc: {
    serverUrl: 'https://your-easyrtc-server.com',
    appName: 'your-app',
    enableDebug: false
  },
  onesignal: {
    appId: 'your-onesignal-app-id',
    notificationConfig: {
      sound: 'call_ringtone',
      priority: 'high',
      timeToLive: 30
    }
  }
});
```

### 2. EasyRTC Server Setup

1. Set up an EasyRTC server:
```bash
npm install easyrtc-server
```

2. Basic server configuration:
```javascript
const easyrtc = require('easyrtc-server');
const server = require('http').createServer();
const io = require('socket.io')(server);

easyrtc.listen(server, io);
server.listen(8080);
```

### 3. OneSignal Setup

1. Create a OneSignal account and app
2. Configure your iOS/Android apps with OneSignal
3. Add the required platform configurations

## Usage

### Making a Call

```typescript
// Start a call
await VoiceVideoCall.startCall({
  roomId: 'unique-room-id',
  callType: 'video',
  receiverId: 'recipient-onesignal-id',
  metadata: {
    callerName: 'John Doe',
    callerAvatar: 'https://example.com/avatar.jpg'
  }
});

// Listen for call events
VoiceVideoCall.onCallReceived((callData) => {
  console.log('Incoming call from:', callData.callerId);
});

// Accept a call
await VoiceVideoCall.acceptCall({
  roomId: 'unique-room-id',
  callerId: 'caller-id'
});

// End a call
await VoiceVideoCall.endCall();
```

### Screen Sharing

```typescript
// Start screen sharing
await VoiceVideoCall.startScreenShare({
  audio: true,
  systemAudio: false
});

// Stop screen sharing
await VoiceVideoCall.stopScreenShare();
```

### Recording

```typescript
// Start recording
await VoiceVideoCall.startRecording({
  type: 'both',
  quality: 'high',
  storage: 'local'
});

// Stop recording
const recordingPath = await VoiceVideoCall.stopRecording();
```

### Call Controls

```typescript
// Mute/unmute
await VoiceVideoCall.muteAudio();
await VoiceVideoCall.unmuteAudio();
await VoiceVideoCall.muteVideo();
await VoiceVideoCall.unmuteVideo();

// Switch camera
await VoiceVideoCall.switchCamera();

// Set media controls
await VoiceVideoCall.setMediaControls({
  enableNoiseSupression: true,
  enableEchoCancellation: true,
  enableAutoGainControl: true,
  videoQuality: 'high'
});
```

## How It Works

### Call Flow

1. **Online Users**:
   - Direct connection through EasyRTC
   - WebRTC peer connection established
   - Real-time media streaming

2. **Offline Users**:
   - OneSignal push notification sent
   - User opens app from notification
   - Automatically connects to EasyRTC session
   - WebRTC connection established

### Integration Points

1. **EasyRTC Handles**:
   - WebRTC signaling
   - Peer connections
   - Media streams
   - Room management
   - Call state

2. **OneSignal Handles**:
   - Offline notifications
   - Background state
   - Call notifications
   - Missed calls

### State Management

```typescript
// Call States
enum CallState {
  IDLE,
  RINGING,
  CONNECTING,
  CONNECTED,
  DISCONNECTED
}

// Notification Types
enum NotificationType {
  INCOMING_CALL,
  MISSED_CALL,
  CALL_ENDED
}
```

## Error Handling

The plugin includes comprehensive error handling for various scenarios:

```typescript
try {
  await VoiceVideoCall.startCall({
    roomId: 'room-id',
    callType: 'video',
    receiverId: 'user-id'
  });
} catch (error) {
  if (error.code === 'permission_denied') {
    // Handle permission error
  } else if (error.code === 'network_error') {
    // Handle network error
  }
}
```

## Background Mode

The plugin handles calls in background mode:

1. **Android**:
   - Foreground service with notification
   - Audio-only mode in background
   - Wake lock management

2. **iOS**:
   - VoIP push notifications
   - Background audio session
   - CallKit integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
