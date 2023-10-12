<template>
  <div>
    <label>Esfera do Poder</label>
    <select
      class='custom-select'
      :id="`selectPowerSphere${chartID}`"
      @change="changePowerSphere($event)"
      multiple>
      <option
        :class="powerSphereField === undefined || powerSphereField.length === 0 ? 'selected' : ''"
        :value="undefined"
      >Todas as Esferas do Poder</option>

      <option
        v-for="value in powerSphereList"
        :key="chartID + value.ID"
        :value="value.ID"
        :title="value.descricao"
        :selected="powerSphereField.indexOf(value.ID) !== -1 ? 'selected': undefined"
      >{{value.descricao}}</option>
    </select>
  </div>
</template>

<script>
import { getFilters } from '../../../services/filter.service'

export default {
  props: {
    powerSphere: {
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
      powerSphereField: [],
      powerSphereList: []
    }
  },

  created() {
    this.powerSphereField = this.powerSphere ? this.powerSphere : []
    this.fetchPowerSphere()
  },

  methods: {
    async fetchPowerSphere() {
      try {
        const options = {
          method: 'POST',
          url: 'powerSpheres',
          data: {
            accountID: this.accountID
          }
        }
        this.powerSphereList = await getFilters(options)
      } catch (error) {
        console.log(error.message)
      }
    },

    async changePowerSphere(event) {
      this.powerSphereField = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.value)

      const descriptions = Array.from(event.target.selectedOptions)
        .filter((e) => e.value && e.value.length > 0)
        .map((e) => e.title)
      const powerSphereDescription = descriptions.length > 3 ? `${descriptions.length} Esferas do Poder selecionadas` : descriptions.join(' / ')
      this.updateParent(this.powerSphereField, powerSphereDescription)
    },

    async updateParent(IDs, name) {
      this.$emit(`${this.chartID}PowerSphereMultiple`, {
        IDs,
        name
      })
    }
  },

  watch: {
    powerSphere() {
      if (this.powerSphere.length === 0) {
        const elements = $(`select[id=selectPowerSphere${this.chartID}] option:selected`)
        Array.from(elements).forEach((e) => {
          e.selected = false
        })
      }
    }
  }
}
</script>
