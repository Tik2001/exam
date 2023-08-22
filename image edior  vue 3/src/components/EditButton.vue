<template>
  <a-popover placement="bottom">
    <template #content>
      <p>{{ title }}</p>
    </template>
    <a-button @click="$emit('on-click-customize')" class="radius">
      <v-icon :name="icon"
    /></a-button>
  </a-popover>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.radius {
  border-radius: 50px;
}
</style>
