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
        firstname: ''
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
        ]
      }
    };
  },
  methods: {
    async handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth, 
              this.form.email, 
              this.form.password
            );
            
            await api.post('/users', {
              uid: userCredential.user.uid,
              email: this.form.email,
              lastname: this.form.lastname,
              firstname: this.form.firstname
            });

            ElMessage.success('Cont creat cu succes!');
            console.log('User registered:', userCredential.user);
            
            this.$router.push('/');
          } catch (error) {
            console.error('Eroare Firebase:', error.code);
            ElMessage.error('Eroare: ' + error.message);
          }
        } else {
          ElMessage.warning('Te rugăm să completezi corect câmpurile.');
          return false;
        }
      });
    }
  }
};
</script>