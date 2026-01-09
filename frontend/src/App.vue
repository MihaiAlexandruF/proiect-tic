<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu mode="horizontal" :router="true" default-active="/">
          <el-menu-item index="/">🏠 Rețete</el-menu-item>
          <el-menu-item index="/add">➕ Adaugă Rețetă</el-menu-item>
          <el-menu-item index="/login">🔑 Login</el-menu-item>
        </el-menu>
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
.el-header {
  padding: 0;
}
</style>