#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the Capacitor plugin
CAP_PLUGIN(VoiceVideoCallPlugin, "VoiceVideoCall",
    // Original methods
    CAP_PLUGIN_METHOD(startCall, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acceptCall, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(rejectCall, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(endCall, CAPPluginReturnPromise);
    
    // Screen Sharing methods
    CAP_PLUGIN_METHOD(startScreenShare, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(stopScreenShare, CAPPluginReturnPromise);
    
    // Recording methods
    CAP_PLUGIN_METHOD(startRecording, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(stopRecording, CAPPluginReturnPromise);
    
    // Media Control methods
    CAP_PLUGIN_METHOD(muteAudio, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(unmuteAudio, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(muteVideo, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(unmuteVideo, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(switchCamera, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(setMediaControls, CAPPluginReturnPromise);
    
    // Multi-Party Call methods
    CAP_PLUGIN_METHOD(addParticipant, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(removeParticipant, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(getParticipants, CAPPluginReturnPromise);
    
    // Network methods
    CAP_PLUGIN_METHOD(setNetworkConfig, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(getNetworkStatus, CAPPluginReturnPromise);
    
    // Security methods
    CAP_PLUGIN_METHOD(setSecurityOptions, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(generateCallToken, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(validateCallToken, CAPPluginReturnPromise);
    
    // Analytics methods
    CAP_PLUGIN_METHOD(getCallMetrics, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(exportCallLogs, CAPPluginReturnPromise);
    
    // Background Mode methods
    CAP_PLUGIN_METHOD(setBackgroundMode, CAPPluginReturnPromise);
    
    // UI methods
    CAP_PLUGIN_METHOD(showCallUI, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(hideCallUI, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(customizeCallUI, CAPPluginReturnPromise);
)