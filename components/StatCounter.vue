<script setup lang="ts">
const props = defineProps<{ value: number; suffix?: string; label: string }>()
const shown = ref(props.value)
const el = ref<HTMLElement>()
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  shown.value = 0
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    io.disconnect()
    const t0 = performance.now(), dur = 1400
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1)
      shown.value = Math.round(props.value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, { threshold: .4 })
  if (el.value) io.observe(el.value)
})
</script>
<template>
  <div ref="el" class="stat">
    <div class="num">{{ shown.toLocaleString('en-US') }}{{ suffix }}</div>
    <div class="lbl">{{ label }}</div>
  </div>
</template>
<style scoped>
.num { font-family: var(--serif); font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 600; color: var(--accent); line-height: 1; }
.lbl { margin-top: 8px; font-size: .9rem; color: #c9d6d4; }
</style>
