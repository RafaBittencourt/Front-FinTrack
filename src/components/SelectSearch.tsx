import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'

import { api } from '@/lib/axios'
import { IResponseRequestError } from '@/lib/interface'

import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface IInputSelect {
  defaultValue?: string
  name: string
  label: string
  className?: string
  disabled?: boolean
  typeRequest: 'once' | 'onUpdate'
  url: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
}

interface ISelectOptions {
  id: string
  nome: string
}

export function InputSelectSearch({
  name,
  label,
  defaultValue,
  disabled,
  control,
  className,
  url,
  typeRequest,
}: IInputSelect) {
  const [selectOptions, setSelectOptions] = useState<ISelectOptions[]>([])

  useEffect(() => {
    async function GetOptions(url: string) {
      try {
        const response = await api.get(`${url}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        setSelectOptions(response.data.result.items)
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'response' in e) {
          const error = e as IResponseRequestError
          return {
            success: error.response.data.success,
            message: error.response.data.error.message,
          }
        } else {
          return {
            success: false,
            message: 'An unexpected error occurred.',
          }
        }
      }
    }
    if (typeRequest === 'once' && selectOptions.length < 1) {
      GetOptions(url)
    }
    if (typeRequest === 'onUpdate') {
      GetOptions(url)
    }
  })

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
                className={className || 'h-10 w-[180px] border-foreground'}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="item-aligned" side="top">
                {selectOptions.map((selectItem, index) => {
                  return (
                    <SelectItem key={index} value={selectItem.id}>
                      {selectItem.nome}
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
