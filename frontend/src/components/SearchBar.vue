<template>
  <div class="search-box" >
  <el-row :gutter="12" class="search-bar" align="middle">
    <el-col :xs="24" :sm="10">
      <el-input
        v-model="query"
        placeholder="Caută titlu..."
        clearable
        @keyup.enter="onSearch"
      />
    </el-col>

    <el-col :xs="24" :sm="7">
      <el-select
        v-model="county"
        placeholder="Județ"
        clearable
        style="width: 100%;"
      >
       <el-option v-for="item in counties" :key="item" :label="item" :value="item" />
      </el-select>
    </el-col>

    <el-col :xs="24" :sm="5">
      <el-input
        v-model="city"
        placeholder="Oraș"
        clearable
        @keyup.enter="onSearch"
      />
    </el-col>

    <el-col :xs="24" :sm="2">
      <el-button type="primary" @click="onSearch">Caută</el-button>
    </el-col>
  </el-row>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    counties: { type: Array, default: () => [
      
      'Alba',
      'Arad',
      'Argeș',
      'Bacau',
      'Bihor',
      'Bistrita-Nasaud',
      'Botoșani',
      'Brașov',
      'Braila',
      'București',
      'Buzau',
      'Caraș-Severin',
      'Calarași',
      'Cluj',
      'Constanta',
      'Covasna',
      'Dambovita',
      'Dolj',
      'Galati',
      'Giurgiu',
      'Gorj',
      'Harghita',
      'Hunedoara',
      'Ialomita',
      'Iași',
      'Ilfov',
      'Maramureș',
      'Mehedinti',
      'Mureș',
      'Neamt',
      'Olt',
      'Prahova',
      'Satu Mare',
      'Salaj',
      'Sibiu',
      'Suceava',
      'Teleorman',
      'Timiș',
      'Tulcea',
      'Vaslui',
      'Valcea',
      'Vrancea',
    
    ] }
  },
  data() {
    return {
      query: '',
      county: null,
      city: ''
      
    }
  },
  methods: {
    onSearch() {
      this.$emit('search', {
        title: this.query?.trim() || '',
        county: this.county || '',
        city: this.city?.trim() || ''
      })
    }
  }
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 12px;
}
.search-bar .el-col {
  display: flex;
  align-items: center;
}
.search-box {
  width: 100%;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 6px 18px rgba(24, 26, 27, 0.06);
  box-sizing: border-box;
  margin-bottom: 1px;
}


</style>