/** @type {import('next').NextConfig} */
const nextConfig = {
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
    const backendUrl = process.env.BACKEND_SERVER_URL || "http://127.0.0.1:4006";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;