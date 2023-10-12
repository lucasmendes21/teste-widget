<template>
  <div class="col-6">
    <label>Localidade</label>
    <select
      class="custom-select"
      :id="`selectLocality${chartID}`"
      multiple
      @change="setValues($event)"
    >
      <option
        :value="undefined"
        >Todas as Localidades</option>

      <option
        v-for="value in localityList"
        :key="value.id"
        :value="value.id"
        :title="value.descricao"
        >{{ value.descricao }}</option
      >
    </select>
  </div>
</template>

<script>
import { getFilters } from '../../../services/filter.service'

export default {
  props: {
    regionalManagement: {
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
      localityField: [],
      localityList: []
    }
  },

  created() {
    if (this.regionalManagement && this.regionalManagement.length === 1) {
      this.fetchLocality()
    }
  },

  methods: {
    async fetchLocality() {
      const options = {
        method: 'POST',
        url: 'listLocality',
        data: {
          accountId: this.accountID,
          idGerenciaRegional: this.regionalManagement[0]
        }
      }
      this.localityList = await getFilters(options)
    },

    async setValues(event) {
      this.localityField = Array.from(event.target.selectedOptions)
        .filter((e) => e.value > 0)
        .map((e) => e.value)

      const descriptions = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.title)

      const localityDescription = descriptions.length > 3
        ? `${descriptions.length} Localidades selecionadas`
        : descriptions.join(' / ')
      this.updateParent(this.localityField, localityDescription)
    },

    async updateParent(locality, localityDescription) {
      this.$emit(`${this.chartID}Locality`, {
        locality,
        localityDescription
      })
    }
  },

  watch: {
    regionalManagement(val) {
      this.localityField = undefined
      this.localityList = []
      if (val && val.length === 1) {
        this.fetchLocality()
      }
    }
  }
}
</script>
