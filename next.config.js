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
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    )

    if (!config.resolve.fallback) {
      config.resolve.fallback = {}
    }

    Object.assign(config.resolve.fallback, {
      buffer: false,
      crypto: false,
      events: false,
      path: false,
      stream: false,
      string_decoder: false,
    })

    return config
  },
}

module.exports = withBundleAnalyzer(
  process.env.BUNDLE_JUNOBLOCKS === 'true'
    ? withBundleJunoblocks(config)
    : config
)
