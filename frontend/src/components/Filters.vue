<template>
    <div class="colapse-card" style="width: 100%; margin: 0; "> 
        <el-collapse v-model="vcolapse">
            <el-collapse-item title="Filtre Căutare" name="1">
                <div class="filter-group">
                    <el-form>
                        <el-row :gutter="20" align="middle">
                            <el-col :span="4" >
                                <el-form-item  label-position="top" label="Preț (EUR)">
                                    <el-slider
                                        v-model="activeFilter.price"
                                        :min="0"
                                        :max="650"
                                        range
                                        show-tooltip
                                    />
                                    <div class="price-values">
                                        <el-input-number size="small" :controls="false" v-model="activeFilter.price[0]" :min="0" :max="activeFilter.price[1]" />
                                        <el-input-number size="small" :controls="false" v-model="activeFilter.price[1]" :min="activeFilter.price[0]" :max="650" />
                                    </div>
                                </el-form-item>
                            </el-col>

                            <el-col :span="3">
                                <el-form-item label-position="top" label="Număr Camere"  >
                                    <el-radio-group v-model="activeFilter.rooms" size="small"> >
                                        <el-radio-button label="1" />
                                        <el-radio-button label="2" />
                                        <el-radio-button label="3" />
                                        <el-radio-button label="4+" />
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>

                            <el-col :span="3" >
                                <el-form-item  label-position="top" label="Mobilat">
                                   <el-select
                                       v-model="activeFilter.furnished"
                                       placeholder="Mobilat"
                                       >
                                        <el-option label="Mobilat" value="mobilat" />
                                        <el-option label="Nemobilat" value="nemobilat" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { el } from 'element-plus/es/locales.mjs';

export default {
    name: 'Filters',
    data() {
        return {
            vcolapse: ['1'],
            activeFilter: {
                price: [0, 650],
                furnished: [],
                rooms: null,
            },
        };
    },
};
</script>
<style scoped>
.price-values {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.filter-group {
  padding-left: 15px;
}
.price-values .el-input-number {
  flex: 1;
  min-width: 0;
}

.el-row.is-align-middle {
  align-items: center;
}
</style>