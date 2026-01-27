<template>
  <SearchBar width="100%" ></SearchBar>
  <Filters width="100%" />
  <el-scrollbar height="calc(100vh - 200px)" @end-reached="loadMore">
    <div class="home">
      <el-row :gutter=20 style="margin-top: 20px;">
        <el-col :span="6" v-for="listing in listings " :key="listing.id">
          <ListingsCard :listing="listing"></ListingsCard>
        </el-col>
      </el-row>

    <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon> Se încarcă mai multe...
      </div>
      
      <p v-if="noMore" class="no-more-text">Nu mai sunt anunțuri de afișat.</p>
    </div>
  </el-scrollbar>
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
     loading:false,
     noMore:false,
     page:1,
     limit:10
    };
  },
 async mounted() {
    // Încărcăm prima tranșă de date
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      if (this.loading || this.noMore) return;

      this.loading = true;
      try {
        const response = await apiClient.get('/listings', {
          params: {
            page: this.page,
            limit: this.limit
          }
        });

        const newItems = response.data;

        if (newItems.length === 0) {
          this.noMore = true;
        } else {
          this.listings.push(...newItems);
          this.page++;
        }
      } catch (error) {
        console.error("Eroare la încărcarea listărilor:", error);
      } finally {
        this.loading = false;
      }
    },
    
    loadMore() {
      console.log("Am ajuns la capăt, încarc mai multe...");
      this.fetchData();
    }
  }
}
</script>

<style scoped>
.home {
  padding: 0 20px 50px 20px; 
  text-align: center;
}

.loading-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #409EFF;
}

.no-more-text {
  margin: 20px 0;
  color: #909399;
  font-size: 14px;
}

:deep(.el-scrollbar__bar) {
  opacity: 1;
}
</style>