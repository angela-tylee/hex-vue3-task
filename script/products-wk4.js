import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.15/vue.esm-browser.min.js";

let productModal = "";
let delProductModal = ""

import pagination from './components-wk4/pagination.js';
import ProductModal from './components-wk4/ProductModal.js';
import DelProductModal from './components-wk4/DelProductModal.js';

const app = createApp({
  data () {
    return {
      apiUrl: "https://ec-course-api.hexschool.io/v2",
      apiPath: 'angelalee',
      products: [],
      temp: {
        imageUrl: [],  
      },
      isNew: false,
      pages:{},
    }
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
          window.location = 'log-in.html';
        })
        
    },
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        // 成功後顯示將 response.data.products 存到定義好的 products 陣列中，使 products.html 取值
        .then((response) => {
          console.log(response);
          this.products = response.data.products;
          this.pages = response.data.pagination;
        })
        .catch((error) => {
        // 失敗顯示預設的錯誤訊息
          alert(error.data.message);
        })
    },
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`
      let http = 'post'; // 根據資料是否已存在會對資料做不同的操作，因此 http verb 儲存在一個可重新賦值的變數中

      // 如果這筆資料 isNew = true，則直接更新 (put)
      if(!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temp.id}`
        http = 'put'
      }

      // axios.method (url, data)
      // method = 括弧記法 []，將變數 'http' 包起來，根據資料狀態動態調整操作資料的方式 （post / put)
      // data = data (){} 中定義的 temp 物件
      axios[http](url,{ data: this.temp })
        .then((response)=> {
          alert(response.data.message);
          // productModal.hide();
          this.$refs.pModal.closeModal();
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },
    openModal(isNew, item) { 
      if (isNew === 'new') {
        this.temp = {
          imageUrl: [],
        };
        this.isNew = true;
        // productModal.show();
        this.$refs.pModal.openModal();
      } else if (isNew === 'edit') {
        this.temp = { ...item }; 
        this.isNew = false;
        // productModal.show();
        this.$refs.pModal.openModal();
      } else if (isNew === 'delete') {
        this.temp = { ...item };
        // delProductModal.show();
        this.$refs.dModal.openModal();
      }
    },
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temp.id}`;

      axios.delete(url)
        .then((response) => {
          alert(response.data.message);
          // delProductModal.hide();
          this.$refs.dModal.closeModal();
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },
    createImages() {
      this.temp.imageUrl = [];
      this.temp.imageUrl.push('');
    },
    delImages() {
      this.temp.imageUrl.pop();
    },
  },
  mounted() {
    // 取出 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();

  },
  components: {
    pagination,
    ProductModal,
    DelProductModal,
  }
});


app.mount("#app");