<template>
  <div class="home-wrapper">
    <div class="search-section">
      <SearchBar width="100%" @search="handleSearch" />
      <Filters width="100%" @filter="handleFilter" />
    </div>

    <el-scrollbar height="calc(100vh - 240px)" @end-reached="loadMore">
      <div class="home">
       
        <el-row :gutter="20" class="listings-grid">
          <el-col 
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6" 
            v-for="listing in listings" 
            :key="listing.id"
          >
            <ListingsCard :listing="listing" />
          </el-col>
        </el-row>

        <div v-if="loading" class="loading-container">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>Se incarca mai multe...</span>
        </div>
        
        <div v-if="noMore && listings.length > 0" class="no-more">
          <el-divider />
          <p>Nu mai sunt anunturi de afisat</p>
        </div>

        <div v-if="!loading && listings.length === 0" class="empty-state">
          <el-icon :size="60" color="#909399"><House /></el-icon>
          <h3>Niciun anunt disponibil</h3>
          <p>Revino mai tarziu pentru noi oferte</p>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import Filters from '@/components/Filters.vue';
import SearchBar from '@/components/SearchBar.vue';
import ListingsCard from '@/components/ListingsCard.vue';
import { Loading, House } from '@element-plus/icons-vue';
import axios from 'axios';
import apiClient from '@/api';
export default {
  name: 'HomeView',
  components: {
    SideBar,Filters,SearchBar,ListingsCard,Loading,House
  },
  data() {
    return {
     listings: [],
     loading:false,
     noMore:false,
     page:1,
     limit:10,
     searchQuery: '',
     searchCounty: '',
     searchCity: '',
     filters: {
       minPrice: 0,
       maxPrice: 1000,
       rooms: null,
       surface: null,
       features: []
     }
    };
  },
 async mounted() {
    // Încărcăm prima tranșă de date
    await this.fetchData();
  },
  methods: {
    async fetchData(reset = false) {
      if (reset) {
        this.listings = [];
        this.page = 1;
        this.noMore = false;
        this.loading = false;
      }

      if (this.loading || this.noMore) return;

      this.loading = true;
      try {
        const params = {
          page: this.page,
          limit: this.limit
        };

        if (this.searchQuery) {
          params.title = this.searchQuery;
        }

        if (this.searchCounty) {
          params.county = this.searchCounty;
        }

        if (this.searchCity) {
          params.city = this.searchCity;
        }

        if (this.filters.minPrice > 0) {
          params.minPrice = this.filters.minPrice;
        }

        if (this.filters.maxPrice < 1000) {
          params.maxPrice = this.filters.maxPrice;
        }

        if (this.filters.rooms) {
          params.rooms = this.filters.rooms;
        }

        if (this.filters.surface) {
          params.surface = this.filters.surface;
        }

        if (this.filters.features && this.filters.features.length > 0) {
          params.features = this.filters.features.join(',');
        }

        const response = await apiClient.get('/listings', { params });

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
      console.log("Am ajuns la capat, incarc mai multe...");
      this.fetchData();
    },

    handleSearch(searchData) {
      this.searchQuery = searchData.title;
      this.searchCounty = searchData.county;
      this.searchCity = searchData.city;
      this.fetchData(true);
    },

    handleFilter(filterData) {
      this.filters.minPrice = filterData.price[0];
      this.filters.maxPrice = filterData.price[1];
      this.filters.rooms = filterData.rooms;
      this.filters.surface = filterData.surface;
      this.filters.features = filterData.features;
      this.fetchData(true);
    }
  }
}
</script>

<style scoped>
.home-wrapper {
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.search-section {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px 50px 20px;
}

.listings-header {
  text-align: center;
  margin-bottom: 40px;
}

.listings-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 10px 0;
}

.subtitle {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

.listings-grid {
  margin-top: 20px;
}

.loading-container {
  margin: 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #409EFF;
  font-size: 16px;
}

.loading-container .el-icon {
  font-size: 24px;
}

.no-more {
  margin: 40px 0 20px 0;
  text-align: center;
}

.no-more p {
  color: #909399;
  font-size: 14px;
  margin-top: 10px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #909399;
}

.empty-state h3 {
  font-size: 20px;
  margin: 20px 0 10px 0;
  color: #606266;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

:deep(.el-scrollbar__bar) {
  opacity: 0.6;
  transition: opacity 0.3s;
}

:deep(.el-scrollbar__bar:hover) {
  opacity: 1;
}

@media (max-width: 768px) {
  .listings-header h2 {
    font-size: 24px;
  }
  
  .home {
    padding: 20px 10px;
  }
}
</style>