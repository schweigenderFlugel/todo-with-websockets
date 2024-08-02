import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    nodeEnv: process.env.NODE_ENV,

    mongodbUri: process.env.MONGODB_URI,

    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION,

    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,

    cookieName: process.env.COOKIE_NAME,

    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  };
});
