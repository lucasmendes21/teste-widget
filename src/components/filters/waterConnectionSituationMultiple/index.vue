<template>
  <div>
    <label>Situação da Ligação de Água</label>
    <select
      class='custom-select'
      :id="`selectWaterConnectionSituation${chartID}`"
      @change="changeWaterConnectionSituation($event)"
      multiple>
      <option
        :class="waterConnectionSituationField === undefined
          || waterConnectionSituationField.length === 0 ? 'selected' : ''"
        :value="undefined"
      >Todas as Situações da Ligação de Água</option>

      <option
        v-for="value in waterConnectionSituationList"
        :key="chartID + value.ID"
        :value="value.ID"
        :title="value.descricao"
        :selected="waterConnectionSituationField.indexOf(value.ID) !== -1 ? 'selected': undefined"
      >{{value.descricao}}</option>
    </select>
  </div>
</template>

<script>
import { getFilters } from '../../../services/filter.service'

export default {
  props: {
    waterConnectionSituation: {
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
      waterConnectionSituationField: [],
      waterConnectionSituationList: []
    }
  },

  created() {
    this.waterConnectionSituationField = this.waterConnectionSituation
      ? this.waterConnectionSituation : []
    this.fetchWaterConnectionSituation()
  },

  methods: {
    async fetchWaterConnectionSituation() {
      try {
        const options = {
          method: 'POST',
          url: 'waterConnectionSituations',
          data: {
            accountID: this.accountID
          }
        }
        this.waterConnectionSituationList = await getFilters(options)
      } catch (error) {
        console.log(error.message)
      }
    },

    async changeWaterConnectionSituation(event) {
      this.waterConnectionSituationField = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.value)

      const descriptions = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.title)
      const waterConnectionSituationDescription = descriptions.length > 3 ? `${descriptions.length} Situações da Ligação de Água selecionadas` : descriptions.join(' / ')
      this.updateParent(this.waterConnectionSituationField, waterConnectionSituationDescription)
    },

    async updateParent(IDs, name) {
      this.$emit(`${this.chartID}WaterConnectionSituationMultiple`, {
        IDs,
        name
      })
    }
  },

  watch: {
    waterConnectionSituation() {
      if (this.waterConnectionSituation.length === 0) {
        const elements = $(`select[id=selectWaterConnectionSituation${this.chartID}] option:selected`)
        Array.from(elements).forEach((e) => {
          e.selected = false
        })
      }
    }
  }
}
</script>
