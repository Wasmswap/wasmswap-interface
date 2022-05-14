const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withBundleJunoblocks = require('next-bundle-junoblocks')

const config = {
  reactStrictMode: true,
  target: 'serverless',
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dk8s7xjsl/image/upload/',
  },
}

module.exports = withBundleAnalyzer(
  process.env.BUNDLE_JUNOBLOCKS === 'true'
    ? withBundleJunoblocks(config)
    : config
)
