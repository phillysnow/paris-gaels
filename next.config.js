/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  return {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.prismic.io",
          pathname: "/**",
        },
      ],
    },
  };
};

module.exports = nextConfig;