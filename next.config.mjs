/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['staywithlumina.s3.us-east-2.amazonaws.com', 'shinghai.s3.eu-north-1.amazonaws.com'],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
