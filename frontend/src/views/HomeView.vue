<template>
  <SideBar />
</template>

<script>
import SideBar from '@/components/SideBar.vue';
export default {
  name: 'HomeView',
  components: {
    SideBar,
  },
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}
</style>