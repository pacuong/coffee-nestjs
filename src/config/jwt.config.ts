export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? 'secret',
  expiresIn: '7d' as const,
};
