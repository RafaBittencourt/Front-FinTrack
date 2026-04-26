import { useReducer } from 'react'

import { Input } from './ui/input'
import { Label } from './ui/label'

interface ICurrencyProps {
  fieldLabel: string

  disabled?: boolean
  setFieldValue: (value: number) => void
  fieldValue: () => number
}

// Brazilian currency config
const moneyFormatter = Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  currencyDisplay: 'symbol',
  currencySign: 'standard',
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function MoneyInput({
  disabled,
  fieldLabel,
  fieldValue,
  setFieldValue,
}: ICurrencyProps) {
  const initialValue = fieldValue() ? moneyFormatter.format(fieldValue()) : ''
  const [value, setValue] = useReducer((_: unknown, next: string) => {
    const digits = next.replace(/\D/g, '')
    return moneyFormatter.format(Number(digits) / 100)
  }, initialValue)

  function handleChange(formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, '')
    const realValue = Number(digits) / 100
    setFieldValue(realValue)
  }

  return (
    <div>
      <Label>{fieldLabel}</Label>
      <Input
        type="text"
        placeholder="R$0,00"
        disabled={disabled}
        onChange={(ev) => {
          setValue(ev.target.value)
          handleChange(ev.target.value)
        }}
        value={value}
      />
    </div>
  )
}
