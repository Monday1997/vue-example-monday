<template>
  <a-config-provider
    :theme="{
      components: {
        Menu,
        Table,
        Breadcrumb,
        Layout,
      },
      token: {
        colorPrimary: '#c2c0ff',
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>
<script setup lang="ts">
const gray = '#545454'
const purple = '#c2c0ff'
const Menu = {
  colorItemTextHover: 'white',
  colorItemTextSelected: 'white',
  colorItemBgSelected: 'pink',
  colorItemBg: purple,
}
const Table = {
  colorTextHeading: gray,
  colorFillAlter: 'pink',
  colorBgContainer: purple,
}
const Breadcrumb = {
  colorText: '#6863ff',
  colorTextDescription: purple,
}
const Layout = {
  colorBgHeader: purple,
}
</script>
