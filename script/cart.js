const { createApp } = Vue;

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 讀取外部的資源
loadLocaleFromURL('../zh_TW.json');

// Activate the locale
configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const apiUrl = "https://vue3-course-api.hexschool.io"
const apiPath = "angelalee"

const userProductModal = {
  props: ["tempProducts", "addToCart", "status"],
  data() {
    return {
      productModal: null,
      qty: 1,
    }
  },
  template: "#userProductModal",
  methods: {
    open() {
      this.productModal.show();
    },
    close() {
      this.productModal.hide();
    }
  },
  watch: {
    tempProducts() {
      this.qty = 1;
    }
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal);

  }
}

const app = createApp({
  data() {
    return {
      products: [],
      tempProducts: {},
      status: {
        addCartLoading: "",
        cartQtyLoading: "",
      },
      carts: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    }
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then((response) => {
          console.log(response);
          this.products = response.data.products;
        })
        .catch((error) => {
          alert(error.response.data.message);
        }
        )
    },
    openModal(product) {
      this.tempProducts = product;
      this.$refs.userProductModal.open();
    },
    addToCart(product_id, qty = 1) {
      const order = {
        product_id,
        qty
      };
      this.status.addCartLoading = product_id;
      axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, { data: order })
        .then((response) => {
          console.log(response);
          this.status.addCartLoading = "";
          this.getCart();
          this.$refs.userProductModal.close();
        })
        .catch((error) => {
          alert(error.response.data.message);
        })
    },
    changeCartQty(item, qty = 1) {
      const order = {
        product_id: item.product.id,
        qty
      };
      this.status.cartQtyLoading = item.id;
      axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`, { data: order })
        .then((response) => {
          console.log(response);
          this.status.cartQtyLoading = "";
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
        })
    },
    removeCartItem(id) {
      this.status.cartQtyLoading = id;
      axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`)
        .then((response) => {
          this.status.cartQtyLoading = "";
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
        })
    },
    removeCartItemAll() {
      axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)
        .then((response) => {
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
        })
    },
    getCart() {
      axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
        .then((response) => {
          console.log(response);
          this.carts = response.data.data;
        })
        .catch((error) => {
          alert(error.response.data.message);
        })
    },
    createOrder() {
      const order = this.form;
      axios.post(`${apiUrl}/v2/api/${apiPath}/order`, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
        })
    }
  },
  components: {
    userProductModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  mounted() {
    this.getProducts();
    this.getCart();
  }
});

app.mount("#app");