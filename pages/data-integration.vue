<script setup lang="ts">
useHead({ title: 'Data Integration' })
const ways = [
  { t: 'Order portal', d: 'Upload orders and artwork through our web portal with live proofs.' },
  { t: 'File exchange', d: 'Drop CSV or XML files on a secure SFTP folder — we pick them up automatically.' },
  { t: 'EDI', d: 'Standard EDI messages for retailers and large suppliers.' },
  { t: 'REST API', d: 'Push product and order data straight from your PLM or ERP.' },
]
</script>
<template>
  <div>
    <PageHero title="Data Integration" lead="Connect your systems once. Artwork, sizes, prices and care data flow to production without retyping." :crumbs="[{ label: 'Data Integration' }]" seed="data-integration" />
    <section class="section"><div class="container"><div class="grid g4"><div v-for="w in ways" :key="w.t" class="card"><h3>{{ w.t }}</h3><p>{{ w.d }}</p></div></div></div></section>
    <CtaBlock title="Plan your integration with us" />
  </div>
</template>
