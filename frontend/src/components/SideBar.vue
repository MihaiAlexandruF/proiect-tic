<template>
  <div class="sidebar-container">
    <h3 class="sidebar-title">Filtrează Căutarea</h3>

    <div class="filter-group">
      <div class="filter-label">
        <el-icon><Coin /></el-icon>
        <span>Buget (EUR)</span>
      </div>
      
      <div class="filter-content">
        <el-slider 
          v-model="activeFilter.price" 
          range 
          :min="0" 
          :max="2500" 
          :step="50"
          class="price-slider"
        />
        
        <el-row :gutter="10">
          <el-col :span="11">
            <el-input-number 
              v-model="activeFilter.price[0]" 
              :controls="false" 
              placeholder="Min"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="dash">-</el-col>
          <el-col :span="11">
            <el-input-number 
              v-model="activeFilter.price[1]" 
              :controls="false" 
              placeholder="Max"
              style="width: 100%"
            />
          </el-col>
        </el-row>
      </div>
    </div>

    <el-divider />

    <div class="filter-group">
      <div class="filter-label">
        <el-icon><IconMenu /></el-icon>
        <span>Număr Camere</span>
      </div>
      <el-radio-group v-model="activeFilter.rooms" size="small">
        <el-radio-button label="1" />
        <el-radio-button label="2" />
        <el-radio-button label="3" />
        <el-radio-button label="4+" />
      </el-radio-group>
    </div>

    <el-row :gutter="20">
    <el-col :span="12">
    <el-button 
      type="danger" 
      plain 
      style="width: 100%; margin-top: 20px" 
      @click="resetFilters"
    >
      Reseteaza Filtre
    </el-button>
    </el-col >
    <el-col :span="12">
    <el-button 
      type="success" 
      style="width: 100%; margin-top: 20px" 
    >
      Aplică Filtre
    </el-button>
    </el-col>
    </el-row>
  </div>
</template>

<script>
import { Coin, Menu as IconMenu, Setting } from '@element-plus/icons-vue';

export default {
  name: 'SideBar',
  components: { Coin, IconMenu, Setting },
  data() {
    return {
      activeFilter: {
        price: [0, 650],
        rooms: '2',
      }
    };
  },
  methods: {
    resetFilters() {
      this.activeFilter.price = [0, 650];
      this.activeFilter.rooms = '1';
    }
  }
};
</script>

<style scoped>
.sidebar-container {

  background-color: #ffffff;
  padding: 0 20px;
  max-width: 19%;
  border-right: 1px solid #dcdfe6;
  height: 100%;
  display: flex ;
    flex-direction: column;
   align-items: flex-start;
}
.sidebar-title {
  font-size: 18px;
  margin-bottom: 25px;
  color: #303133;
}
.filter-group {
  margin-bottom: 25px;
}
.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-weight: bold;
  color: #606266;
}
.filter-content {
  padding: 0 10px;
}
.el-row {
  width: 100%;
}
</style>

<!-- <style scoped>
.sidebar-container {
  background-color: #ffffff;
  padding: 20px;
  max-width: 15%;
  border-right: 1px solid #dcdfe6;
  height: 100%;
}

.sidebar-title {
  font-size: 18px;
  margin-bottom: 25px;
  color: #303133;
}

.filter-group {
  margin-bottom: 25px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-weight: bold;
  color: #606266;
}

.filter-content {
  padding: 0 10px;
}

.price-slider {
  margin-bottom: 15px;
}

.dash {
  text-align: center;
  line-height: 32px;
}
</style> -->