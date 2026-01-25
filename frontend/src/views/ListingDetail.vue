<template>
  <div class="page-background">
    <div class="details-wrapper" v-if="listing">
      
      <el-card shadow="never" class="header-card">
        <el-page-header @back="$router.push('/')">
          <template #content>
            <span class="header-title">{{ listing.title }}</span>
          </template>
        </el-page-header>
      </el-card>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :xs="24" :md="16">
          
          <el-card :body-style="{ padding: '0px' }" class="main-card">
            <el-carousel height="500px" indicator-position="outside">
              <el-carousel-item v-for="(item, index) in listing.images" :key="index">
                <el-image :src="item" fit="cover" class="carousel-img">
                   <template #placeholder>
                      <div class="image-slot">Încărcare...</div>
                   </template>
                </el-image>
              </el-carousel-item>
            </el-carousel>
          </el-card>

          <el-card class="main-card" style="margin-top: 20px">
            <template #header>
              <div class="section-header">
                <el-icon><InfoFilled /></el-icon>
                <span>Specificații Tehnice</span>
              </div>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="Compartimentare">{{ listing.partitioning }}</el-descriptions-item>
              <el-descriptions-item label="Camere">{{ listing.rooms }}</el-descriptions-item>
              <el-descriptions-item label="Suprafață">{{ listing.surface }} mp</el-descriptions-item>
              <el-descriptions-item label="Tip">{{ listing.type }}</el-descriptions-item>
              <el-descriptions-item label="Etaj">{{ listing.floor || 'Parter' }}</el-descriptions-item>
              <el-descriptions-item label="Locație">{{ listing.county }}</el-descriptions-item>
              <el-descriptions-item label="Încălzire" >{{ heatingLabel }}</el-descriptions-item>
              
            </el-descriptions>
          </el-card>

          <el-card class="main-card" style="margin-top: 20px">
            <template #header>
              <div class="section-header">
                <span>Descriere completă</span>
              </div>
            </template>
            <p class="description-text">{{ listing.description }}</p>
          </el-card>
        </el-col>

        <el-col :xs="24" :md="8">
          <el-card class="sticky-card" shadow="always">
            <div class="price-tag">{{ listing.price }} EUR</div>
            <el-divider />
            <div class="action-buttons">
              <el-button type="primary" size="large" icon="Phone" @click="getSellerPhone" >Suna Vânzătorul</el-button>
            </div>
            <div v-if="canSeeSellerPhone" style="margin-top: 15px; text-align: center;">
              <el-icon><Phone /></el-icon>
              <span>{{ sellerPhone }}</span>
            </div>
            <el-divider />
            <div class="info-footer">
               <el-icon><Calendar /></el-icon> 
               <span>Publicat la: {{ formatDate(listing.createdAt) }}</span>
            </div>
          </el-card>
          <el-tag  style="font-size: large; margin-top: 20px;"  type="primary" size="large">Adresa: {{ listing.locality }}, {{ listing.street }}</el-tag>
        </el-col>
        
      </el-row>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { Location, Phone, Calendar, InfoFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api';

export default {
  name: 'ListingDetail',
  components: { Location, Phone, Calendar, InfoFilled },
  data() {
    return {
      listing: null, // Aici vom stoca datele de la backend
      loading: true,
      authStore: useAuthStore(),
      canSeeSellerPhone: false,
      sellerPhone: '',
    };
  },
  async mounted() {
    // Luăm ID-ul din runda actuală (ex: /listing/123)
    const listingId = this.$route.params.id;
    await this.fetchListingDetails(listingId);
  },
  methods: {
    async fetchListingDetails(id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/listings/${id}`);
        this.listing = response.data;
      } catch (error) {
        console.error("Nu am putut încărca datele:", error);
      } finally {
        this.loading = false;
      }
    },
     async getSellerPhone() {
      if(!this.authStore.isLoggedIn){
        ElMessage({
          message: 'Trebuie să fii autentificat pentru a vedea numărul de telefon al proprietarului.',
          type: 'error',
        });
        this.$router.push({ 
        path: '/login', 
        query: { redirect: this.$route.fullPath }
        });
        return false;
      } else {
        this.canSeeSellerPhone = true;


        const response = await apiClient(`/listings/owner/${this.listing.id}`)
        this.sellerPhone = response.data.phone || '';
        return true;
      }

      
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('ro-RO');
    }
  },
  computed: {
    heatingLabel() {
      if (!this.listing || !this.listing.heating) return '';
      const heatingMap = {
        private_boiler: 'Centrala proprie',
        central_heating: 'Încălzire centralizată'
      };
      return heatingMap[this.listing.heating] || this.listing.heating;
    }
    
  }
}
</script>

<style scoped>
/* Fundalul principal care "omoară" negrul global */
.page-background {
  background-color: #f5f7fa; /* Un gri-albăstrui foarte deschis */
  min-height: 100vh;
  padding-bottom: 50px;
}

.details-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Cardurile principale cu margini rotunjite mai mari */
.main-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

.header-card {
  border-radius: 12px;
  margin-bottom: 10px;
}

.header-title {
  font-weight: 700;
  font-size: 1.2rem;
}

.carousel-img {
  width: 100%;
  height: 500px;
}

/* Prețul din cardul de contact */
.price-tag {
  font-size: 28px;
  font-weight: bold;
  color: #f56c6c;
  text-align: center;
  margin: 10px 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.description-text {
  color: #5e6d82;
  line-height: 1.8;
  font-size: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 18px;
}

.sticky-card {
  position: sticky;
  top: 20px;
  border-radius: 16px;
  border-top: 4px solid #409eff; /* Accent albastru sus */
}

.info-footer {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #909399;
  font-size: 13px;
}
</style>