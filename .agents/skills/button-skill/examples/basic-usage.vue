<template>
  <section class="button-demo">
    <h2>RDS Button Base Theme Demo</h2>

    <button class="btn btn-primary" @click="onPrimaryClick">Save changes</button>

    <button class="btn btn-secondary" disabled>Disabled action</button>

    <form @submit.prevent="onSubmit">
      <button class="btn btn-outline-primary" type="submit">Submit form</button>
    </form>

    <button class="btn btn-block btn-dark-3">Block button</button>
  </section>
</template>

<script setup>
const onPrimaryClick = () => {
  // demo handler
  console.log("Primary button clicked");
};

const onSubmit = () => {
  // demo handler
  console.log("Form submitted");
};
</script>

<style scoped>
.button-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
}
</style>
