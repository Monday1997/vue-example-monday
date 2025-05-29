<template>
  <a-config-provider
    :theme="{
      components: {
        Menu: Menu,
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>
<script setup lang="ts">
const Menu = {
  colorItemTextHover: '#bfa',
  colorItemTextSelected: '#bfa',
  colorItemBgSelected: '#336699',
}
</script>
