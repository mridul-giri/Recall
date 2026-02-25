/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dltwbd3uvgzug.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/tags",
        permanent: true,
      },
    ];
  },

  transpilePackages: ["@repo/ui"],
  devIndicators: false,
};

export default nextConfig;
