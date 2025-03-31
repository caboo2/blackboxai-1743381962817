import Foundation
import Capacitor
import WebRTC
import OneSignal

@objc(VoiceVideoCallPlugin)
public class VoiceVideoCallPlugin: CAPPlugin {
    private var peerConnectionFactory: RTCPeerConnectionFactory?
    private var peerConnection: RTCPeerConnection?
    private var mediaStream: RTCMediaStream?
    private var localVideoTrack: RTCVideoTrack?
    private var localAudioTrack: RTCAudioTrack?
    
    override public func load() {
        // Initialize WebRTC
        RTCInitializeSSL()
        let videoEncoderFactory = RTCDefaultVideoEncoderFactory()
        let videoDecoderFactory = RTCDefaultVideoDecoderFactory()
        peerConnectionFactory = RTCPeerConnectionFactory(
            encoderFactory: videoEncoderFactory,
            decoderFactory: videoDecoderFactory
        )
        
        // Initialize OneSignal
        OneSignal.setLogLevel(.LL_VERBOSE, visualLevel: .LL_NONE)
    }
    
    @objc func startCall(_ call: CAPPluginCall) {
        guard let roomId = call.getString("roomId"),
              let callType = call.getString("callType") else {
            call.reject("Room ID and call type are required")
            return
        }
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                call.reject("Plugin instance is not available")
                return
            }
            
            do {
                // Configure peer connection
                let config = RTCConfiguration()
                config.iceServers = []
                
                // Media constraints
                let constraints = RTCMediaConstraints(
                    mandatoryConstraints: [
                        "OfferToReceiveAudio": "true",
                        "OfferToReceiveVideo": callType == "video" ? "true" : "false"
                    ],
                    optionalConstraints: nil
                )
                
                // Create peer connection
                self.peerConnection = self.peerConnectionFactory?.peerConnection(
                    with: config,
                    constraints: constraints,
                    delegate: self
                )
                
                // Create media stream
                guard let mediaStream = self.peerConnectionFactory?.mediaStream(withStreamId: "ARDAMS") else {
                    call.reject("Failed to create media stream")
                    return
                }
                self.mediaStream = mediaStream
                
                // Add audio track
                let audioConstraints = RTCMediaConstraints(
                    mandatoryConstraints: nil,
                    optionalConstraints: nil
                )
                guard let audioSource = self.peerConnectionFactory?.audioSource(with: audioConstraints),
                      let audioTrack = self.peerConnectionFactory?.audioTrack(
                        with: audioSource,
                        trackId: "ARDAMSa0"
                      ) else {
                    call.reject("Failed to create audio track")
                    return
                }
                self.localAudioTrack = audioTrack
                mediaStream.addAudioTrack(audioTrack)
                
                // Add video track if video call
                if callType == "video" {
                    guard let videoSource = self.peerConnectionFactory?.videoSource(),
                          let videoTrack = self.peerConnectionFactory?.videoTrack(
                            with: videoSource,
                            trackId: "ARDAMSv0"
                          ) else {
                        call.reject("Failed to create video track")
                        return
                    }
                    self.localVideoTrack = videoTrack
                    mediaStream.addVideoTrack(videoTrack)
                }
                
                // Add stream to peer connection
                self.peerConnection?.add(mediaStream)
                
                // Create offer
                self.peerConnection?.offer(for: constraints) { [weak self] (sessionDescription, error) in
                    guard let self = self else { return }
                    
                    if let error = error {
                        call.reject("Failed to create offer: \(error.localizedDescription)")
                        return
                    }
                    
                    guard let sessionDescription = sessionDescription else {
                        call.reject("Failed to create session description")
                        return
                    }
                    
                    self.peerConnection?.setLocalDescription(sessionDescription) { error in
                        if let error = error {
                            call.reject("Failed to set local description: \(error.localizedDescription)")
                            return
                        }
                        
                        // Send offer through OneSignal
                        let offerData: [String: Any] = [
                            "type": "offer",
                            "sdp": sessionDescription.sdp
                        ]
                        
                        OneSignal.postNotification(
                            ["contents": offerData],
                            toUserId: roomId,
                            onSuccess: { _ in
                                call.resolve()
                            },
                            onFailure: { error in
                                call.reject("Failed to send offer: \(error)")
                            }
                        )
                    }
                }
            } catch {
                call.reject("Failed to start call: \(error.localizedDescription)")
            }
        }
    }
    
    @objc func acceptCall(_ call: CAPPluginCall) {
        guard let roomId = call.getString("roomId") else {
            call.reject("Room ID is required")
            return
        }
        
        // Implementation similar to startCall but handles incoming call
        call.resolve()
    }
    
    @objc func rejectCall(_ call: CAPPluginCall) {
        guard let roomId = call.getString("roomId") else {
            call.reject("Room ID is required")
            return
        }
        
        // Send rejection notification through OneSignal
        let rejectData: [String: Any] = [
            "type": "reject"
        ]
        
        OneSignal.postNotification(
            ["contents": rejectData],
            toUserId: roomId,
            onSuccess: { _ in
                call.resolve()
            },
            onFailure: { error in
                call.reject("Failed to send rejection: \(error)")
            }
        )
    }
    
    @objc func endCall(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                call.reject("Plugin instance is not available")
                return
            }
            
            self.peerConnection?.close()
            self.peerConnection = nil
            
            self.mediaStream = nil
            self.localVideoTrack = nil
            self.localAudioTrack = nil
            
            call.resolve()
        }
    }
}

// MARK: - RTCPeerConnectionDelegate
extension VoiceVideoCallPlugin: RTCPeerConnectionDelegate {
    public func peerConnection(_ peerConnection: RTCPeerConnection, didChange stateChanged: RTCSignalingState) {
        print("Signaling state changed: \(stateChanged)")
    }
    
    public func peerConnection(_ peerConnection: RTCPeerConnection, didAdd stream: RTCMediaStream) {
        print("Stream added")
    }
    
    public func peerConnection(_ peerConnection: RTCPeerConnection, didRemove stream: RTCMediaStream) {
        print("Stream removed")
    }
    
    public func peerConnectionShouldNegotiate(_ peerConnection: RTCPeerConnection) {
        print("Should negotiate")
    }
    
    public func peerConnection(_ peerConnection: RTCPeerConnection, didChange newState: RTCIceConnectionState) {
        print("ICE connection state changed: \(newState)")
    }
    
    public func peerConnection(_ peerConnection: RTCPeerConnection, didChange newState: RTCIceGatheringState) {
        print("ICE gathering state changed: \(newState)")
    }
    
    public func peerConnection(_ peerConnection: RTCPeerConnection, didGenerate candidate: RTCIceCandidate) {
        // Send ice candidate through OneSignal
        let candidateData: [String: Any] = [
            "type": "candidate",
            "candidate": candidate.sdp,
            "sdpMLineIndex": candidate.sdpMLineIndex,
            "sdpMid": candidate.sdpMid ?? ""
        ]
        
        // Note: You'll need to implement the actual sending logic here
        print("Ice candidate generated: \(candidateData)")
    }
    
    public func peerConnection(_ peerConnection: RTCPeerConnection, didRemove candidates: [RTCIceCandidate]) {
        print("Ice candidates removed")
    }
    
    public func peerConnection(_ peerConnection: RTCPeerConnection, didOpen dataChannel: RTCDataChannel) {
        print("Data channel opened")
    }
}