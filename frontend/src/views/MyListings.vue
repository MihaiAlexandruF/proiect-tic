<template>
  <div class="home" v-loading="loading" element-loading-text="Se incarca anunturile">
    <el-empty v-if="!loading && listings.length === 0" description="Nu ai anunturi">
      <el-button type="primary" @click="$router.push('/add-listing')">
        Adauga primul anunt
      </el-button>
    </el-empty>

    <el-row :gutter="20" style="margin-top: 20px" v-else>
      <el-col :span="6" v-for="listing in listings" :key="listing.id">
        <MyListingsCard
          :listing="listing"
          @toggle-status="handleToggleStatus"
          @delete="handleDelete"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MyListingsCard from '@/components/MyListingsCard.vue'
import apiClient from '@/api'

export default {
  name: 'MyListings',
  components: { MyListingsCard },
  data() {
    return {
      listings: [],
      loading: false,
    }
  },
  methods: {
    async getInfo() {
      this.loading = true
      try {
        const response = await apiClient.get('/listings/my-listings')
        this.listings = response.data
        console.log(this.listings)
      } catch (error) {
        console.error('Eroare:', error)
        this.$message.error('Eroare la incarcarea anunturilor')
      } finally {
        this.loading = false
      }
    },
    async handleToggleStatus(listingId) {
      try {
        const response = await apiClient.patch(`/listings/changeStatus/${listingId}`)
        const finalStatus = response.data.status
        this.$message.success(
          `Status actualizat: ${finalStatus === 'active' ? 'Activ' : 'Inactiv'}`,
        )
        const listing = this.listings.find((l) => l.id === listingId)
        if (listing) {
          if (!listing.meta) listing.meta = {}
          listing.meta.status = finalStatus
        }
      } catch (error) {
        console.error('Eroare frontend:', error)
        this.$message.error('Eroare la schimbarea statusului')
      }
    },
    async handleDelete(listingId) {
      try {
        await apiClient.delete(`/listings/${listingId}`)
        this.$message.success('Anunț șters cu succes!')
        await this.getInfo()
      } catch (error) {
        this.$message.error('Eroare la ștergerea anunțului')
      }
    },
  },
  async mounted() {
    await this.getInfo()
  },
}
</script>

<style scoped>
.home {
  min-height: 400px;
  padding: 20px;
}
</style>
