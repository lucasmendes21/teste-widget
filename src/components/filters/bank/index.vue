<template>
  <div>
    <div class="row mt-4">
      <div class="col-sm-12">
        <label class="mr-sm-2" for="selectBank">Banco</label>
        <select class="form-control" id="selectBank" @change="changeBank($event)">
          <option
            :class="name === undefined ? 'selected' : ''"
            :value="undefined"
          >Todos os Bancos</option>
          <option
            v-for="value in banksList"
            :key="value.id"
            :value="value.id"
            :title="value.banco"
            :selected="name == value.banco? 'selected': undefined"
          >{{value.banco}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { getFilters } from '../../../services/filter.service'

export default {
  props: {
    chartID: {
      type: String,
      required: true
    },
    accountID: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      banksList: [],
      ID: undefined,
      name: undefined
    }
  },

  async created() {
    await this.getBanks()
  },

  methods: {
    async getBanks() {
      try {
        const options = {
          method: 'GET',
          url: `listBanks/${this.accountID}`,
          data: {}
        }
        this.banksList = await getFilters(options)
      } catch (err) {
        console.log(err)
        console.log('Não consegui me conectar com meu servidor, tente mais tarde.')
      }
    },

    changeBank(event) {
      this.ID = event.target.value
      this.name = event.target.selectedOptions[0].title

      this.updateParent()
    },

    updateParent() {
      this.$emit(`${this.chartID}Banks`, { ID: this.ID, name: this.name })
    }
  }
}
</script>
