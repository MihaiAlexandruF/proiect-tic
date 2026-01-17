<template>
  <el-menu
    :default-active="activeIndex"
    class="navbar"
    mode="horizontal"
    :router="true"
    :ellipsis="false"
  >
    <el-menu-item index="/">Pagina Principală</el-menu-item>
    <el-menu-item index="/add-listing">Adaugă Anunț</el-menu-item>
    <div class="flex-grow" />

    <template v-if="!authStore.isLoggedIn">
      <el-menu-item index="/login">Autentifică-te</el-menu-item>
      <el-menu-item index="/register">Înregistrare</el-menu-item>
    </template>

    <template v-else>
      <el-sub-menu index="user">
        <template #title>👤 Contul meu</template>
        <el-menu-item @click="handleLogout">Ieșire</el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
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

</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>