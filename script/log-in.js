import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.15/vue.esm-browser.min.js";


createApp ({
  data() {
    return {
      // 使用者輸入的帳號(username)密碼(password)
      user : {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const api = 'https://ec-course-api.hexschool.io/v2/admin/signin';
      axios.post(api, this.user)
        .then((response) => {
          const { token, expired } = response.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;

          // 登入成功後導向 products-wk3.html
          window.location = 'products-wk3.html';
        })
        .catch((error) => {
          alert(error.data.message); 
        })
    }
  }
}).mount('#app');