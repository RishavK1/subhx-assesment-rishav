export const redisKeys = {
  refreshSession: (sessionId: string) => `auth:session:${sessionId}`,
  accessBlacklist: (tokenId: string) => `auth:blacklist:access:${tokenId}`
};
