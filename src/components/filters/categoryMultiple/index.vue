<template>
  <div>
    <label>Categoria</label>
    <select
      class='custom-select'
      :id="`selectCategory${chartID}`"
      @change="changeCategory($event)"
      multiple>
      <option
        :class="categoryField === undefined || categoryField.length === 0 ? 'selected' : ''"
        :value="undefined"
      >Todas as Categorias</option>

      <option
        v-for="value in categoryList"
        :key="chartID + value.ID"
        :value="value.ID"
        :title="value.descricao"
        :selected="categoryField.indexOf(value.ID) !== -1 ? 'selected': undefined"
      >{{value.descricao}}</option>
    </select>
  </div>
</template>

<script>
import { getFilters } from '../../../services/filter.service'

export default {
  props: {
    category: {
      type: Array,
      required: false
    },
    accountID: {
      type: Number,
      required: true
    },
    chartID: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      categoryField: [],
      categoryList: []
    }
  },

  created() {
    this.categoryField = this.category ? this.category : []
    this.fetchCategory()
  },

  methods: {
    async fetchCategory() {
      try {
        const options = {
          method: 'POST',
          url: 'categories',
          data: {
            accountID: this.accountID
          }
        }
        this.categoryList = await getFilters(options)
      } catch (error) {
        if (error.statusCode === 440) {
          sendNotificationError(error.error.mensagem)
          this.$store.dispatch('logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        } else {
          sendNotificationError(error.message)
        }
      }
    },

    async changeCategory(event) {
      this.categoryField = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.value)

      const descriptions = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.title)
      const categoryDescription = descriptions.length > 3 ? `${descriptions.length} Categorias selecionadas` : descriptions.join(' / ')
      this.updateParent(this.categoryField, categoryDescription)
    },

    async updateParent(IDs, name) {
      this.$emit(`${this.chartID}CategoryMultiple`, {
        IDs,
        name
      })
    }
  },

  watch: {
    category() {
      if (this.category.length === 0) {
        const elements = $(`select[id=selectCategory${this.chartID}] option:selected`)
        Array.from(elements).forEach((e) => {
          e.selected = false
        })
      }
    }
  }
}
</script>
