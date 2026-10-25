/** @type {import('next').NextConfig} */
const nextConfig = {
  // Whitelist your active Ngrok domain to resolve cross-origin asset/Fast Refresh warnings
  allowedDevOrigins: [
    "manly-duchess-ovary.ngrok-free.dev",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:4006/api/:path*", // Proxies /api calls to your Express backend
      },
    ];
  },
};

export default nextConfig;