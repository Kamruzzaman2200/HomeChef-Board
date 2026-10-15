<script setup lang="ts">
import { brand, categories } from '~/data/site'
const config = useRuntimeConfig()
const cookie = useState<string | null>('cookieChoice', () => null)
const year = new Date().getFullYear()
const company = [
  { label: 'About us', to: '/about/about-us' }, { label: 'Contact', to: '/contact' }, { label: 'Careers', to: '/careers' },
  { label: 'Pressroom', to: '/resources/pressroom' }, { label: 'News & Insights', to: '/resources/news' },
  { label: 'Privacy Policy', to: '/legal/privacy-policy' }, { label: 'Cookies', to: '/legal/cookies' },
  { label: 'Ethics Hotline', to: '/legal/ethics-hotline' }, { label: 'Legal Imprint', to: '/legal/legal-imprint' },
  { label: 'Responsibility & Compliance', to: '/legal/compliance' },
]
const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', d: 'M4 4h4v16H4zM6 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm4 6h4v2c.6-1 2-2.2 4-2.2 4 0 4.5 2.6 4.5 6V20h-4v-7c0-1.6-.3-3-2-3s-2.5 1.3-2.5 3v7h-4z' },
  { label: 'Instagram', href: 'https://www.instagram.com/', d: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' },
  { label: 'Facebook', href: 'https://www.facebook.com/', d: 'M14 8V6c0-1 .5-1.5 1.5-1.5H17V1h-3c-3 0-4 2-4 4.5V8H7v3.5h3V23h4V11.5h3l.5-3.5z' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/', d: 'M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.6-1.8-4.4-4.5-4.4-3 0-4.8 2.3-4.8 4.6 0 .9.3 1.9.8 2.4l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.4-.7-2.2-2.7-2.2-4.3 0-3.5 2.5-6.7 7.3-6.7 3.8 0 6.8 2.7 6.8 6.4 0 3.8-2.4 6.9-5.8 6.9-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.3 1-1 2.2-1.4 2.9A10 10 0 1 0 12 2z' },
]
</script>
<template>
  <footer class="ftr">
    <div class="container">
      <div class="cta-row">
        <h2>Let’s make something together.</h2>
        <NuxtLink to="/contact" class="btn btn-primary">Contact our team</NuxtLink>
      </div>
      <div class="cols">
        <div>
          <h4>Company</h4>
          <NuxtLink v-for="l in company" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
        </div>
        <div>
          <h4>Solutions</h4>
          <NuxtLink v-for="c in categories" :key="c.slug" :to="`/solutions/${c.slug}`">{{ c.title }}</NuxtLink>
        </div>
        <div>
          <h4>B2B Login</h4>
          <a :href="config.public.portalUrls.orders" target="_blank" rel="noopener">Order Portal ↗</a>
          <a :href="config.public.portalUrls.packaging" target="_blank" rel="noopener">Packaging Portal ↗</a>
          <a :href="config.public.portalUrls.labels" target="_blank" rel="noopener">Label Portal ↗</a>
          <h4 style="margin-top:24px">Get in touch</h4>
          <a :href="`mailto:${brand.email}`">{{ brand.email }}</a>
          <a :href="`tel:${brand.phone.replace(/\s/g, '')}`">{{ brand.phone }}</a>
          <span class="addr">{{ brand.address }}</span>
        </div>
        <div>
          <h4>Newsletter</h4>
          <p class="small">Monthly ideas on materials, regulation and retail.</p>
          <NewsletterForm compact />
        </div>
      </div>
      <div class="bottom">
        <span>© {{ year }} {{ brand.full }}. All rights reserved.</span>
        <button class="linkish" @click="cookie = null">Cookie settings</button>
        <div class="soc">
          <a v-for="s in socials" :key="s.label" :href="s.href" target="_blank" rel="noopener" :aria-label="s.label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path :d="s.d" /></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped>
.ftr { background: var(--brand); color: #c9d6d4; padding: 64px 0 28px; font-size: .92rem; }
.cta-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,.12); margin-bottom: 40px; }
.cta-row h2 { color: #fff; margin: 0; }
.cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
@media (max-width: 900px) { .cols { grid-template-columns: 1fr 1fr; } }
@media (max-width: 520px) { .cols { grid-template-columns: 1fr; } }
h4 { color: #fff; font-size: .82rem; letter-spacing: .12em; text-transform: uppercase; margin: 0 0 12px; }
.cols a, .addr { display: block; padding: 3px 0; }
.cols a:hover { color: var(--accent); }
.small { font-size: .85rem; }
.bottom { margin-top: 48px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.12); display: flex; gap: 20px; align-items: center; flex-wrap: wrap; font-size: .82rem; }
.linkish { background: none; border: 0; color: inherit; font: inherit; text-decoration: underline; cursor: pointer; }
.soc { margin-left: auto; display: flex; gap: 14px; }
.soc a:hover { color: var(--accent); }
</style>
