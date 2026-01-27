<template>
    <div class="filters-wrapper"> 
        <el-collapse v-model="vcolapse">
            <el-collapse-item name="1">
                <template #title>
                    <div class="collapse-title">
                        <el-icon><Filter /></el-icon>
                        <span>Filtre Cautare</span>
                    </div>
                </template>
                
                <div class="filter-content">
                    <el-form label-position="top">
                        <el-row :gutter="24">
                            <el-col :xs="24" :sm="12" :md="6">
                                <div class="filter-box">
                                    <el-form-item label="Pret (EUR/luna)">
                                        <el-slider
                                            v-model="activeFilter.price"
                                            :min="0"
                                            :max="1000"
                                            range
                                            show-tooltip
                                        />
                                        <div class="price-range">
                                            <el-input-number 
                                                size="small" 
                                                :controls="false" 
                                                v-model="activeFilter.price[0]" 
                                                :min="0" 
                                                :max="activeFilter.price[1]"
                                            />
                                            <span class="separator">-</span>
                                            <el-input-number 
                                                size="small" 
                                                :controls="false" 
                                                v-model="activeFilter.price[1]" 
                                                :min="activeFilter.price[0]" 
                                                :max="1000"
                                            />
                                        </div>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :xs="24" :sm="12" :md="6">
                                <div class="filter-box">
                                    <el-form-item label="Numar Camere">
                                        <el-radio-group v-model="activeFilter.rooms" class="rooms-group">
                                            <el-radio-button label="1">1</el-radio-button>
                                            <el-radio-button label="2">2</el-radio-button>
                                            <el-radio-button label="3">3</el-radio-button>
                                            <el-radio-button label="4+">4+</el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :xs="24" :sm="12" :md="6">
                                <div class="filter-box">
                                    <el-form-item label="Suprafata minima (mp)">
                                        <el-input-number 
                                            v-model="activeFilter.surface" 
                                            :min="0" 
                                            :max="500" 
                                            :step="10"
                                            placeholder="Ex: 50"
                                            style="width: 100%"
                                        />
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :xs="24" :sm="12" :md="6">
                                <div class="filter-box">
                                    <el-form-item label="Facilitati">
                                        <div class="facilities-group">
                                            <el-checkbox-group v-model="activeFilter.features">
                                                <el-checkbox label="mobilat">
                                                    <el-icon><House /></el-icon> Mobilat
                                                </el-checkbox>
                                                <el-checkbox label="centrala">
                                                    <el-icon><Sunny /></el-icon> Centrala
                                                </el-checkbox>
                                            </el-checkbox-group>
                                        </div>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <el-divider />

                        <div class="filter-actions">
                            <el-button @click="resetFilters" icon="Refresh" plain>
                                Reseteaza filtre
                            </el-button>
                        </div>
                    </el-form>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { Filter, House, Sunny } from '@element-plus/icons-vue'

export default {
    name: 'Filters',
    components: { Filter, House, Sunny },
    data() {
        return {
            vcolapse: [],
            activeFilter: {
                price: [0, 1000],
                rooms: null,
                surface: null,
                features: []
            },
            debounceTimer: null
        };
    },
    watch: {
        'activeFilter.price': {
            handler() {
                if (this.debounceTimer) {
                    clearTimeout(this.debounceTimer);
                }
                this.debounceTimer = setTimeout(() => {
                    this.$emit('filter', this.activeFilter);
                }, 800);
            },
            deep: true
        },
        'activeFilter.rooms': function() {
            this.$emit('filter', this.activeFilter);
        },
        'activeFilter.surface': function() {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            this.debounceTimer = setTimeout(() => {
                this.$emit('filter', this.activeFilter);
            }, 600);
        },
        'activeFilter.features': {
            handler() {
                this.$emit('filter', this.activeFilter);
            },
            deep: true
        }
    },
    methods: {
        resetFilters() {
            this.activeFilter = {
                price: [0, 1000],
                rooms: null,
                surface: null,
                features: []
            };
        }
    }
};
</script>

<style scoped>
.filters-wrapper {
    width: 100%;
    margin: 0;
}

.collapse-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.filter-content {
    padding: 20px;
    background: #f9fafb;
    border-radius: 8px;
}

.filter-box {
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    height: 100%;
}

.price-range {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    align-items: center;
}

.separator {
    color: #909399;
    font-weight: bold;
    font-size: 14px;
}

.price-range .el-input-number {
    flex: 1;
}

.rooms-group {
    width: 100%;
    display: flex;
    gap: 4px;
}

.rooms-group .el-radio-button {
    flex: 1;
}

.facilities-group {
    padding-top: 8px;
}

.filter-actions {
    text-align: right;
    padding: 0 8px;
}

:deep(.el-form-item__label) {
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
}

:deep(.el-checkbox) {
    display: flex;
    align-items: center;
    margin: 10px 0;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.3s;
}

:deep(.el-checkbox:hover) {
    background: #f5f7fa;
}

:deep(.el-checkbox .el-icon) {
    margin-right: 4px;
}

:deep(.el-slider__bar) {
    background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
}

:deep(.el-radio-button__inner) {
    padding: 8px 16px;
}

@media (max-width: 768px) {
    .filter-content {
        padding: 15px;
    }
    
    .filter-box {
        padding: 12px;
        margin-bottom: 12px;
    }
    
    .collapse-title {
        font-size: 14px;
    }
}
</style>