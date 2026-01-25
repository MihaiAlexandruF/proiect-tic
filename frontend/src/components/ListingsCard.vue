<template>
<el-card class="listing-card" @click="goToDetails" >
    <template #header>
        <div class="card-header">
            <h3>{{ listing.title }}</h3>
        </div>
    </template>
        <img :src="listing.images[0]" alt="Listing Image" class="listing-image"/>
        <div class="card-content">
            <el-text size="large" tag="b" type="primary">Price: {{ listing.price }}</el-text>
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
  margin-bottom: 20px;
}
.listing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.listing-image {
  width: 100%;       
  height: 220px;     
  object-fit: cover; /* MAGIC TRICK: Taie excesul fără să distorsioneze */
  display: block;    /* Elimină spațiul mic de sub imagini */
}
.listing-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap; 
}


</style>