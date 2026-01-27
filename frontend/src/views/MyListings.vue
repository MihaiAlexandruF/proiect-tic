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
          @edit = "handleEdit"
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
     handleEdit(listingId) {
      this.$router.push(`/edit-listing/${listingId}`)
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
        const response = await apiClient.delete(`/listings/${listingId}`)
        this.$message.success('Anunt sters cu succes!')
        this.listings = this.listings.filter(l => l.id !== listingId)
      } catch (error) {
        console.error('Eroare:', error)
        if (error.response?.status === 403) {
          this.$message.error('Nu ai dreptul sa stergi acest anunt')
        } else if (error.response?.status === 404) {
          this.$message.error('Anuntul nu a fost gasit')
        } else {
          this.$message.error('Eroare la stergerea anuntului')
        }
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
