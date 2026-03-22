<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="rds-container">
      <p class="hero__eyebrow">{{ APP_COPY.eyebrow }}</p>
      <h1 id="hero-title">{{ APP_COPY.title }}</h1>
      <p class="hero__subtitle">{{ APP_COPY.subtitle }}</p>
      <p class="hero__notice">⚠ {{ APP_COPY.alert }}</p>
    </div>
  </section>
</template>

<script setup>
import { APP_COPY } from '../config/estimatorConfig';
</script>
