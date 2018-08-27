if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  publicRuntimeConfig: {
    RETREAT_GURU_API_TOKEN: process.env.RETREAT_GURU_API_TOKEN
  },
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    return config
  },
}