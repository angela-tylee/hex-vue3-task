
// 1. 先把元件環境建立好
// 2. 建立 templates
// 3. 截除版型內的錯誤

export default {
  props: ['pages','getData'],

  // 插入 Bootstrap Pagination：顯示分頁
  template: `<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{ disabled: !pages.has_pre}">
      <a class="page-link" href="#" @click="getData(pages.current_page - 1)">Previous</a>
    </li>
    <li class="page-item" :class="{
        active: page === pages.current_page
      }" v-for="page in pages.total_pages" :key="page + 123">
      <a class="page-link" href="#" @click="getData(page)">{{ page }}</a>
    </li>
    <li class="page-item" :class="{ disabled: !pages.has_next}">
      <a class="page-link" href="#" @click="getData(pages.current_page + 1)">Next</a>
    </li>
  </ul>
</nav>`
}
