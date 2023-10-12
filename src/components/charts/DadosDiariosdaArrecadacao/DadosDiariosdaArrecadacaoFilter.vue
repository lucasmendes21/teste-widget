<template>
  <div>
    <a class="cursor-filter" data-bs-toggle="modal" data-bs-target="#filters">
      <i class="fas fa-filter" />
    </a>

    <div class="modal fade" id="filters" tabindex="-1" aria-labelledby="filtersLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="filtersLabel">Dados Diarios da Arrecadação</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <VueDatePicker v-model="date" locale="pt" range multi-calendars />
            <BankFilter :chartID="data.chartID" :accountID="data.accountID" @dadosDiariosArrecadacaoBanks="setValuesFilterBank()" />

            <div class="row mt-4">
              <RegionalFilter :chartID="data.chartID" :accountID="data.accountID" @dadosDiariosArrecadacaoRegionalManagement="setValuesFilterRegionalManagement($event)" />

              <LocalityFilter :accountID="data.accountID" :chartID="data.chartID" :regionalManagement="regionalManagement" @dadosDiariosArrecadacaoLocality="setValuesFilterLocality($event)"  />
            </div>

            <div class="row mt-4">
              <div class="col-sm">
                <CategoryFilter :accountID="data.accountID" :chartID="data.chartID"
                  @dadosDiariosArrecadacaoCategoryMultiple="setValuesFilterCategory($event)" />
              </div>
              <div class="col-sm">
                <PowerSphereFilter :accountID="data.accountID" :chartID="data.chartID"
                  @dadosDiariosArrecadacaoPowerSphereMultiple="setValuesFilterPowerSphere($event)" />
              </div>
            </div>

            <div class="row">
              <div class="col-sm">
                <WaterConnectionSituationFilter :accountID="data.accountID" :chartID="data.chartID" @dadosDiariosArrecadacaoWaterConnectionSituationMultiple="setValuesFilterWaterConnectionSituation($event)" />
              </div>
              <div class="col-sm">
                <SewageConnectionSituationFilter :accountID="data.accountID" :chartID="data.chartID" @dadosDiariosArrecadacaoSewageConnectionSituationMultiple="setValuesFilterSewageConnectionSituation($event)" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-primary"  data-bs-dismiss="modal" @click="changeFilter()">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BankFilter from '../../filters/bank'
import RegionalFilter from '../../filters/regionalManagementMultiple'
import LocalityFilter from '../../filters/localityByRegionalManagementMultiple'
import CategoryFilter from '../../filters/categoryMultiple'
import PowerSphereFilter from '../../filters/powerSphereMultiple'
import WaterConnectionSituationFilter from '../../filters/waterConnectionSituationMultiple'
import SewageConnectionSituationFilter from '../../filters/sewageConnectionSituationMultiple'

export default {
  inject: ['data'],

  components: {
    BankFilter,
    RegionalFilter,
    LocalityFilter,
    CategoryFilter,
    PowerSphereFilter,
    WaterConnectionSituationFilter,
    SewageConnectionSituationFilter
  },

  data() {
    return {
      date: [],
      bankID: undefined,
      bankName: undefined,
      regionalManagement: undefined,
      regionalManagementName: undefined,
      locality: undefined,
      localityName: undefined,
      category: undefined,
      categoryName: undefined,
      powerSphere: undefined,
      powerSphereName: undefined,
      waterConnectionSituation: undefined,
      waterConnectionSituationName: undefined,
      sewageConnectionSituation: undefined,
      sewageConnectionSituationName: undefined,
    }
  },

  created() {
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
    this.date = [startDate, endDate];
  },

  methods: {
    changeFilter() {
      this.$emit('dadosDiariosArrecadacaoFilter', {
        date: this.date,
        bankID: this.bankID,
        regionalManagement: this.regionalManagement,
        locality: this.locality,
        category: this.category,
        powerSphere: this.powerSphere,
        waterConnectionSituation: this.waterConnectionSituation,
        sewageConnectionSituation: this.sewageConnectionSituation,
        loading: true
      })

      this.$emit('dadosDiariosArrecadacaoDescription', {
        date: this.date,
        bankName: this.bankName,
        regionalManagement: this.regionalManagementName,
        locality: this.localityName,
        category: this.categoryName,
        powerSphere: this.powerSphereName,
        waterConnectionSituation: this.waterConnectionSituationName,
        sewageConnectionSituation: this.sewageConnectionSituationName
      })
    },

    setValuesFilterBank(event) {
      this.bankID = event.ID
      this.bankName = event.name
    },

    setValuesFilterRegionalManagement(event) {
      if (event.regionalManagement && event.regionalManagement.length !== 0) {
        this.regionalManagement = event.regionalManagement
        this.regionalManagementName = event.regionalManagementDescription
      } else {
        this.regionalManagement = undefined
        this.regionalManagementName = undefined
      }
    },

    setValuesFilterLocality(event) {
      if (event.locality && event.locality.length !== 0) {
        this.locality = event.locality
        this.localityName = event.localityDescription
      } else {
        this.locality = undefined
        this.localityName = undefined
      }
    },

    setValuesFilterCategory(event) {
      if (event.IDs && event.IDs.length !== 0) {
        this.category = event.IDs
        this.categoryName = event.name
      } else {
        this.category = undefined
        this.categoryName = undefined
      }
    },

    setValuesFilterPowerSphere(event) {
      if (event.IDs && event.IDs.length !== 0) {
        this.powerSphere = event.IDs
        this.powerSphereName = event.name
      } else {
        this.powerSphere = undefined
        this.powerSphereName = undefined
      }
    },

    setValuesFilterWaterConnectionSituation(event) {
      if (event.IDs && event.IDs.length !== 0) {
        this.waterConnectionSituation = event.IDs
        this.waterConnectionSituationName = event.name
      } else {
        this.waterConnectionSituation = undefined
        this.waterConnectionSituationName = undefined
      }
    },

    setValuesFilterSewageConnectionSituation(event) {
      if (event.IDs && event.IDs.length !== 0) {
        this.sewageConnectionSituation = event.IDs
        this.sewageConnectionSituationName = event.name
      } else {
        this.sewageConnectionSituation = undefined
        this.sewageConnectionSituationName = undefined
      }
    },
  }
}
</script>

<style scoped>
.cursor-filter {
  cursor: pointer;
}
</style>
