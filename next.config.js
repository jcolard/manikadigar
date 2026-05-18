/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Dit à Next.js que le site vivra à l'adresse /manikadigar
  basePath: '/manikadigar',
  assetPrefix: '/manikadigar/',
};

module.exports = nextConfig;
