import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.15/vue.esm-browser.min.js";

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
          console.log(error);
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
    },
    removeCartItem(id) {
      this.status.cartQtyLoading = id;
      axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`)
        .then((response) => {
          this.status.cartQtyLoading = "";
          this.getCart();
        })
    },
    removeCartItemAll() {
      axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)
        .then((response) => {
          this.getCart();
        })
    },
    getCart() {
      axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
        .then((response) => {
          console.log(response);
          this.carts = response.data.data;

        })
    }
  },
  components: {
    userProductModal,
  },
  mounted() {
    this.getProducts();
    this.getCart();
  }
});



app.mount("#app");