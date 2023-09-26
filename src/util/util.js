const kFormatter = (num) => {
  const symbols = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'K' },
    { value: 1E6, symbol: 'M' },
    { value: 1E9, symbol: 'G' },
    { value: 1E12, symbol: 'T' },
    { value: 1E15, symbol: 'P' },
    { value: 1E18, symbol: 'E' }
  ]

  let position = 0

  for (position = symbols.length - 1; position > 0; position -= 1) {
    if (num >= symbols[position].value) {
      break
    }
  }

  return (num / symbols[position].value).toFixed(1).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + symbols[position].symbol
}

const formatThousandsNotation = (value) => {
  if (value) {
    if (value > 999) {
      const stringValue = value.toString()
      let r = ''
      let x = 0

      for (let i = stringValue.length; i > 0; i -= 1) {
        r += stringValue.substr(i - 1, 1) + (x === 2 && i !== 1 ? '.' : '')
        x = x === 2 ? 0 : x + 1
      }

      return r.split('').reverse().join('')
    }
    return value.toString().replace('.', ',')
  }
  return ''
}

const moneyFormat = (money) => {
  let value = money.toString().replace(/,/g, '')
  const negativeSign = value < 0 ? '-' : ''

  const i = parseInt(value = Math.abs(Number(value) || 0).toFixed(2), 10).toString()
  let valueFormatted = i
  let j = (i.length > 3) ? i.length % 3 : 0
  while (i.length > j) {
    if (j !== 0) {
      valueFormatted = `${valueFormatted.substring(0, j)}.${valueFormatted.substring(j, i.length + 1)}`
      j += 4
    } else {
      j += 3
    }
  }
  if (value.includes('.')) {
    valueFormatted = negativeSign + valueFormatted + (2 ? `,${Math.abs(value - i).toFixed(2).slice(2)}` : '')
  } else {
    valueFormatted = `${negativeSign + valueFormatted},00`
  }

  return valueFormatted
}

export {
  kFormatter,
  formatThousandsNotation,
  moneyFormat
}
