import { registerPlugin } from '@capacitor/core';

import type { VoiceVideoCallPlugin } from './definitions';

const VoiceVideoCall = registerPlugin<VoiceVideoCallPlugin>('VoiceVideoCall', {
  web: () => import('./web').then(m => new m.VoiceVideoCallWeb()),
});

export * from './definitions';
export { VoiceVideoCall };