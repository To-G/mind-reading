<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="page-container">
    <slot />
  </div>
</template>

<style lang="less" scoped>
.page-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
