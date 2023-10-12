<template>
  <div class="card m-3">
    <div class="d-flex justify-content-end m-4 gap">
      <Filter
        @dadosDiariosArrecadacaoFilter="setFiltersData($event)"
        @dadosDiariosArrecadacaoDescription="setAllFilter($event)"
      />
      <a class="cursor-filter" data-bs-toggle="modal" data-bs-target="#chartModal">
        <i class="fas fa-expand"></i>
      </a>
    </div>

    <div class="card-body">
      <ChartModal>
        <DadosDiariosArrecadacaoChartText :data="dataArrecadation" :loader="loading" />
        <apexchart
          type="bar"
          height="350"
          :options="chartOptions"
          :series="series"
          ref="chart" v-if="!loading">
        </apexchart>
      </ChartModal>

      <DadosDiariosArrecadacaoChartText :data="dataArrecadation" :loader="loading" />
      <apexchart
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
        ref="chart" v-if="!loading">
      </apexchart>

      <Loading v-if="loading" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { formatThousandsNotation, kFormatter, moneyFormat } from '../../../util/util'
import Loading from '../../Loading.vue'
import Filter from './DadosDiariosdaArrecadacaoFilter.vue'
import DadosDiariosArrecadacaoChartText from './DadosDiariosArrecadacaoChartText.vue'
import ChartModal from '../../ChartModal.vue'

export default {
  components: {
    Loading,
    Filter,
    DadosDiariosArrecadacaoChartText,
    ChartModal
  },

  data() {
    return {
      accountID: 42,
      userID: 308,
      chartID: 'dadosDiariosArrecadacao',
      loading: false,
      dataArrecadation: {},
      chartOptions: {},
      series: [],
      filtersLegend: [],
      filters: {
        dateInitial: '',
        dateFinal: '',
        bankID: undefined,
        regionalManagement: undefined,
        locality: undefined,
        category: undefined,
        powerSphere: undefined,
        waterConnectionSituation: undefined,
        sewageConnectionSituation: undefined,
      }
    }
  },

  provide() {
    return {
      data: {
        accountID: this.accountID,
        userID: this.userID,
        chartID: this.chartID
      }
    };
  },

  async created() {
    this.initialFilters()
    await this.renderChart()
  },

  methods: {
    async renderChart() {
      try {
        this.loading = true
        const response = await axios({
          method: 'POST',
          responseType: 'json',
          url: 'https://polvoapis.consensotec.com.br/polvo-gsan-online-rest-api/chart',
          data: {
            chartID: this.chartID,
            accountID: this.accountID,
            userID: this.userID,
            payload: {
              dateInitial: this.filters.dateInitial,
              dateFinal: this.filters.dateFinal,
              bank: this.filters.bankID,
              regionalManagement: this.filters.regionalManagement,
              locality: this.filters.locality,
              category: this.filters.category,
              powerSphere: this.filters.powerSphere,
              waterConnectionSituation: this.filters.waterConnectionSituation,
              sewageConnectionSituation: this.filters.sewageConnectionSituation
            }
          }
        })
  
        const { data } = response
  
        this.dataArrecadation = {
          totalCollection: data.total,
          mediaCollection: data.mediaTotal,
          totalPayment: data.pagamentoTotal,
          mediaTotalPayment: data.mediaPagamentoTotal,
          mediaValuePayment: data.valorMedioPagamento,
          lineMedia: data.lineMedia
        }
        this.mountChart(data)
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    mountChart(data) {
      this.chartOptions = {
        dataLabels: {
          enabled: false
        },
        title: {
          text: 'Dados Diários da Arrecadação',
          align: 'center',
          style: {
            fontSize: '16px'
          }
        },
        subtitle: {
          text: `${this.filtersLegend.join(' / ')}`,
          align: 'center',
          style: {
            fontSize: '12px'
          }
        },
        xaxis: {
          categories: data.categories,
          tickPlacement: 'on'
        },
        annotations: {
          yaxis: [
            {
              y: data.lineMedia,
              borderColor: '#9C27B0',
              label: {
                borderColor: '#9C27B0',
                style: {
                  color: '#fff',
                  background: '#9C27B0'
                },
                text: `Valor Médio ${formatThousandsNotation(this.lineMedia)}`
              }
            }
          ]
        },
        yaxis: [
          {
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true,
              color: '#008FFB'
            },
            labels: {
              style: {
                color: '#008FFB'
              },
              formatter: (value) => `R$ ${kFormatter(value)}`
            },
            title: {
              text: 'Valor',
              style: {
                color: '#008FFB'
              }
            },
            tooltip: {
              enabled: false
            }
          },
          {
            opposite: true,
            axisTicks: {
              show: true
            },
            tickPlacement: 'on',
            axisBorder: {
              show: true,
              color: '#00E396'
            },
            labels: {
              style: {
                color: '#00E396'
              },
              formatter: (value) => `${kFormatter(value)}`
            },
            title: {
              text: 'Quantidade',
              style: {
                color: '#00E396'
              }
            }
          }
        ],
        tooltip: {
          fixed: {
            enabled: false
          },
          y: {
            formatter(value, { seriesIndex, dataPointIndex }) {
              if (seriesIndex === 0) {
                return `Valor Arrecadado: R$ ${
                  moneyFormat(value)} (${
                  moneyFormat(data.tooltip.value[dataPointIndex].porcentagem)}%)`
              } if (seriesIndex === 1) {
                return `Quantidade de Pagamentos: ${
                  formatThousandsNotation(value)} (${
                  moneyFormat(data.tooltip.amount[dataPointIndex].porcentagem)}%)`
              }
              return ''
            },
            title: {
              formatter() {
                return ''
              }
            }
          }
        },
        legend: {
          horizontalAlign: 'center',
          onItemClick: {
            toggleDataSeries: true
          }
        },
        noData: {
          text: 'Sem dados',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: '#008FFB',
            fontSize: '20px'
          }
        },
        chart: {
          defaultLocale: 'ptBR',
          locales: [{
            name: 'ptBR',
            options: {
              toolbar: {
                download: 'Exportar',
                selection: 'Seleção',
                selectionZoom: 'Zoom',
                zoomIn: 'Ampliar',
                zoomOut: 'Reduzir',
                pan: 'Arrastar',
                reset: 'Reset Zoom'
              }
            }
          }],
          zoom: {
            enabled: true,
            type: 'y'
          },
          toolbar: {
            show: true,
            tools: {
              download: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            },
            export: {
              csv: {
                filename: 'dados_diarios_arrecadacao_chart',
                columnDelimiter: ';',
                headerCategory: 'Data',
                dateFormatter(timestamp) {
                  return new Date(timestamp).toDateString()
                }
              }
            }
          }
        }
      }

      this.series = data.series
    },

    setAllFilter(event) {
      this.filtersLegend = []

      if (event.date) {
        this.filtersLegend.push(`de ${this.formatDate(event.date[0], true)} à ${this.formatDate(event.date[1], true)}`)
      }

      if (event.bankName) {
        this.filtersLegend.push(event.bankName)
      }

      if (event.regionalManagement) {
        this.filtersLegend.push(event.regionalManagement)
      }

      if (event.locality) {
        this.filtersLegend.push(event.locality)
      }

      if (event.category) {
        this.filtersLegend.push(event.category)
      }

      if (event.powerSphere) {
        this.filtersLegend.push(event.powerSphere)
      }

      if (event.waterConnectionSituation) {
        this.filtersLegend.push(event.waterConnectionSituation)
      }

      if (event.sewageConnectionSituation) {
        this.filtersLegend.push(event.sewageConnectionSituation)
      }
    },

    setFiltersData(event) {
      this.filters.dateInitial = this.formatDate(event.date[0])
      this.filters.dateFinal = this.formatDate(event.date[1])

      this.filters.bankID = event.bankID
      this.filters.regionalManagement = event.regionalManagement
      this.filters.locality = event.locality
      this.filters.category = event.category
      this.filters.powerSphere = event.powerSphere
      this.filters.waterConnectionSituation = event.waterConnectionSituation
      this.filters.sewageConnectionSituation = event.sewageConnectionSituation
      this.filters.loading = event.loading

      this.renderChart()
    },

    formatDate(date, filter = false) {
      const originalDate = new Date(date)

      const year = originalDate.getFullYear();
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
      const day = originalDate.getDate().toString().padStart(2, '0')

      return filter ? `${day}/${month}/${year}` : `${year}-${month}-${day}`
    },

    initialFilters() {
      this.filters.dateInitial = this.formatDate(new Date())
      this.filters.dateFinal = this.formatDate(new Date())
      this.filtersLegend.push(`de ${this.formatDate(new Date(), true)} à ${this.formatDate(new Date(), true)}`)
    }
  }
}
</script>

<style scoped>
.gap {
  gap: 10px;
}

.cursor-filter {
  cursor: pointer;
}
</style>