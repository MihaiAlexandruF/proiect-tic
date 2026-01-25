<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <TopBar width="100%" />
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue';
export default {
  name: 'App',
  components: {
    TopBar
  },
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
.el-main {
  padding: 0;
}
</style>