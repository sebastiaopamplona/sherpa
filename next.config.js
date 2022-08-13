/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    domains: ["tailwindui.com", "images.unsplash.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/signin",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
