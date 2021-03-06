const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  publicRuntimeConfig: {
    RETREAT_GURU_API_URL: process.env.RETREAT_GURU_API_URL,
    RETREAT_GURU_API_TOKEN: process.env.RETREAT_GURU_API_TOKEN
  },
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    return config
  },
})
