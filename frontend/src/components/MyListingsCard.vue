<template>
    <el-card :body-style="{ padding: '0px' }" class="listing-card">
        <img :src="listing.images[0]" class="image" />
        <div style="padding: 14px">
            <h3>{{ listing.title }}</h3>
            <p class="price">{{ listing.price }} €/lună</p>
            <p class="location">{{ listing.locality }}, {{ listing.region }}</p>
            
            <div class="actions">
                <el-button type="primary" size="default" @click="editListing" class="action-btn">
                    <el-icon><Edit /></el-icon>
                    <span>Modifică</span>
                </el-button>
                <el-button 
                    :type="listing.meta?.status === 'active' ? 'warning' : 'success'" 
                    size="default" 
                    @click="toggleStatus"
                    class="action-btn"
                >
                    <el-icon><Switch /></el-icon>
                    <span>{{ listing.meta?.status === 'active' ? 'Dezactivează' : 'Activează' }}</span>
                </el-button>
                <el-button type="danger" size="default" @click="deleteListing" class="action-btn">
                    <el-icon><Delete /></el-icon>
                    <span>Șterge</span>
                </el-button>
            </div>
        </div>
    </el-card>
</template>

<script>
import { Edit, Delete, Switch } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';

export default {
    name: 'MyListingCard',
    components: { Edit, Delete, Switch },
    props: {
        listing: {
            type: Object,
            required: true
        }
    },
    methods: {
        editListing() {
            this.$router.push(`/edit-listing/${this.listing.id}`);
        },
        async toggleStatus() {
            const newStatus = this.listing.meta?.status === 'active' ? 'inactive' : 'active';
            this.$emit('toggle-status', this.listing.id, newStatus);
        },
        async deleteListing() {
            try {
                await ElMessageBox.confirm(
                    'Sigur vrei să ștergi acest anunț?',
                    'Confirmare',
                    {
                        confirmButtonText: 'Da, șterge',
                        cancelButtonText: 'Anulează',
                        type: 'warning',
                    }
                );
                this.$emit('delete', this.listing.id);
            } catch {
            }
        }
    }
}
</script>

<style scoped>
.listing-card {
    margin-bottom: 20px;
    transition: all 0.3s ease;
    border-radius: 8px;
    overflow: hidden;
}
.listing-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
.price {
    font-size: 22px;
    font-weight: bold;
    color: #409EFF;
    margin: 8px 0;
}
.location {
    color: #909399;
    font-size: 14px;
    margin-bottom: 15px;
}
.actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}
.action-btn {
    width: 100%;
    justify-content: flex-start;
    font-weight: 500;
}
.action-btn .el-icon {
    margin-right: 8px;
    font-size: 16px;
}
.action-btn span {
    flex: 1;
    text-align: left;
}
</style>
