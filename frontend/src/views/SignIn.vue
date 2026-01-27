<template>
  <el-form 
    :model="form" 
    :rules="rules" 
    ref="signInForm" 
    label-position="top" 
    class="sign-in-form"
    style="max-width: 400px; margin: 50px auto;"
  >
    <h2>Autentificare</h2>
    
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" placeholder="Ex: agent@imobiliare.ro"></el-input>
    </el-form-item>

    <el-form-item label="Parolă" prop="password">
      <el-input v-model="form.password" type="password" placeholder="Minim 6 caractere" show-password></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSignIn" style="width: 100%">
        Autentificare   
      </el-button>
    </el-form-item>
    
    <p>Nu ai cont? <router-link :to="{ path: '/register', query: $route.query }">Înregistrează-te aici</router-link></p>
  </el-form>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { ElMessage } from 'element-plus'; 

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      rules: {
        email: [
          { required: true, message: 'Email-ul este obligatoriu', trigger: 'blur' },
          { type: 'email', message: 'Introdu o adresă de email validă', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'Parola este obligatorie', trigger: 'blur' },
          { min: 6, message: 'Parola trebuie să aibă minim 6 caractere', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    async handleSignIn() {
      this.$refs.signInForm.validate(async (valid) => {
        if (valid) {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth, 
              this.form.email, 
              this.form.password
            );
            
            ElMessage.success('Autentificare reușită!');
            console.log('User signed in:', userCredential.user);
            
            const destinantion = this.$route.query.redirect || '/';
            this.$router.push(destinantion);
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
  },
  mounted() {
    // Verificăm dacă în URL avem "?redirect="
    if (this.$route.query.redirect) {
      ElMessage({
        message: 'Trebuie să fii autentificat pentru a accesa această pagină!',
        type: 'warning',
        duration: 5000, // Mesajul stă 5 secunde
        showClose: true,
      });
    }
  }

};
</script>