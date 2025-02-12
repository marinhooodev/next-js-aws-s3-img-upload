import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "codante-photo-upload.s3.sa-east-1.amazonaws.com"
      }
    ]
  }
};

export default nextConfig;
