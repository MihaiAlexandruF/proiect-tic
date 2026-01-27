<template>
  <el-menu
    :default-active="activeIndex"
    class="navbar"
    mode="horizontal"
    :router="true"
    :ellipsis="false"
  >
    <el-menu-item index="/">Pagina Principală</el-menu-item>
    <el-menu-item  v-if="authStore.isLoggedIn" index="/add-listing">Adaugă Anunț</el-menu-item>
    <div class="flex-grow" />

    <template v-if="!authStore.isLoggedIn">
      <el-menu-item index="/login">Autentifică-te</el-menu-item>
      <el-menu-item index="/register">Înregistrare</el-menu-item>
    </template>

    <template v-else>
      <el-sub-menu index="user">
        <template #title>👤 Contul meu</template>
        <el-menu-item @click="handleLogout">Ieșire</el-menu-item>
        <el-menu-item @click="myListings">Anunturile mele</el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { el } from 'element-plus/es/locales.mjs'

const authStore = useAuthStore()
const activeIndex = ref('/')
const handleSelect = (key, keyPath) => { console.log(key, keyPath) }

const handleLogout = async () => {
  try {
    await authStore.logout()
    console.log('User logged out successfully')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

const myListings = () =>{
  router.push('/listings/my-listings');
}

</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}
.common-layout {
  width: 100% !important;
  margin: 0;
  padding: 0;
}
.el-header {
  padding: 0;
  margin: 0;
}
</style>