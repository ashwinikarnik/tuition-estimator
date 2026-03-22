<template>
  <div class="page-shell">
    <SiteHeader />
    <main>
      <HeroSection />
      <LoanEstimator />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue';
import LoanEstimator from './components/LoanEstimator.vue';
import SiteFooter from './components/SiteFooter.vue';
import SiteHeader from './components/SiteHeader.vue';
</script>
