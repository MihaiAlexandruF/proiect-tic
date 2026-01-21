<template>
  <div class="add-container">
    <el-steps :active="activeStep" finish-status="success" style="margin-bottom: 16px">
      <el-step title="Cardul tau"></el-step>
      <el-step title="Dotari & Specifice"></el-step>
      <el-step title="Previzualizare"></el-step>
    </el-steps>

    <el-card class="form-card" shadow="hover">
      <div v-if="activeStep === 0">
        <el-form :model="form" :rules="rules" ref="stepForm" label-position="top">
          <el-form-item label="Titlu" prop="title">
            <el-input v-model="form.title" placeholder="Ex: Apartament spatios în centru" />
          </el-form-item>

          <el-form-item label="Descriere" prop="description">
            <el-input type="textarea" v-model="form.description" :rows="4" />
          </el-form-item>

          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item label="Pret (EUR)" prop="price">
                <el-input-number
                  :controls="false"
                  v-model="form.price"
                  :min="0"
                  style="width: 160px"
                >
                  <template #prefix>€</template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="Judet" prop="region">
                <el-select
                  v-model="form.region"
                  placeholder="Selecteaza judetul"
                  style="width: 100%"
                  filterable
                >
                  <el-option v-for="item in counties" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Localitate / Sector" prop="locality">
                <el-input v-model="form.locality" placeholder="Localitatea / Sector" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Strada" prop="street">
                <el-input v-model="form.street" placeholder="Strada" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Poze" prop="images">
            <el-upload
              class="upload-demo"
              action=""
              :http-request="dummyUpload"
              list-type="picture-card"
              :file-list="fileList"
              :limit="8"
              multiple
              :on-remove="handleRemove"
              :on-preview="handlePreview"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <small>Max 8 imagini.</small>
          </el-form-item>
        </el-form>
      </div>

      <div v-else-if="activeStep === 1">
        <el-form :model="form" label-position="top">
          <el-row :gutter="12">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Etaj">
                <el-input v-model="form.floor" placeholder="ex: 3/8" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Camere">
                <el-input-number v-model="form.rooms" :min="1" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Suprafata (mp)">
                <el-input-number v-model="form.surface" :min="0" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Mobilat">
                <el-select v-model="form.furnished" placeholder="Selecteaza">
                  <el-option label="Mobilat" value="furnished" />
                  <el-option label="Nemobilat" value="unfurnished" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Utilat">
                <el-select v-model="form.equipped" placeholder="Selecteaza">
                  <el-option label="Utilat" value="equipped" />
                  <el-option label="Neutilat" value="not_equipped" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Încalzire">
                <el-select v-model="form.heating" placeholder="Selecteaza">
                  <el-option label="Centrala proprie" value="private_boiler" />
                  <el-option label="Încalzire centrala" value="central_heating" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Balcoane">
                <el-input-number v-model="form.balconies" :min="0" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Facilitati">
                <el-checkbox-group v-model="form.features">
                  <el-checkbox label="Lift" name="features" />
                  <el-checkbox label="Parcare" name="features" />
                  <el-checkbox label="Terasa" name="features" />
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div v-else>
        <h3>Preview</h3>
        <div class="preview">
          <div class="preview-gallery">
            <img v-for="(f, i) in fileList" :key="i" :src="f.url || f.preview" class="thumb" />
          </div>
          <div class="preview-meta">
            <h4>{{ form.title }}</h4>
            <p>{{ form.description }}</p>
            <p><strong>Price:</strong> {{ form.price }} EUR</p>
            <p><strong>Locatie:</strong> {{ form.location }}</p>
            <p>
              <strong>Camere:</strong> {{ form.rooms }} • {{ form.surface }} mp • Etaj:
              {{ form.floor }}
            </p>
            <p>
              <strong>Mobilat:</strong> {{ form.furnished }} • <strong>Utilat:</strong>
              {{ form.equipped }}
            </p>
            <p>
              <strong>Încalzire:</strong> {{ form.heating }} • <strong>Balcoane:</strong>
              {{ form.balconies }}
            </p>
            <p><strong>Facilitati:</strong> {{ form.features.join(', ') }}</p>
          </div>
        </div>
      </div>

      <div class="actions" style="margin-top: 16px; text-align: right">
        <el-button v-if="activeStep > 0" @click="prevStep">Înapoi</el-button>
        <el-button v-if="activeStep < 2" type="primary" @click="nextStep">Urmator →</el-button>
        <el-button v-else type="success" @click="submitListing">Publica</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import api from '../api'
export default {
  name: 'AddListingGamified',
  setup() {
    const activeStep = ref(0)
    const router = useRouter()
    const fileList = ref([])
    const counties = [
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
    ]
    const form = ref({
      title: '',
      description: '',
      price: null,
      location: '',
      images: [],
      floor: '',
      rooms: 1,
      surface: null,
      furnished: '',
      equipped: '',
      heating: '',
      balconies: 0,
      features: [],
    })

    const rules = {
      title: [{ required: true, message: 'Titlu necesar', trigger: 'blur' }],
      description: [{ required: true, message: 'Descriere necesara', trigger: 'blur' }],
      price: [{ required: true, message: 'Pret necesar', trigger: 'change' }],
    }

    // dummy upload to create local preview without server
    const dummyUpload = ({ file, onSuccess }) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        file.preview = e.target.result
        fileList.value.push({
          name: file.name,
          url: null,
          preview: file.preview,
          raw: file,
        })
        onSuccess && onSuccess({}, file)
      }
      reader.readAsDataURL(file)
    }

    const handleRemove = (file, fileListArg) => {
      fileList.value = fileList.value.filter((f) => f.name !== file.name)
    }
    const handlePreview = (file) => {
      window.open(file.preview || file.url)
    }

    const prevStep = () => {
      if (activeStep.value > 0) activeStep.value--
    }
    const nextStep = () => {
      if (activeStep.value === 0) {
        if (!form.value.title || !form.value.description || !form.value.price) {
          ElMessage.warning('Completeaza titlu, descriere și pret înainte de a continua.')
          return
        }
      }
      activeStep.value++
    }

    const submitListing = async () => {
      try {
        const formData = new FormData()
        Object.keys(form.value).forEach((key) => {
          if (Array.isArray(form.value[key])) {
            form.value[key].forEach((item) => formData.append(key, item))
          } else {
            formData.append(key, form.value[key])
          }
        })
        fileList.value.forEach((file) => {
          if (file.raw) {
            formData.append('images', file.raw)
          }
        })
        const response = await api.post('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
        console.log('Anunț creat:', response.data)
        ElMessage.success('Anunțul a fost publicat cu succes!')

        fileList.value = []
        activeStep.value = 0

        
         router.push('/');
      } catch (err) {
        console.error('Eroare la trimitere:', err)
        ElMessage.error('Eroare la publicare: ' + (err.response?.data?.message || err.message))
      }
    }

    return {
      activeStep,
      form,
      rules,
      fileList,
      dummyUpload,
      handleRemove,
      handlePreview,
      prevStep,
      nextStep,
      submitListing,
      counties,
    }
  },
}
</script>

<style scoped>
.add-container {
  max-width: 900px;
  margin: 24px auto;
  padding: 0 12px;
}
.form-card {
  border-radius: 10px;
}
.preview {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.preview-gallery {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  width: 40%;
}
.thumb {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.preview-meta {
  width: 60%;
}
@media (max-width: 720px) {
  .preview {
    flex-direction: column;
  }
  .preview-gallery,
  .preview-meta {
    width: 100%;
  }
}
</style>
