/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        IMAGE_GENERATOR_URL: process.env.IMAGE_GENERATOR_URL,
    },
};

export default nextConfig;
