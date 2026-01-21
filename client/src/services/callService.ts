import RtcEngine from 'react-native-agora';

export const callService = {
  init: async (appId: string) => {
    const engine = await RtcEngine.create(appId);
    await engine.enableVideo();
    return engine;
  },
  joinRandom: async (tokenServer: string, channel: string) => {
    // Fetch token, join
  },
};