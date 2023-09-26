<template>
  <div>
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
      ref="chart" v-if="!loading">
    </apexchart>
    <div v-if="loading">
      <p style="text-align: center">Dados Diarios da Arrecadação</p>
      <div style="margin: 0 auto; width: max-content">
        <div class="spinner-border text-dark" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { formatThousandsNotation, kFormatter, moneyFormat } from './util/util'

export default {
  data() {
    return {
      loading: false,
      dataArrecadation: {},
      chartOptions: {},
      series: [],
    }
  },


  async created() {
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
            chartID: 'dadosDiariosArrecadacao',
            accountID: 42,
            userID: 308,
            payload: {
              dateInitial: "2023-09-22",
              dateFinal: "2023-09-22"
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
        // subtitle: {
        //   text: `${this.filters.join(' / ')}`,
        //   align: 'center',
        //   style: {
        //     fontSize: '12px'
        //   }
        // },
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
    }
  }
}
</script>