<template>
  <div class="col-6">
    <label>Gerência Regional</label>
    <select
      class="custom-select"
      :id="`selectRegionalManagement${chartID}`"
      multiple
      @change="setValues($event)"
    >
      <option
        :value="undefined"
      >Todas as Gerências Regionais</option>

      <option
        v-for="value in regionalManagementList"
        :key="value.id"
        :value="value.id"
        :title="value.descricao"
      >{{value.descricao}}</option>
    </select>
  </div>
</template>

<script>
import { getFilters } from '../../../services/filter.service'

export default {
  props: {
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
      regionalManagementField: [],
      regionalManagementList: []
    }
  },

  created() {
    this.fetchRegionalManagement()
  },

  methods: {
    async fetchRegionalManagement() {
      try {
        const options = {
          method: 'POST',
          url: 'listRegionalManagement',
          data: {
            accountId: this.accountID
          }
        }
        this.regionalManagementList = await getFilters(options)
      } catch (err) {
        console.log('Não consegui me conectar com meu servidor, tente mais tarde.')
      }
    },

    async setValues(event) {
      this.regionalManagementField = Array.from(event.target.selectedOptions)
        .filter((e) => e.value > 0)
        .map((e) => e.value)

      const descriptions = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.title)

      const regionalManagementDescription = descriptions.length > 3
        ? `${descriptions.length} Regionais selecionados`
        : descriptions.join(' / ')
      this.updateParent(this.regionalManagementField, regionalManagementDescription)
    },

    async updateParent(regionalManagement, regionalManagementDescription) {
      this.$emit(`${this.chartID}RegionalManagement`, {
        regionalManagement,
        regionalManagementDescription
      })
    }
  }
}
</script>
