package com.example.voicevideocall;

import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.webrtc.*;
import com.onesignal.OneSignal;

@CapacitorPlugin(name = "VoiceVideoCall")
public class VoiceVideoCallPlugin extends Plugin {
    private static final String TAG = "VoiceVideoCallPlugin";
    private PeerConnectionFactory peerConnectionFactory;
    private PeerConnection peerConnection;
    private MediaStream mediaStream;
    private VideoTrack localVideoTrack;
    private AudioTrack localAudioTrack;

    @Override
    public void load() {
        // Initialize WebRTC
        PeerConnectionFactory.InitializationOptions initializationOptions =
                PeerConnectionFactory.InitializationOptions.builder(getContext())
                        .setEnableInternalTracer(true)
                        .createInitializationOptions();
        PeerConnectionFactory.initialize(initializationOptions);

        // Create PeerConnectionFactory
        PeerConnectionFactory.Options options = new PeerConnectionFactory.Options();
        peerConnectionFactory = PeerConnectionFactory.builder()
                .setOptions(options)
                .createPeerConnectionFactory();

        // Initialize OneSignal
        OneSignal.setLogLevel(OneSignal.LOG_LEVEL.VERBOSE, OneSignal.LOG_LEVEL.NONE);
        OneSignal.initWithContext(getContext());
    }

    @PluginMethod
    public void startCall(PluginCall call) {
        String roomId = call.getString("roomId");
        String callType = call.getString("callType");

        if (roomId == null || callType == null) {
            call.reject("Room ID and call type are required");
            return;
        }

        try {
            // Create media constraints
            MediaConstraints mediaConstraints = new MediaConstraints();
            mediaConstraints.mandatory.add(
                    new MediaConstraints.KeyValuePair("OfferToReceiveAudio", "true"));
            mediaConstraints.mandatory.add(
                    new MediaConstraints.KeyValuePair("OfferToReceiveVideo", 
                            callType.equals("video") ? "true" : "false"));

            // Create peer connection
            PeerConnection.RTCConfiguration rtcConfig = 
                    new PeerConnection.RTCConfiguration(new ArrayList<>());
            peerConnection = peerConnectionFactory.createPeerConnection(
                    rtcConfig, new PeerConnection.Observer() {
                @Override
                public void onSignalingChange(PeerConnection.SignalingState signalingState) {
                    Log.d(TAG, "onSignalingChange: " + signalingState);
                }

                @Override
                public void onIceConnectionChange(PeerConnection.IceConnectionState iceConnectionState) {
                    Log.d(TAG, "onIceConnectionChange: " + iceConnectionState);
                }

                @Override
                public void onIceConnectionReceivingChange(boolean b) {
                    Log.d(TAG, "onIceConnectionReceivingChange: " + b);
                }

                @Override
                public void onIceGatheringChange(PeerConnection.IceGatheringState iceGatheringState) {
                    Log.d(TAG, "onIceGatheringChange: " + iceGatheringState);
                }

                @Override
                public void onIceCandidate(IceCandidate iceCandidate) {
                    // Send ice candidate through OneSignal
                    JSObject candidateData = new JSObject();
                    candidateData.put("type", "candidate");
                    candidateData.put("candidate", iceCandidate.sdp);
                    candidateData.put("sdpMLineIndex", iceCandidate.sdpMLineIndex);
                    candidateData.put("sdpMid", iceCandidate.sdpMid);
                    
                    OneSignal.postNotification(candidateData.toString(),
                            null,
                            roomId);
                }

                @Override
                public void onIceCandidatesRemoved(IceCandidate[] iceCandidates) {
                    Log.d(TAG, "onIceCandidatesRemoved");
                }

                @Override
                public void onAddStream(MediaStream mediaStream) {
                    Log.d(TAG, "onAddStream");
                }

                @Override
                public void onRemoveStream(MediaStream mediaStream) {
                    Log.d(TAG, "onRemoveStream");
                }

                @Override
                public void onDataChannel(DataChannel dataChannel) {
                    Log.d(TAG, "onDataChannel");
                }

                @Override
                public void onRenegotiationNeeded() {
                    Log.d(TAG, "onRenegotiationNeeded");
                }
            });

            // Create local media stream
            mediaStream = peerConnectionFactory.createLocalMediaStream("ARDAMS");
            
            // Add audio track
            AudioSource audioSource = peerConnectionFactory.createAudioSource(new MediaConstraints());
            localAudioTrack = peerConnectionFactory.createAudioTrack("ARDAMSa0", audioSource);
            mediaStream.addTrack(localAudioTrack);

            // Add video track if video call
            if (callType.equals("video")) {
                VideoSource videoSource = peerConnectionFactory.createVideoSource(false);
                localVideoTrack = peerConnectionFactory.createVideoTrack("ARDAMSv0", videoSource);
                mediaStream.addTrack(localVideoTrack);
            }

            // Add stream to peer connection
            peerConnection.addStream(mediaStream);

            // Create offer
            peerConnection.createOffer(new SdpObserver() {
                @Override
                public void onCreateSuccess(SessionDescription sessionDescription) {
                    peerConnection.setLocalDescription(new SdpObserver() {
                        @Override
                        public void onCreateSuccess(SessionDescription sessionDescription) {}

                        @Override
                        public void onSetSuccess() {
                            // Send offer through OneSignal
                            JSObject offerData = new JSObject();
                            offerData.put("type", "offer");
                            offerData.put("sdp", sessionDescription.description);
                            
                            OneSignal.postNotification(offerData.toString(),
                                    null,
                                    roomId);
                        }

                        @Override
                        public void onCreateFailure(String s) {
                            call.reject("Failed to create local description: " + s);
                        }

                        @Override
                        public void onSetFailure(String s) {
                            call.reject("Failed to set local description: " + s);
                        }
                    }, sessionDescription);
                }

                @Override
                public void onSetSuccess() {}

                @Override
                public void onCreateFailure(String s) {
                    call.reject("Failed to create offer: " + s);
                }

                @Override
                public void onSetFailure(String s) {}
            }, mediaConstraints);

            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to start call: " + e.getMessage());
        }
    }

    @PluginMethod
    public void acceptCall(PluginCall call) {
        String roomId = call.getString("roomId");
        if (roomId == null) {
            call.reject("Room ID is required");
            return;
        }

        try {
            // Implementation similar to startCall but handles incoming call
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to accept call: " + e.getMessage());
        }
    }

    @PluginMethod
    public void rejectCall(PluginCall call) {
        String roomId = call.getString("roomId");
        if (roomId == null) {
            call.reject("Room ID is required");
            return;
        }

        try {
            // Send rejection notification through OneSignal
            JSObject rejectData = new JSObject();
            rejectData.put("type", "reject");
            
            OneSignal.postNotification(rejectData.toString(),
                    null,
                    roomId);
            
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to reject call: " + e.getMessage());
        }
    }

    @PluginMethod
    public void endCall(PluginCall call) {
        try {
            if (peerConnection != null) {
                peerConnection.close();
                peerConnection = null;
            }
            
            if (mediaStream != null) {
                mediaStream.dispose();
                mediaStream = null;
            }
            
            if (localVideoTrack != null) {
                localVideoTrack.dispose();
                localVideoTrack = null;
            }
            
            if (localAudioTrack != null) {
                localAudioTrack.dispose();
                localAudioTrack = null;
            }
            
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to end call: " + e.getMessage());
        }
    }
}