import { Controller } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ICurrencyProps } from './interface'

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function InputCurrency({
  name,
  control,
  label,
  disabled,
  className,
}: ICurrencyProps) {
  const formatCurrency = (value: number) => {
    if (isNaN(value)) return ''
    return moneyFormatter.format(value)
  }

  const parseCurrency = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (!digits) return 0
    return Number(digits) / 100
  }

  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-bold text-slate-700 block mb-2">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <Input
            id={name}
            type="text"
            placeholder="R$ 0,00"
            disabled={disabled}
            ref={ref}
            value={typeof value === 'number' ? formatCurrency(value) : value}
            onChange={(e) => {
              const numericValue = parseCurrency(e.target.value)
              onChange(numericValue)
            }}
          />
        )}
      />
    </div>
  )
}
