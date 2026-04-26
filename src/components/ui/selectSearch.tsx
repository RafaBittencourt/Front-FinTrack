import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import * as React from 'react'

import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'

// ============================================================================
// Tipos e Interfaces GENÉRICOS
// ============================================================================

interface BaseOption {
  id: string
  [key: string]: any // Permite propriedades dinâmicas
}

interface ApiResponse<T> {
  result: {
    items: T[]
  }
}

interface DynamicSelectProps<T extends BaseOption> {
  apiEndpoint: string
  placeholder?: string
  onValueChange?: (value: string) => void
  value?: string
  defaultValue?: string
  className?: string
  disabled?: boolean
  displayField: keyof T // ✅ Campo dinâmico para exibição
  valueField?: keyof T // ✅ Campo para o valor (padrão: 'id')
}

// ============================================================================
// Componentes Base do Select (mantêm iguais)
// ============================================================================

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>((props, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className="flex cursor-default items-center justify-center py-1"
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>((props, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className="flex cursor-default items-center justify-center py-1"
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
          'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

// ============================================================================
// Hook personalizado GENÉRICO para carregar opções
// ============================================================================

const useFetchOptions = <T extends BaseOption>(apiEndpoint: string) => {
  const [options, setOptions] = React.useState<T[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchOptions = async () => {
      if (!apiEndpoint) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem('token')
        const response = await api.get<ApiResponse<T>>(apiEndpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        const items = response.data?.result?.items
        if (!Array.isArray(items)) {
          throw new Error('Formato de resposta inválido')
        }

        setOptions(items)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar opções'
        setError(errorMessage)
        console.error('Erro ao buscar opções:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [apiEndpoint])

  return { options, loading, error }
}

// ============================================================================
// Componente DynamicSelect GENÉRICO e CORRIGIDO
// ============================================================================

function DynamicSelectInner<T extends BaseOption>(
  {
    apiEndpoint,
    placeholder = 'Selecione uma opção',
    onValueChange,
    value,
    defaultValue,
    className,
    disabled = false,
    displayField,
    valueField = 'id' as keyof T,
  }: DynamicSelectProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { options, loading, error } = useFetchOptions<T>(apiEndpoint)

  // ✅ Busca a opção selecionada usando o valueField
  const selectedOption = React.useMemo(
    () => options.find((option) => String(option[valueField]) === value),
    [options, value, valueField],
  )

  // ✅ Texto a ser exibido no trigger
  const displayText = React.useMemo(() => {
    if (!value || !selectedOption) return placeholder
    return String(selectedOption[displayField])
  }, [value, selectedOption, displayField, placeholder])

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      onValueChange?.(newValue)
    },
    [onValueChange],
  )

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      defaultValue={defaultValue}
      disabled={disabled || loading}
    >
      <SelectTrigger ref={ref} className={cn('border-foreground', className)}>
        <SelectValue placeholder={displayText} />
      </SelectTrigger>

      <SelectContent>
        {loading && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Carregando...
          </div>
        )}

        {error && (
          <div className="px-3 py-2 text-sm text-destructive">{error}</div>
        )}

        {!loading && !error && options.length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Nenhuma opção disponível
          </div>
        )}

        {!loading && !error && options.length > 0 && (
          <SelectGroup>
            {options.map((option, index) => {
              const optionValue = String(option[valueField])
              const optionDisplay = String(option[displayField])

              return (
                <SelectItem key={`${optionValue}-${index}`} value={optionValue}>
                  {optionDisplay}
                </SelectItem>
              )
            })}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  )
}

// ✅ Cast para manter os generics funcionando com forwardRef
const DynamicSelect = React.forwardRef(DynamicSelectInner) as <
  T extends BaseOption,
>(
  props: DynamicSelectProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> },
) => ReturnType<typeof DynamicSelectInner>

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectScrollUpButton,
  SelectScrollDownButton,
  DynamicSelect,
}
