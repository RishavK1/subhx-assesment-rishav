import type { Request } from 'express';

export const resolveRequestIp = (req: Request) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    const [firstIp] = forwardedFor.split(',');
    const candidateIp = firstIp?.trim() || req.ip || '';
    return normalizeIp(candidateIp);
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return normalizeIp(forwardedFor[0] ?? req.ip ?? '');
  }

  return normalizeIp(req.ip ?? '');
};

const normalizeIp = (value: string) => {
  if (value.startsWith('::ffff:')) {
    return value.slice(7);
  }

  return value;
};
