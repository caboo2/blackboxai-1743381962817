#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(VoiceVideoCallPlugin, "VoiceVideoCall",
    CAP_PLUGIN_METHOD(startCall, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acceptCall, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(rejectCall, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(endCall, CAPPluginReturnPromise);
)