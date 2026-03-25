<template>
  <section class="demo">
    <ButtonPlayApollo
      button-text="Watch Video"
      button-text-size="medium"
      button-text-variant="dark-3"
      background-variant="dark-1"
      @ctaClick="onCtaClick"
    />

    <ButtonPlayApollo
      button-text="Unavailable"
      :disabled="true"
      @ctaClick="onDisabledClick"
    />
  </section>
</template>

<script setup>
import { ButtonPlayApollo } from "@rds-vue-ui/button-play-apollo";

const onCtaClick = () => {
  console.log("ButtonPlayApollo ctaClick fired");
};

const onDisabledClick = () => {
  console.log("This should not fire when disabled");
};
</script>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
}
</style>
