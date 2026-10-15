<script setup lang="ts">
import { nav } from '~/data/site'
const config = useRuntimeConfig()
const openMenu = ref<string | null>(null)
const mobileOpen = ref(false)
const loginOpen = ref(false)
const searchOpen = useState('searchOpen', () => false)
const route = useRoute()
let closeTimer: ReturnType<typeof setTimeout> | undefined

watch(() => route.fullPath, () => { openMenu.value = null; mobileOpen.value = false; loginOpen.value = false })
watch(mobileOpen, v => { if (import.meta.client) document.body.style.overflow = v ? 'hidden' : '' })

function enter(label: string) { clearTimeout(closeTimer); openMenu.value = label }
function leave() { closeTimer = setTimeout(() => (openMenu.value = null), 160) }
function toggle(label: string) { openMenu.value = openMenu.value === label ? null : label }

const portals = computed(() => [
  { label: 'Order Portal', href: config.public.portalUrls.orders },
  { label: 'Packaging Portal', href: config.public.portalUrls.packaging },
  { label: 'Label Portal', href: config.public.portalUrls.labels },
])

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { openMenu.value = null; loginOpen.value = false; mobileOpen.value = false }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchOpen.value = true }
  }
  const onClick = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest('.login')) loginOpen.value = false }
  window.addEventListener('keydown', onKey)
  window.addEventListener('click', onClick)
  onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); window.removeEventListener('click', onClick) })
})
</script>

<template>
  <header class="hdr">
    <div class="container bar">
      <NuxtLink to="/" class="logo" aria-label="Northloom Group home">
        <img src="/favicon.svg" alt="" width="34" height="34"><span>Northloom<small>GROUP</small></span>
      </NuxtLink>

      <nav class="desk" aria-label="Main">
        <div v-for="item in nav" :key="item.label" class="nav-item" @mouseenter="enter(item.label)" @mouseleave="leave">
          <button class="nav-btn" :aria-expanded="openMenu === item.label" @click="toggle(item.label)">
            {{ item.label }} <span class="chev" aria-hidden="true">▾</span>
          </button>
          <Transition name="drop">
            <div v-if="openMenu === item.label" class="mega" :class="{ wide: item.columns.length > 2 }">
              <div class="mega-cols">
                <div v-for="col in item.columns" :key="col.title" class="col">
                  <NuxtLink :to="col.to" class="col-title">{{ col.title }}</NuxtLink>
                  <ul v-if="col.links.length">
                    <li v-for="l in col.links" :key="l.to"><NuxtLink :to="l.to">{{ l.label }}</NuxtLink></li>
                  </ul>
                </div>
              </div>
              <NuxtLink :to="item.to" class="mega-all">View all {{ item.label.toLowerCase() }} →</NuxtLink>
            </div>
          </Transition>
        </div>
      </nav>

      <div class="actions">
        <button class="icon-btn" aria-label="Search (Ctrl+K)" @click="searchOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        </button>
        <div class="login">
          <button class="btn btn-dark sm" :aria-expanded="loginOpen" @click.stop="loginOpen = !loginOpen">B2B Login ▾</button>
          <Transition name="drop">
            <ul v-if="loginOpen" class="login-menu">
              <li v-for="p in portals" :key="p.label"><a :href="p.href" target="_blank" rel="noopener">{{ p.label }} ↗</a></li>
            </ul>
          </Transition>
        </div>
        <button class="icon-btn burger" :aria-expanded="mobileOpen" aria-label="Open menu" @click="mobileOpen = true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
    </div>

    <MobileNav v-model="mobileOpen" :portals="portals" />
    <SearchModal />
  </header>
</template>

<style scoped>
.hdr { position: sticky; top: 0; z-index: 50; background: rgba(251, 250, 247, .94); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.bar { display: flex; align-items: center; gap: 24px; height: 72px; }
.logo { display: flex; align-items: center; gap: 10px; font-family: var(--serif); font-weight: 600; font-size: 1.3rem; color: var(--brand); }
.logo small { display: block; font-family: var(--sans); font-size: .58rem; letter-spacing: .3em; color: var(--ink-2); margin-top: -4px; }
.logo span { line-height: 1.1; }
.desk { display: flex; gap: 2px; margin-left: auto; }
.nav-item { position: static; }
.desk { position: static; }
.hdr .bar { position: relative; }
.nav-btn { background: none; border: 0; font: inherit; font-size: .92rem; font-weight: 500; padding: 10px 12px; cursor: pointer; color: var(--ink); border-radius: 8px; }
.nav-btn:hover, .nav-btn[aria-expanded="true"] { background: var(--bg-2); }
.chev { font-size: .7em; opacity: .6; }
.mega { position: absolute; top: calc(100% - 4px); right: 20px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 24px; min-width: 260px; }
.mega.wide { width: min(920px, 92vw); }
.mega-cols { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px 28px; }
.col-title { font-weight: 700; font-size: .9rem; color: var(--brand); display: block; margin-bottom: 6px; }
.col ul { list-style: none; margin: 0; padding: 0; }
.col li a { display: block; padding: 4px 0; font-size: .87rem; color: var(--ink-2); }
.col li a:hover { color: var(--brand-2); }
.mega-all { display: block; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line); font-weight: 600; font-size: .88rem; color: var(--brand-2); }
.actions { display: flex; align-items: center; gap: 8px; }
.icon-btn { background: none; border: 0; padding: 8px; border-radius: 8px; cursor: pointer; color: var(--ink); }
.icon-btn:hover { background: var(--bg-2); }
.btn.sm { padding: .55em 1em; font-size: .85rem; }
.login { position: relative; }
.login-menu { position: absolute; right: 0; top: calc(100% + 8px); background: #fff; border: 1px solid var(--line); border-radius: 12px; box-shadow: var(--shadow); list-style: none; margin: 0; padding: 8px; min-width: 200px; }
.login-menu a { display: block; padding: 8px 12px; border-radius: 8px; font-size: .9rem; }
.login-menu a:hover { background: var(--bg-2); }
.burger { display: none; }
.drop-enter-active, .drop-leave-active { transition: opacity .15s, transform .15s; }
.drop-enter-from, .drop-leave-to { opacity: 0; }
@media (max-width: 1080px) { .desk { display: none; } .actions { margin-left: auto; } .burger { display: block; } }
@media (max-width: 480px) { .login { display: none; } }
</style>
