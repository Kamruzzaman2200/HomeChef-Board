// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Northloom Group',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Northloom Group — branded trims, packaging and connected product identity for fashion and lifestyle brands.' },
        { name: 'theme-color', content: '#0f2a2e' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap' },
      ],
    },
  },
  runtimeConfig: {
    // Set these in .env (see .env.example). Empty = emails are logged + stored only.
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    mailFrom: 'Northloom Website <no-reply@example.com>',
    mailTo: 'hello@example.com',
    public: {
      siteName: 'Northloom Group',
      portalUrls: {
        orders: 'https://portal.example.com',
        packaging: 'https://packaging.example.com',
        labels: 'https://labels.example.com',
      },
    },
  },
  nitro: {
    storage: { submissions: { driver: 'fs', base: './.data/submissions' } },
  },
})
