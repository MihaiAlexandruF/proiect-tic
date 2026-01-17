// frontend/src/stores/auth.js
import { defineStore } from 'pinia';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    loading: true
  }),
  actions: {
    // Detectează automat dacă utilizatorul este logat la pornirea aplicației
    init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = user;
            this.isLoggedIn = true;
          } else {
            this.user = null;
            this.isLoggedIn = false;
          }
          this.loading = false;
          resolve(user);
        });
      });
    },
    async logout() {
      await signOut(auth);
      this.user = null;
      this.isLoggedIn = false;
    }
  }
});