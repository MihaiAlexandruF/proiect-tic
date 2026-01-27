<template>
  <div class="add-container">
    <el-steps :active="activeStep" finish-status="success" align-center style="margin-bottom: 30px">
      <el-step title="Anunțul tău" />
      <el-step title="Specificații" />
      <el-step title="Reguli & Costuri" />
      <el-step title="Previzualizare" />
    </el-steps>

    <el-card class="form-card" shadow="always">
      <div v-if="activeStep === 0">
        <el-form :model="form" :rules="rules" ref="formStep0" label-position="top">
          <el-form-item label="Titlu Anunț" prop="title">
            <el-input v-model="form.title" placeholder="Ex: Apartament 2 camere, metrou Piața Unirii" maxlength="100" show-word-limit />
          </el-form-item>

          <el-form-item label="Descriere Anunț" prop="description">
            <el-input type="textarea" v-model="form.description" :rows="5" placeholder="Descrie proprietatea, zona, facilitățile..." />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Preț Chirie (EUR/lună)" prop="price">
                <el-input-number v-model="form.price" :min="0" style="width: 100%" :controls="false">
                  <template #prefix>€</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Județ" prop="region">
                <el-select v-model="form.region" placeholder="Selectează" style="width: 100%" filterable>
                  <el-option v-for="item in counties" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Localitate / Sector" prop="locality">
                <el-input v-model="form.locality" placeholder="Ex: Sector 3" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Strada" prop="street">
                <el-input v-model="form.street" placeholder="Numele străzii" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Galerie Foto (Max 8)" prop="images">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :on-change="handleImageProcess"
              :on-remove="handleRemove"
              :file-list="fileList"
              :limit="8"
              multiple
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <small style="color: #909399">Poți încărca până la 8 imagini.</small>
          </el-form-item>
        </el-form>
      </div>

      <div v-else-if="activeStep === 1">
        <el-form :model="form.specs" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Compartimentare">
                <el-select v-model="form.specs.partitioning" style="width: 100%">
                  <el-option label="Decomandat" value="Decomandat" />
                  <el-option label="Semidecomandat" value="Semidecomandat" />
                  <el-option label="Nedecomandat" value="Nedecomandat" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Etaj">
                <el-input v-model="form.specs.floor" placeholder="Ex: 4/10 sau Parter" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Nr. Camere">
                <el-input-number v-model="form.specs.rooms" :min="1" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Suprafață utilă (mp)">
                <el-input-number v-model="form.specs.surface" :min="1" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Balcoane">
                <el-input-number v-model="form.specs.balconies" :min="0" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="An construcție">
                <el-select v-model="form.specs.buildingYear" style="width: 100%">
                  <el-option label="Înainte de 1977" value="Înainte de 1977" />
                  <el-option label="1977 - 1990" value="1977 - 1990" />
                  <el-option label="1990 - 2000" value="1990 - 2000" />
                  <el-option label="2000 - 2010" value="2000 - 2010" />
                  <el-option label="După 2010" value="După 2010" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Încălzire">
                <el-select v-model="form.specs.heating" style="width: 100%">
                  <el-option label="Centrală proprie" value="private_boiler" />
                  <el-option label="Încălzire centralizată" value="central_heating" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Dotări suplimentare">
            <el-checkbox-group v-model="form.specs.features">
              <el-checkbox label="Lift" />
              <el-checkbox label="Parcare" />
              <el-checkbox label="Terasă" />
              <el-checkbox label="Aer Condiționat" />
              <el-checkbox label="Mașină de spălat vase" />
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>

      <div v-else-if="activeStep === 2">
        <el-form label-position="top">
          <el-divider content-position="left"><el-icon><Money /></el-icon> Costuri & Contract</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Întreținere medie (EUR)">
                <el-input-number v-model="form.costs.maintenanceCost" :min="0" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Ședere minimă (luni)">
                <el-input-number v-model="form.costs.minimumStayMonths" :min="1" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Utilități incluse?">
                <el-switch v-model="form.costs.utilitiesIncluded" active-text="Da" inactive-text="Nu" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left"><el-icon><CircleCheck /></el-icon> Regulile Casei</el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="Animale companie">
                <el-switch v-model="form.rules.petsAllowed" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Fumatul permis">
                <el-switch v-model="form.rules.smokingAllowed" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Accept studenți">
                <el-switch v-model="form.rules.studentsAllowed" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Accept străini">
                <el-switch v-model="form.rules.foreignersAllowed" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div v-else class="preview-section">
        <div class="preview-header">
          <h2>{{ form.title || 'Titlu necompletat' }}</h2>
          <h3 class="price-text">{{ form.price ? form.price + ' EUR / lună' : 'Preț nespecificat' }}</h3>
          <p class="location-text">
            <el-icon><Location /></el-icon> 
            {{ form.region }}, {{ form.locality || 'Loc. nespecificată' }}, {{ form.street || 'Strada nespecificată' }}
          </p>
        </div>

        <el-divider />

        <div class="preview-gallery" v-if="fileList.length">
          <img v-for="(file, idx) in fileList" :key="idx" :src="file.url" class="mini-thumb" />
        </div>
        <el-alert v-else title="Nu ai încărcat nicio imagine" type="info" :closable="false" show-icon style="margin-bottom: 20px" />

        <el-row :gutter="30">
          <el-col :md="12">
            <el-descriptions title="Specificații Proprietate" :column="1" border>
              <el-descriptions-item label="Compartimentare">{{ form.specs.partitioning || 'Nespecificat' }}</el-descriptions-item>
              <el-descriptions-item label="Suprafață">{{ form.specs.surface ? form.specs.surface + ' mp' : 'Nespecificat' }}</el-descriptions-item>
              <el-descriptions-item label="Nr. Camere">{{ form.specs.rooms }}</el-descriptions-item>
              <el-descriptions-item label="Nr. Balcoane">{{ form.specs.balconies }}</el-descriptions-item>
              <el-descriptions-item label="Etaj">{{ form.specs.floor || 'Nespecificat' }}</el-descriptions-item>
              <el-descriptions-item label="An Construcție">{{ form.specs.buildingYear || 'Nespecificat' }}</el-descriptions-item>
              <el-descriptions-item label="Încălzire">
                {{ form.specs.heating === 'private_boiler' ? 'Centrală proprie' : 'Încălzire centralizată' }}
              </el-descriptions-item>
              <el-descriptions-item label="Dotări">
                {{ form.specs.features.join(', ') || 'Fără dotări extra' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>

          <el-col :md="12">
            <el-descriptions title="Condiții & Reguli" :column="1" border>
              <el-descriptions-item label="Întreținere Medie">{{ form.costs.maintenanceCost }} EUR</el-descriptions-item>
              <el-descriptions-item label="Ședere minimă">{{ form.costs.minimumStayMonths }} luni</el-descriptions-item>
              <el-descriptions-item label="Utilități incluse">{{ form.costs.utilitiesIncluded ? 'Da' : 'Nu' }}</el-descriptions-item>
              <el-descriptions-item label="Animale">{{ form.rules.petsAllowed ? 'Permise' : 'Interzise' }}</el-descriptions-item>
              <el-descriptions-item label="Fumat">{{ form.rules.smokingAllowed ? 'Permis' : 'Interzis' }}</el-descriptions-item>
              <el-descriptions-item label="Accept studenți">{{ form.rules.studentsAllowed ? 'Da' : 'Nu' }}</el-descriptions-item>
              <el-descriptions-item label="Accept străini">{{ form.rules.foreignersAllowed ? 'Da' : 'Nu' }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>

        <div class="preview-desc-box">
          <h4>Descriere anunț:</h4>
          <p style="white-space: pre-line;">{{ form.description || 'Nicio descriere adăugată.' }}</p>
        </div>
      </div>

      <div class="form-footer">
        <el-button v-if="activeStep > 0" @click="activeStep--">Înapoi</el-button>
        <el-button v-if="activeStep < 3" type="primary" @click="validateAndNext">Următor</el-button>
        <el-button v-else type="success" :loading="submitting" @click="submitListing">Publică Anunțul</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { Plus, Location, Money, CircleCheck } from '@element-plus/icons-vue'
import apiClient from '@/api'

const router = useRouter()
const activeStep = ref(0)
const submitting = ref(false)
const fileList = ref([]) // Stocăm fișierele cu tot cu URL de preview
const formStep0 = ref(null)

const initialForm = {
  title: '',
  description: '',
  price: null,
  region: '',
  locality: '',
  street: '',
  specs: {
    partitioning: '',
    floor: '',
    rooms: 1,
    surface: null,
    balconies: 0,
    buildingYear: '',
    heating: 'private_boiler',
    furnished: 'unfurnished',
    equipped: 'not_equipped',
    features: []
  },
  costs: {
    maintenanceCost: 0,
    utilitiesIncluded: false,
    minimumStayMonths: 1
  },
  rules: {
    petsAllowed: false,
    smokingAllowed: false,
    studentsAllowed: true,
    foreignersAllowed: true
  },
  meta: {
    status: 'active',
    viewsCount: 0,
    favoritesCount: 0
  }
}

const form = reactive({ ...JSON.parse(JSON.stringify(initialForm)) })

const rules = {
  title: [{ required: true, message: 'Titlul este obligatoriu', trigger: 'blur' }],
  description: [{ required: true, message: 'Adaugă o descriere', trigger: 'blur' }],
  price: [{ required: true, message: 'Prețul este obligatoriu', trigger: 'blur' }],
  region: [{ required: true, message: 'Selectează județul', trigger: 'change' }],
  locality: [{ required: true, message: 'Localitatea este obligatorie', trigger: 'blur' }],
  street: [{ required: true, message: 'Strada este obligatorie', trigger: 'blur' }]
}

// LOGICA DE PROCESARE IMAGINI (Pentru a avea preview în pasul 3)
const handleImageProcess = (uploadFile) => {
  // Verificăm dacă fișierul este imagine
  if (!uploadFile.raw.type.startsWith('image/')) {
    ElMessage.error('Poți încărca doar imagini!')
    return false
  }

  // Generăm URL local pentru previzualizare
  const reader = new FileReader()
  reader.onload = (e) => {
    // Adăugăm în lista noastră internă
    fileList.value.push({
      uid: uploadFile.uid,
      name: uploadFile.name,
      url: e.target.result, // Aici salvăm Base64 pentru preview
      raw: uploadFile.raw   // Păstrăm fișierul brut pentru trimitere
    })
  }
  reader.readAsDataURL(uploadFile.raw)
}

const handleRemove = (file) => {
  fileList.value = fileList.value.filter(f => f.uid !== file.uid)
}

const validateAndNext = async () => {
  if (activeStep.value === 0) {
    if (!formStep0.value) return
    await formStep0.value.validate((valid) => {
      if (valid) {
        activeStep.value++
      } else {
        ElMessage.error('Completează câmpurile obligatorii de la Pasul 1.')
      }
    })
  } else {
    activeStep.value++
  }
}

const submitListing = async () => {
  submitting.value = true
  try {
    const formData = new FormData()

    // Câmpuri plate
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('price', form.price)
    formData.append('region', form.region)
    formData.append('locality', form.locality)
    formData.append('street', form.street)

    // Obiecte NESTUITE
    formData.append('specs', JSON.stringify(form.specs))
    formData.append('costs', JSON.stringify(form.costs))
    formData.append('rules', JSON.stringify(form.rules))
    formData.append('meta', JSON.stringify(form.meta))

    // Imagini - Trimitem fișierele RAW
    fileList.value.forEach(file => {
      if (file.raw) formData.append('images', file.raw)
    })

    await apiClient.post('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    ElMessage.success('Anunț publicat!')
    router.push('/')
  } catch (err) {
    ElMessage.error('Eroare la server')
    console.error(err)
  } finally {
    submitting.value = false
  }
}

const counties = ['Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea']
</script>

<style scoped>
.add-container {
  max-width: 950px;
  margin: 30px auto;
  padding: 0 20px;
}
.form-card {
  border-radius: 12px;
}
.form-footer {
  margin-top: 30px;
  text-align: right;
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.price-text {
  color: #f56c6c;
  margin: 5px 0;
}
.location-text {
  color: #909399;
  font-size: 14px;
}
.preview-gallery {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 20px;
  padding-bottom: 10px;
}
.mini-thumb {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.preview-desc-box {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}
.preview-desc-box p {
  line-height: 1.6;
  color: #606266;
}
</style>
