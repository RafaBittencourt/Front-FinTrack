import { Controller } from 'react-hook-form'

import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

interface InputCheckbox {
  defaultValue?: boolean
  name: string
  label: string
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
}

export function InputCheckbox(props: InputCheckbox) {
  return (
    <>
      <div className="flex self-end">
        <Controller
          name={props.name}
          control={props.control}
          render={({ field: { name, onChange, value, disabled } }) => {
            return (
              <Checkbox
                id={name}
                checked={value}
                disabled={disabled}
                onCheckedChange={onChange}
              />
            )
          }}
        />
        <Label className="pl-1">{props.label}</Label>
      </div>
    </>
  )
}
