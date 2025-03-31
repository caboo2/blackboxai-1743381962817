package com.example.voicevideocall;

import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONObject;
import java.util.List;

@CapacitorPlugin(name = "VoiceVideoCall")
public class VoiceVideoCallPlugin extends Plugin implements CallManager.CallEventListener {
    private static final String TAG = "VoiceVideoCallPlugin";
    private CallManager callManager;

    @Override
    public void load() {
        callManager = new CallManager(getContext(), this);
    }

    // Original Methods
    @PluginMethod
    public void startCall(PluginCall call) {
        String roomId = call.getString("roomId");
        String callType = call.getString("callType");

        if (roomId == null || callType == null) {
            call.reject("Room ID and call type are required");
            return;
        }

        try {
            callManager.startCall(roomId, callType);
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
            callManager.acceptCall(roomId);
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
            callManager.rejectCall(roomId);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to reject call: " + e.getMessage());
        }
    }

    @PluginMethod
    public void endCall(PluginCall call) {
        try {
            callManager.endCall();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to end call: " + e.getMessage());
        }
    }

    // Screen Sharing Methods
    @PluginMethod
    public void startScreenShare(PluginCall call) {
        boolean withAudio = call.getBoolean("audio", false);
        try {
            callManager.startScreenShare(withAudio);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to start screen sharing: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stopScreenShare(PluginCall call) {
        try {
            callManager.stopScreenShare();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to stop screen sharing: " + e.getMessage());
        }
    }

    // Recording Methods
    @PluginMethod
    public void startRecording(PluginCall call) {
        String type = call.getString("type", "both");
        String quality = call.getString("quality", "medium");
        String storage = call.getString("storage", "local");

        try {
            callManager.startRecording(type, quality, storage);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to start recording: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stopRecording(PluginCall call) {
        try {
            String recordingPath = callManager.stopRecording();
            JSObject result = new JSObject();
            result.put("path", recordingPath);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to stop recording: " + e.getMessage());
        }
    }

    // Media Control Methods
    @PluginMethod
    public void muteAudio(PluginCall call) {
        try {
            callManager.muteAudio();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to mute audio: " + e.getMessage());
        }
    }

    @PluginMethod
    public void unmuteAudio(PluginCall call) {
        try {
            callManager.unmuteAudio();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to unmute audio: " + e.getMessage());
        }
    }

    @PluginMethod
    public void muteVideo(PluginCall call) {
        try {
            callManager.muteVideo();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to mute video: " + e.getMessage());
        }
    }

    @PluginMethod
    public void unmuteVideo(PluginCall call) {
        try {
            callManager.unmuteVideo();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to unmute video: " + e.getMessage());
        }
    }

    @PluginMethod
    public void switchCamera(PluginCall call) {
        try {
            callManager.switchCamera();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to switch camera: " + e.getMessage());
        }
    }

    // Multi-Party Call Methods
    @PluginMethod
    public void addParticipant(PluginCall call) {
        String participantId = call.getString("participantId");
        if (participantId == null) {
            call.reject("Participant ID is required");
            return;
        }

        try {
            callManager.addParticipant(participantId);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to add participant: " + e.getMessage());
        }
    }

    @PluginMethod
    public void removeParticipant(PluginCall call) {
        String participantId = call.getString("participantId");
        if (participantId == null) {
            call.reject("Participant ID is required");
            return;
        }

        try {
            callManager.removeParticipant(participantId);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to remove participant: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getParticipants(PluginCall call) {
        try {
            List<CallManager.Participant> participants = callManager.getParticipants();
            JSObject result = new JSObject();
            // Convert participants to JSON array
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to get participants: " + e.getMessage());
        }
    }

    // Network Methods
    @PluginMethod
    public void setNetworkConfig(PluginCall call) {
        try {
            JSObject config = call.getData();
            callManager.setNetworkConfig(config);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to set network config: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getNetworkStatus(PluginCall call) {
        try {
            JSONObject status = callManager.getNetworkStatus();
            call.resolve(JSObject.fromJSONObject(status));
        } catch (Exception e) {
            call.reject("Failed to get network status: " + e.getMessage());
        }
    }

    // Security Methods
    @PluginMethod
    public void setSecurityOptions(PluginCall call) {
        try {
            JSObject options = call.getData();
            callManager.setSecurityOptions(options);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to set security options: " + e.getMessage());
        }
    }

    @PluginMethod
    public void generateCallToken(PluginCall call) {
        try {
            String token = callManager.generateCallToken();
            JSObject result = new JSObject();
            result.put("token", token);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to generate call token: " + e.getMessage());
        }
    }

    @PluginMethod
    public void validateCallToken(PluginCall call) {
        String token = call.getString("token");
        if (token == null) {
            call.reject("Token is required");
            return;
        }

        try {
            boolean isValid = callManager.validateCallToken(token);
            JSObject result = new JSObject();
            result.put("valid", isValid);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to validate call token: " + e.getMessage());
        }
    }

    // Analytics Methods
    @PluginMethod
    public void getCallMetrics(PluginCall call) {
        try {
            JSONObject metrics = callManager.getCallMetrics();
            call.resolve(JSObject.fromJSONObject(metrics));
        } catch (Exception e) {
            call.reject("Failed to get call metrics: " + e.getMessage());
        }
    }

    @PluginMethod
    public void exportCallLogs(PluginCall call) {
        try {
            String logs = callManager.exportCallLogs();
            JSObject result = new JSObject();
            result.put("logs", logs);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to export call logs: " + e.getMessage());
        }
    }

    // Background Mode Methods
    @PluginMethod
    public void setBackgroundMode(PluginCall call) {
        try {
            JSObject options = call.getData();
            callManager.setBackgroundMode(options);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to set background mode: " + e.getMessage());
        }
    }

    // CallManager.CallEventListener Implementation
    @Override
    public void onCallQualityChanged(JSONObject stats) {
        notifyListeners("callQualityChanged", JSObject.fromJSONObject(stats));
    }

    @Override
    public void onScreenShareStateChanged(boolean isSharing) {
        JSObject data = new JSObject();
        data.put("isSharing", isSharing);
        notifyListeners(isSharing ? "screenShareStarted" : "screenShareStopped", data);
    }

    @Override
    public void onRecordingStateChanged(String state) {
        JSObject data = new JSObject();
        data.put("state", state);
        notifyListeners("recordingStateChanged", data);
    }

    @Override
    public void onParticipantStateChanged(JSONObject participant, boolean joined) {
        notifyListeners(joined ? "participantJoined" : "participantLeft", 
                       JSObject.fromJSONObject(participant));
    }

    @Override
    public void onNetworkStatusChanged(JSONObject status) {
        notifyListeners("networkStatusChanged", JSObject.fromJSONObject(status));
    }

    @Override
    public void onMetricsUpdated(JSONObject metrics) {
        notifyListeners("metricsUpdated", JSObject.fromJSONObject(metrics));
    }
}