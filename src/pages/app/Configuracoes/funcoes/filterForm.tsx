import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { InputSelect } from '@/components/InputSelect/InputSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { FuncoesFilterValues } from './interface'

interface IFilterForm {
  reloadFuncoesTable: (pagination?: number) => Promise<void>
  setFilterData: React.Dispatch<React.SetStateAction<FuncoesFilterValues>>
}

export function FilterForm({ reloadFuncoesTable, setFilterData }: IFilterForm) {
  const { register, control, getValues } = useForm<FuncoesFilterValues>({
    defaultValues: {
      isActive: 'todos',
    },
  })

  function onSubmit() {
    setFilterData(getValues())
    reloadFuncoesTable(1)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtro</SheetTitle>
          <SheetDescription>
            Informe os parametros desejados para realizar um filtro.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="descricao">Descrção</Label>
            <Input
              className="h-10"
              placeholder="Descrição"
              id="descricao"
              {...register('descricao')}
            />
          </div>
          <div>
            <InputSelect
              label="Status"
              name="isActive"
              control={control}
              className="h-10"
              selectOptions={[
                {
                  value: 'todos',
                  display: 'Todos',
                },
                {
                  value: 'true',
                  display: 'Ativo',
                },
                {
                  value: 'false',
                  display: 'Inativo',
                },
              ]}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={() => onSubmit()}>
              Buscar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
