import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    nodeEnv: process.env.NODE_ENV,

    mongodbUri: process.env.MONGODB_URI,

    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    cookieName: process.env.COOKIE_NAME,
  };
});
