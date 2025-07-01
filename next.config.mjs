/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "prod-images.cooingestate.com",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com", // ✅ added vecteezy domain
      },
      {
        protocol: "https",
        hostname:"realestate.learnock.com",
        pathname: '/**',
      }
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;
