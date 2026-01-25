<template>
  <SearchBar width="100%" ></SearchBar>
  <Filters width="100%" />
  <div class="home">
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6" v-for="listing in listings" :key="listing.id">
        <ListingsCard :listing="listing"  />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import Filters from '@/components/Filters.vue';
import SearchBar from '@/components/SearchBar.vue';
import ListingsCard from '@/components/ListingsCard.vue';
import axios from 'axios';
import apiClient from '@/api';
export default {
  name: 'HomeView',
  components: {
    SideBar,Filters,SearchBar,ListingsCard
  },
  data() {
    return {
     listings: [],
    };
  },
  async mounted() {
    try{
      const response = await apiClient.get('/listings');
      this.listings = response.data;
      console.log($img('/images/sample.jpg'));
    } catch (error) {
      console.error("Eroare la încărcarea listărilor:", error);
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}


</style>