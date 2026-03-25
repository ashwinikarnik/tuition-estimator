<template>
  <section class="demo">
    <FormCheckbox id="checkbox_one" v-model="acceptTerms" label="Accept terms" />

    <FormCheckbox id="checkbox_two" label="Disabled option" :disabled="true" />

    <FormCheckbox
      id="checkbox_three"
      :model-value="parentChecked"
      :indeterminate="indeterminate"
      label="Parent selector"
      @changed="onParentChanged"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { FormCheckbox } from '@rds-vue-ui/form-checkbox';

const acceptTerms = ref(false);
const parentChecked = ref(false);
const indeterminate = ref(true);

const onParentChanged = (_event, checked) => {
  parentChecked.value = checked;
  indeterminate.value = false;
};
</script>

<style scoped>
.demo {
  display: grid;
  gap: 12px;
}
</style>
