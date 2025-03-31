# Capacitor Voice Video Call Plugin

A Capacitor plugin that enables voice and video calling functionality using WebRTC and OneSignal for signaling.

## Features

- Voice and video calling using WebRTC
- Call signaling using OneSignal
- Cross-platform support (iOS and Android)
- Easy-to-use API
- Comprehensive error handling

## Installation

```bash
npm install capacitor-voice-video-call
npx cap sync
```

## iOS Setup

1. Add the following to your Podfile:

```ruby
pod 'GoogleWebRTC'
pod 'OneSignal'
```

2. Run pod install:

```bash
cd ios && pod install
```

3. Configure OneSignal in your AppDelegate.swift:

```swift
import OneSignal

// In didFinishLaunchingWithOptions:
OneSignal.initWithLaunchOptions(launchOptions)
OneSignal.setAppId("YOUR-ONESIGNAL-APP-ID")
```

## Android Setup

1. Add the following to your app's build.gradle:

```gradle
dependencies {
    implementation 'org.webrtc:google-webrtc:1.0.32006'
    implementation 'com.onesignal:OneSignal:[4.0.0, 4.99.99]'
}
```

2. Configure OneSignal in your Application class:

```java
import com.onesignal.OneSignal;

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        
        OneSignal.initWithContext(this);
        OneSignal.setAppId("YOUR-ONESIGNAL-APP-ID");
    }
}
```

## Usage

```typescript
import { VoiceVideoCall } from 'capacitor-voice-video-call';

// Start a call
await VoiceVideoCall.startCall({
    roomId: 'unique-room-id',
    callType: 'video' // or 'audio'
});

// Accept an incoming call
await VoiceVideoCall.acceptCall({
    roomId: 'unique-room-id'
});

// Reject an incoming call
await VoiceVideoCall.rejectCall({
    roomId: 'unique-room-id'
});

// End an ongoing call
await VoiceVideoCall.endCall();

// Listen for incoming calls
VoiceVideoCall.onCallReceived((data) => {
    console.log('Incoming call from:', data.callerId);
    console.log('Room ID:', data.roomId);
    console.log('Call type:', data.callType);
});

// Listen for call end events
VoiceVideoCall.onCallEnded(() => {
    console.log('Call ended');
});
```

## API Documentation

### startCall(options: CallOptions): Promise<void>
Initiates a call by sending a call invitation via OneSignal and sets up the WebRTC connection.

Parameters:
- options.roomId: string - Unique identifier for the call room
- options.callType: 'audio' | 'video' - Type of call to initiate

### acceptCall(options: { roomId: string }): Promise<void>
Accepts an incoming call and establishes the WebRTC connection.

Parameters:
- options.roomId: string - Room ID of the call to accept

### rejectCall(options: { roomId: string }): Promise<void>
Rejects an incoming call.

Parameters:
- options.roomId: string - Room ID of the call to reject

### endCall(): Promise<void>
Terminates the ongoing call and sends a call termination message via OneSignal.

### onCallReceived(callback: (data: CallData) => void): void
Listens for incoming call invitations.

Callback parameters:
- data.callerId: string - ID of the caller
- data.roomId: string - Room ID for the call
- data.callType: 'audio' | 'video' - Type of incoming call

### onCallEnded(callback: () => void): void
Listens for call termination events.

## Error Handling

The plugin includes comprehensive error handling. All methods return promises that may reject with detailed error messages. Common error scenarios include:

- Invalid or missing parameters
- Network connectivity issues
- WebRTC initialization failures
- OneSignal communication errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
