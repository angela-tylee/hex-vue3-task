import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.15/vue.esm-browser.min.js";

let productModal = "";
let delProductModal = ""

createApp({
  data () {
    return {
      apiUrl: "https://ec-course-api.hexschool.io/v2",
      apiPath: 'angelalee',
      products: [],
      temp: {},
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
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(url)
        // 成功後顯示將 response.data.products 存到定義好的 products 陣列中，使 products.html 取值
        .then((response) => {
          this.products = response.data.products;
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
          productModal.hide();
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },
    openModal(isNew, item) { 
      if (isNew === 'new') {
        this.temp = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        this.temp = { ...item }; 
        // 以展開 (spread) 進行淺拷貝（shallow copy)
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.temp = { ...item };
        // 以展開 (spread) 進行淺拷貝（shallow copy)
        delProductModal.show();
      }
    },
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temp.id}`;

      axios.delete(url)
        .then((response) => {
          alert(response.data.message);
          delProductModal.hide();
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },
    createImages() {
      this.temp.imagesUrl = [];
      this.temp.imagesUrl.push('');
    },
    delImages() {
      this.temp.imagesUrl = [];
      this.temp.imagesUrl.pop();
    },
  },
  mounted() {
    // 取出 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();

    productModal = new bootstrap.Modal(document.getElementById("productModal"));

    delProductModal = new bootstrap.Modal(document.getElementById("delProductModal"));
  }
}).mount("#app");