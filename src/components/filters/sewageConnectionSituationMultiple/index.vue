<template>
  <div>
    <label>Situação da Ligação de Esgoto</label>
    <select
      class='custom-select'
      :id="`selectSewageConnectionSituation${chartID}`"
      @change="changeSewageConnectionSituation($event)"
      multiple>
      <option
        :class="sewageConnectionSituationField === undefined
          || sewageConnectionSituationField.length === 0 ? 'selected' : ''"
        :value="undefined"
      >Todas as Situações da Ligação de Esgoto</option>

      <option
        v-for="value in sewageConnectionSituationList"
        :key="chartID + value.ID"
        :value="value.ID"
        :title="value.descricao"
        :selected="sewageConnectionSituationField.indexOf(value.ID) !== -1 ? 'selected': undefined"
      >{{value.descricao}}</option>
    </select>
  </div>
</template>

<script>
import { getFilters } from '../../../services/filter.service'

export default {
  props: {
    sewageConnectionSituation: {
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
      sewageConnectionSituationField: [],
      sewageConnectionSituationList: []
    }
  },

  created() {
    this.sewageConnectionSituationField = this.sewageConnectionSituation
      ? this.sewageConnectionSituation : []
    this.fetchSewageConnectionSituation()
  },

  methods: {
    async fetchSewageConnectionSituation() {
      try {
        const options = {
          method: 'POST',
          url: 'sewageConnectionSituations',
          data: {
            accountID: this.accountID
          }
        }
        this.sewageConnectionSituationList = await getFilters(options)
      } catch (error) {
        console.log(error.message)
      }
    },

    async changeSewageConnectionSituation(event) {
      this.sewageConnectionSituationField = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.value)

      const descriptions = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.title)
      const sewageConnectionSituationDescription = descriptions.length > 3 ? `${descriptions.length} Situações da Ligação de Esgoto selecionadas` : descriptions.join(' / ')
      this.updateParent(this.sewageConnectionSituationField, sewageConnectionSituationDescription)
    },

    async updateParent(IDs, name) {
      this.$emit(`${this.chartID}SewageConnectionSituationMultiple`, {
        IDs,
        name
      })
    }
  },

  watch: {
    sewageConnectionSituation() {
      if (this.sewageConnectionSituation.length === 0) {
        const elements = $(`select[id=selectSewageConnectionSituation${this.chartID}] option:selected`)
        Array.from(elements).forEach((e) => {
          e.selected = false
        })
      }
    }
  }
}
</script>
