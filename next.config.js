// @ts-check
/**
 * @type {import('next').NextConfig}
 **/
const linguiConfig = require('./lingui.config.js')
// @ts-ignore
const defaultTheme = require('tailwindcss/defaultTheme')

const { ChainId } = require('@sushiswap/core-sdk')

const { locales, sourceLocale } = linguiConfig
const { screens } = defaultTheme

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const path = require('path');

const { withSentryConfig } = require('@sentry/nextjs');
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: false, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// @ts-ignore
const {
  // NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
// SENTRY_ORG,
//  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GIT_COMMIT_SHA,
  VERCEL_BITBUCKET_COMMIT_SHA,
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
} = process.env

const SENTRY_ORG = 'manifoldx'
const SENTRY_PROJECT = 'sushiguard'
// https://b0246ba0aa1a461fabcbff1002377d34@o1029417.ingest.sentry.io/6312310
const SENTRY_DSN = 'https://b0246ba0aa1a461fabcbff1002377d34@o1029417.ingest.sentry.io/6312310'
//process.env.SENTRY_DSN = SENTRY_DSN
const basePath = ''


const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  swcMinify: false,
  reactStrictMode: true,
  env: {
    // Make the COMMIT_SHA available to the client so that Sentry events can be
    // marked for the release they belong to. It may be undefined if running
    // outside of Vercel
    NEXT_PUBLIC_COMMIT_SHA: VERCEL_GIT_COMMIT_SHA,
  },
  webpack:(config, options) => {
    // Ensure Webpack replaces @sentry/node imports with @sentry/browser building the browser's bundle
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    // Define an environment variable so source code can check whether or not
    // it's running on the server so we can correctly initialize Sentry
    config.plugins.push(
      new options.webpack.DefinePlugin({
        'process.env.NEXT_IS_SERVER': JSON.stringify(
          options.isServer.toString()
        ),
      })
    )
    config.module.rules = [
      ...config.module.rules,
      {
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },
    ]

    if (
      SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
 //     SENTRY_AUTH_TOKEN &&
      VERCEL_GIT_COMMIT_SHA &&
      NODE_ENV === 'production'
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules'],
          stripPrefix: ['webpack://_N_E/'],
          urlPrefix: `~${basePath}/_next`,
          release: VERCEL_GIT_COMMIT_SHA,
        })
      )
    }
    return config
  },
  // experimental: {
  //   nextScriptWorkers: true,
  // },
  // pwa: {
  //   dest: 'public',
  //   runtimeCaching,
  //   disable: process.env.NODE_ENV === 'development',
  // },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/analytics/pairs/:path*',
        destination: '/analytics/pools/:path*',
        permanent: true,
      },
      {
        source: '/farms/special',
        destination: '/farm',
        permanent: true,
      },
      {
        source: '/onsen',
        destination: '/farm',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/stake',
        destination: '/bar',
      },
      {
        source: '/add/:token*',
        destination: '/legacy/add/:token*',
      },
      {
        source: '/remove/:token*',
        destination: '/legacy/remove/:token*',
      },
      {
        source: '/create/:token*',
        destination: '/legacy/add/:token*',
      },
      {
        source: '/open-order',
        destination: '/limit-order/open-order',
      },
      {
        source: '/pool',
        destination: '/legacy/pool',
      },
      {
        source: '/find',
        destination: '/legacy/find',
      },
      {
        source: '/migrate',
        destination: '/legacy/migrate',
      },
      // Kashi
      {
        source: '/me',
        destination: '/user',
      },
    ]
  },
  async headeres() {
    return [
      {
        source: '/*',
        headers: [{ key: 'Web-Build', value: process.env.VERCEL_GIT_COMMIT_SHA }]
      }
    ];
  },
  i18n: {
    localeDetection: true,
    locales,
    defaultLocale: sourceLocale,
  },
  // serverRuntimeConfig: {},
  publicRuntimeConfig: {
    breakpoints: screens,

    [ChainId.ETHEREUM]: {
      features: [],
    },
  },
}


// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(withBundleAnalyzer(nextConfig), sentryWebpackPluginOptions);
// Don't delete this console log, useful to see the config in Vercel deployments
console.log('process.env.VERCEL_GIT_COMMIT_SHA: ', process.env.VERCEL_GIT_COMMIT_SHA);
// VERCEL_GIT_REPO_ID
// NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
console.log('process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: ', process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA);
//console.log('process.env.GIT_COMMIT_SHA: ', process.env.GIT_COMMIT_SHA);
console.log('next.config.js', JSON.stringify(module.exports, null, 2));
