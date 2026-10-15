<template>
  <div>
    <a href="#main" class="sr-only">Skip to content</a>
    <AnnouncementBar />
    <SiteHeader />
    <main id="main"><slot /></main>
    <SiteFooter />
    <CookieBanner />
  </div>
</template>
