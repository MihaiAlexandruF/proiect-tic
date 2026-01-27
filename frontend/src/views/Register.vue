<template>
  <el-form 
    :model="form" 
    :rules="rules" 
    ref="registerForm" 
    label-position="top" 
    class="register-form"
    style="max-width: 400px; margin: 50px auto;"
  >
    <h2>Creare Cont</h2>
    <el-row :gutter="20">
        <el-col :span="12">
    <el-form-item  label="Nume" prop="lastname">
      <el-input v-model="form.lastname" ></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item  label="Prenume" prop="firstname">
      <el-input v-model="form.firstname" ></el-input>
    </el-form-item>
    </el-col>
    </el-row>
    <el-form-item label="Numar de Telefon" prop="phone"  >
      <el-input placeholder="Ex: 0712345678" v-model="form.phone" ></el-input>
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" placeholder="Ex: agent@imobiliare.ro"></el-input>
    </el-form-item>

    <el-form-item label="Parolă" prop="password">
      <el-input v-model="form.password" type="password" placeholder="Minim 6 caractere" show-password></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleRegister" style="width: 100%">
        Înregistrare
      </el-button>
    </el-form-item>
    
    <p>Ai deja cont? <router-link to="/login">Loghează-te aici</router-link></p>
  </el-form>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import api from '../api';
import { ElMessage } from 'element-plus'; 

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        lastname: '',
        firstname: '',
        phone:'',
      },
      rules: {
        email: [
          { required: true, message: 'Email-ul este obligatoriu', trigger: 'blur' },
          { type: 'email', message: 'Introdu o adresă de email validă', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'Parola este obligatorie', trigger: 'blur' },
          { min: 6, message: 'Parola trebuie să aibă minim 6 caractere', trigger: 'blur' }
        ],
        lastname: [
          { required: true, message: 'Numele este obligatoriu', trigger: 'blur' }
        ],
        firstname: [
          { required: true, message: 'Prenumele este obligatoriu', trigger: 'blur' }
        ],
        phone:[
          {required: true, message:'Numarul de telefon este obligatoriu', trigger: 'blur'},
          {min:10, max:10, message:"Trebuie sa contina 10 cifre", trigger:'blur'},
      ],
      }
    };
  },
  methods: {
    // frontend/src/views/Register.vue
async handleRegister() {
  this.$refs.registerForm.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('Te rugam sa completezi corect campurile.');
      return;
    }

    try {
      // 1. Creezi userul in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        this.form.email, 
        this.form.password
      );
      
      const user = userCredential.user;

      // 2. Trimiti datele la backend
      // IMPORTANT: apiClient va atasa automat Token-ul deoarece userul este acum logat
      await api.post('/users', {
        uid: user.uid, 
        email: this.form.email,
        lastname: this.form.lastname,
        firstname: this.form.firstname,
        phone: this.form.phone
      });

      ElMessage.success('Cont creat cu succes!');
      
      const destination = this.$route.query.redirect || '/';
      this.$router.push(destination);

    } catch (error) {
      console.error('Eroare inregistrare:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        ElMessage.error('Acest email este deja utilizat.');
      } else {
        ElMessage.error('Eroare la inregistrare. Te rugam sa incerci din nou.');
      }
    }
  });
}
  }
};
</script>