<template>
  <button
    :type="type"
    :class="['btn', variantClass, sizeClass, { 'btn-block': block }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);

const variantClass = computed(() => `btn-${props.variant}`);
const sizeClass = computed(() => {
  if (props.size === 'sm') return 'btn-sm';
  if (props.size === 'lg') return 'btn-lg';
  return '';
});
</script>
