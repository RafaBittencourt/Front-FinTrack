import { Controller } from 'react-hook-form'

import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { IInputSelect } from './interface'

export function InputSelect({
  name,
  label,
  defaultValue,
  disabled,
  control,
  className,
  selectOptions,
}: IInputSelect) {
  return (
    <>
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field: { name, onChange, value } }) => {
          return (
            <Select
              defaultValue={defaultValue}
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger
                className={className || 'h-10 w-full border-foreground'}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="item-aligned" side="top">
                {selectOptions.map((selectItem, index) => {
                  return (
                    <SelectItem key={index} value={selectItem.value}>
                      {selectItem.display}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }}
      />
    </>
  )
}
