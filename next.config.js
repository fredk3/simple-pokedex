/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true
    }
  }
}
