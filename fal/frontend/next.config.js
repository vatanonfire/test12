/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel için optimize edilmiş ayarlar
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  },

  // Image optimization - Vercel için
  images: {
    domains: [
      'localhost', 
      '*.vercel.app', 
      '*.vercel.com',
      '*.netlify.app',
      '*.netlify.com'
    ],
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/',
        permanent: true,
      },
    ]
  },

  // Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },

  // Webpack configuration
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        cluster: false,
        dgram: false,
        dns: false,
        domain: false,
        events: false,
        punycode: false,
        querystring: false,
        readline: false,
        repl: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        util: false,
        vm: false,
        worker_threads: false,
      }
    }

    // Ignore node modules that cause issues
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(canvas|jsdom)$/,
      })
    )

    return config
  },

  // Experimental features for Vercel
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    esmExternals: 'loose',
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig