import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    nodeEnv: process.env.NODE_ENV,

    mongodbUri: process.env.MONGODB_URI,

    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  };
});
