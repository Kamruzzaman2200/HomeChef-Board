import { searchSite } from '~/composables/searchIndex'
export default defineEventHandler((event) => {
  const q = String(getQuery(event).q || '').slice(0, 100)
  return { q, results: searchSite(q, 50) }
})
