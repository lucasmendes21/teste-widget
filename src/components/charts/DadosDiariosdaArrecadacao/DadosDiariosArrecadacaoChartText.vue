<template>
  <div>
    <div class="row container-fluid text-center mx-auto" v-if="!loader">
      <div class="col-sm">
        <div class="cardDataDaily">
          <p id="textoArrecadacao">Valor da Arrecadação no Período</p>
          <h1 id="valorArrecadacao">R$ {{ this.format(data.totalCollection) }}</h1>
        </div>
      </div>
      <div class="col-sm">
        <div class="cardDataDaily">
          <p id="textoArrecadacao">Arrecadação Média Diária no Período</p>
          <h1 id="valorArrecadacao">R$ {{ this.format(data.mediaCollection) }}</h1>
        </div>
      </div>

      <div class="col-sm">
        <div class="cardDataDaily">
          <p id="textoArrecadacao">Número de Pagamentos no Período</p>
          <h1 id="valorArrecadacao">{{ this.thousandsSeparator(data.totalPayment) }}</h1>
        </div>
      </div>
      <div class="col-sm">
        <div class="cardDataDaily">
          <p id="textoArrecadacao">Número de Pagamentos Diário Médio no Período</p>
          <h1 id="valorArrecadacao">{{ this.thousandsSeparator(data.mediaTotalPayment) }}</h1>
        </div>
      </div>
      <div class="col-sm">
        <div class="cardDataDaily">
          <p id="textoArrecadacao">Valor Médio de Pagamento no Período</p>
          <h1 id="valorArrecadacao">R$ {{ this.format(data.mediaValuePayment) }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatThousandsNotation, moneyFormat } from '../../../util/util'

export default {
  props: {
    data: {
      type: Object
    },
    loader: {
      type: Boolean
    }
  },

  methods: {
    thousandsSeparator(val) {
      if (val === 0) {
        return 0
      }
      return formatThousandsNotation(val)
    },

    format(val) {
      if (!val) {
        return val
      }
      return moneyFormat(val)
    }
  }
}
</script>

<style scoped>
.h1 {
  font-size: 1.4rem;
}

.graphic {
  margin-top: 20px;
}

#textoArrecadacao {
  font-size: 15px;
  margin-right: 1%;
  margin-top: auto;
  margin-bottom: auto;
  color: #5a5a5a;
  padding-top: 11px;
}

#valorArrecadacao {
  font-size: 20px;
  margin-top: auto;
  margin-bottom: auto;
  color: #232323;
  padding-bottom: 11px;
}

@media (max-width: 480px) {
  #valorArrecadacao {
    font-size: 2.5rem;
  }
}

.cardDataDaily {
  background: #fff;
  border-bottom: 1px solid #d2d2d2;
  border-left: 3px solid #028ffb;
  border-right: 1px solid #d2d2d2;
  border-top: 1px solid #d2d2d2;
  border-radius: 8px;
  margin-bottom: 15px;
}
</style>
