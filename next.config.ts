import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF sai bem mais leve que WebP nas fotos; navegadores sem suporte recebem WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
