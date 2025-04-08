/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME
  }
};

export default nextConfig;
