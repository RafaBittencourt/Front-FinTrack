import { Controller } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IInputTextProps } from './interface'

export default function InputText({
  name,
  control,
  label,
  disabled,
  className,
}: IInputTextProps) {
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
            disabled={disabled}
            ref={ref}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            value={value}
          />
        )}
      />
    </div>
  )
}
