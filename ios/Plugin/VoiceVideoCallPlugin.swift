import Foundation
import Capacitor
import WebRTC
import OneSignal
import ReplayKit

@objc(VoiceVideoCallPlugin)
public class VoiceVideoCallPlugin: CAPPlugin {
    private var callManager: CallManager?
    
    override public func load() {
        callManager = CallManager(plugin: self)
    }
    
    // MARK: - Original Methods
    @objc func startCall(_ call: CAPPluginCall) {
        guard let roomId = call.getString("roomId"),
              let callType = call.getString("callType") else {
            call.reject("Room ID and call type are required")
            return
        }
        
        callManager?.startCall(roomId: roomId, callType: callType) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func acceptCall(_ call: CAPPluginCall) {
        guard let roomId = call.getString("roomId") else {
            call.reject("Room ID is required")
            return
        }
        
        callManager?.acceptCall(roomId: roomId) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func rejectCall(_ call: CAPPluginCall) {
        guard let roomId = call.getString("roomId") else {
            call.reject("Room ID is required")
            return
        }
        
        callManager?.rejectCall(roomId: roomId) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func endCall(_ call: CAPPluginCall) {
        callManager?.endCall { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    // MARK: - Screen Sharing Methods
    @objc func startScreenShare(_ call: CAPPluginCall) {
        let withAudio = call.getBool("audio") ?? false
        
        callManager?.startScreenShare(withAudio: withAudio) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func stopScreenShare(_ call: CAPPluginCall) {
        callManager?.stopScreenShare { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    // MARK: - Recording Methods
    @objc func startRecording(_ call: CAPPluginCall) {
        guard let type = call.getString("type") else {
            call.reject("Recording type is required")
            return
        }
        
        let quality = call.getString("quality") ?? "medium"
        let storage = call.getString("storage") ?? "local"
        
        callManager?.startRecording(type: type, quality: quality, storage: storage) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func stopRecording(_ call: CAPPluginCall) {
        callManager?.stopRecording { result in
            switch result {
            case .success(let path):
                call.resolve(["path": path])
            case .failure(let error):
                call.reject(error.localizedDescription)
            }
        }
    }
    
    // MARK: - Media Control Methods
    @objc func muteAudio(_ call: CAPPluginCall) {
        callManager?.muteAudio { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func unmuteAudio(_ call: CAPPluginCall) {
        callManager?.unmuteAudio { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func muteVideo(_ call: CAPPluginCall) {
        callManager?.muteVideo { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func unmuteVideo(_ call: CAPPluginCall) {
        callManager?.unmuteVideo { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func switchCamera(_ call: CAPPluginCall) {
        callManager?.switchCamera { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    // MARK: - Multi-Party Call Methods
    @objc func addParticipant(_ call: CAPPluginCall) {
        guard let participantId = call.getString("participantId") else {
            call.reject("Participant ID is required")
            return
        }
        
        callManager?.addParticipant(participantId: participantId) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func removeParticipant(_ call: CAPPluginCall) {
        guard let participantId = call.getString("participantId") else {
            call.reject("Participant ID is required")
            return
        }
        
        callManager?.removeParticipant(participantId: participantId) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func getParticipants(_ call: CAPPluginCall) {
        callManager?.getParticipants { result in
            switch result {
            case .success(let participants):
                call.resolve(["participants": participants])
            case .failure(let error):
                call.reject(error.localizedDescription)
            }
        }
    }
    
    // MARK: - Network Methods
    @objc func setNetworkConfig(_ call: CAPPluginCall) {
        guard let config = call.getObject("config") else {
            call.reject("Network configuration is required")
            return
        }
        
        callManager?.setNetworkConfig(config: config) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func getNetworkStatus(_ call: CAPPluginCall) {
        callManager?.getNetworkStatus { result in
            switch result {
            case .success(let status):
                call.resolve(status)
            case .failure(let error):
                call.reject(error.localizedDescription)
            }
        }
    }
    
    // MARK: - Security Methods
    @objc func setSecurityOptions(_ call: CAPPluginCall) {
        guard let options = call.getObject("options") else {
            call.reject("Security options are required")
            return
        }
        
        callManager?.setSecurityOptions(options: options) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func generateCallToken(_ call: CAPPluginCall) {
        callManager?.generateCallToken { result in
            switch result {
            case .success(let token):
                call.resolve(["token": token])
            case .failure(let error):
                call.reject(error.localizedDescription)
            }
        }
    }
    
    @objc func validateCallToken(_ call: CAPPluginCall) {
        guard let token = call.getString("token") else {
            call.reject("Token is required")
            return
        }
        
        callManager?.validateCallToken(token: token) { result in
            switch result {
            case .success(let isValid):
                call.resolve(["valid": isValid])
            case .failure(let error):
                call.reject(error.localizedDescription)
            }
        }
    }
    
    // MARK: - Analytics Methods
    @objc func getCallMetrics(_ call: CAPPluginCall) {
        callManager?.getCallMetrics { result in
            switch result {
            case .success(let metrics):
                call.resolve(metrics)
            case .failure(let error):
                call.reject(error.localizedDescription)
            }
        }
    }
    
    @objc func exportCallLogs(_ call: CAPPluginCall) {
        callManager?.exportCallLogs { result in
            switch result {
            case .success(let logs):
                call.resolve(["logs": logs])
            case .failure(let error):
                call.reject(error.localizedDescription)
            }
        }
    }
    
    // MARK: - Background Mode Methods
    @objc func setBackgroundMode(_ call: CAPPluginCall) {
        guard let options = call.getObject("options") else {
            call.reject("Background options are required")
            return
        }
        
        callManager?.setBackgroundMode(options: options) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
    
    // MARK: - Event Notifications
    private func notifyCallQualityChanged(_ stats: [String: Any]) {
        notifyListeners("callQualityChanged", data: stats)
    }
    
    private func notifyScreenShareStateChanged(isSharing: Bool) {
        notifyListeners(isSharing ? "screenShareStarted" : "screenShareStopped", data: [:])
    }
    
    private func notifyRecordingStateChanged(_ state: String) {
        notifyListeners("recordingStateChanged", data: ["state": state])
    }
    
    private func notifyParticipantStateChanged(_ participant: [String: Any], joined: Bool) {
        notifyListeners(joined ? "participantJoined" : "participantLeft", data: participant)
    }
    
    private func notifyNetworkStatusChanged(_ status: [String: Any]) {
        notifyListeners("networkStatusChanged", data: status)
    }
    
    private func notifyMetricsUpdated(_ metrics: [String: Any]) {
        notifyListeners("metricsUpdated", data: metrics)
    }
}