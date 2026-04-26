import { Filter, Search } from 'lucide-react'
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

import { ContasFilterValues } from './interface'

interface IFilterFormProps {
  reloadTable: (pagination?: number) => Promise<void>
  setFilterData: React.Dispatch<React.SetStateAction<ContasFilterValues>>
}

export function FilterForm({
  reloadTable,
  setFilterData,
}: IFilterFormProps) {
  const { register, control, getValues } = useForm<ContasFilterValues>({
    defaultValues: {
      isActive: true,
      pageNumber: 1,
      maxResultCount: 10
    },
  })

  function onSubmit() {
    setFilterData(getValues())
    reloadTable(1)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden md:inline">Filtros</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white border-emerald-100 shadow-xl">
        <SheetHeader className="border-b border-emerald-50 pb-4">
          <SheetTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Search className="text-emerald-600" size={18} />
            Filtrar Contas
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            Busque por contas específicas em seu sistema.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-slate-700">Nome da Conta</Label>
            <Input
              className="h-10 border-slate-200 focus:border-emerald-500"
              placeholder="Ex: Sicredi..."
              id="name"
              {...register('name')}
            />
          </div>
          <div className="space-y-2">
            <InputSelect
              label="Status"
              name="isActive"
              control={control}
              className="h-10"
              selectOptions={[
                { value: 'true', display: 'Ativas' },
                { value: 'false', display: 'Inativas' },
              ]}
            />
          </div>
        </div>
        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-slate-50 border-t border-slate-100">
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={() => onSubmit()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 rounded-xl shadow-md"
            >
              Aplicar Filtros
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
