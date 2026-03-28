import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loading = ref(false)

  function setProducts(newProducts) {
    products.value = newProducts
  }

  return { products, loading, setProducts }
})
