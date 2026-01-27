<template>
<el-card class="listing-card" @click="goToDetails" >
    <template #header>
        <div class="card-header">
            <h3>{{ listing.title }}</h3>
        </div>
    </template>
        <img :src="imageSrc" alt="Listing Image" class="listing-image"/>
        <div class="card-content">
            <el-tag size="large" type="primary"> Pret: {{ listing.price }}</el-tag>
        </div>
            
</el-card>
</template>

<script>
export default {
  name: 'ListingsCard',
  props: {
    listing: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    };
  },
  computed: {
    imageSrc() {
      if (this.listing.images && this.listing.images.length > 0) {
        return this.listing.images[0]
      }
      return 'https://via.placeholder.com/400x300/e0e0e0/666666?text=No+Image'
    }
  },
  methods: {
    goToDetails() {
      this.$router.push(`/listing/${this.listing.id}`);
    }
  }
}
</script>

<style scoped>
.listing-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.listing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.listing-image {
  width: 100%;       
  height: 220px;     
  object-fit: cover;
  display: block;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 48px;
}

.card-content {
  margin-top: auto;
  padding-top: 10px;
}

.listing-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap; 
}
</style>