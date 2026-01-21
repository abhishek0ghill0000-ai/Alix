import { Request, Response } from 'express';
import env from '../config/envConfig';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

// GET /calls/token?channel=Alix&uid=123
export const getAgoraToken = (req: Request, res: Response) => {
  try {
    const channel = (req.query.channel as string) || 'Alix';
    const uid = parseInt((req.query.uid as string) || '0', 10);
    const role = RtcRole.PUBLISHER;
    const expireSeconds = 3600;

    const token = RtcTokenBuilder.buildTokenWithUid(
      env.AGORA_APP_ID,
      env.AGORA_APP_CERT,
      channel,
      uid,
      role,
      expireSeconds
    );

    res.json({
      success: true,
      data: { token, uid, channel, expire: expireSeconds },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Token generation failed' });
  }
};