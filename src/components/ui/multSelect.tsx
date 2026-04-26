import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

// ============================================================================
// Tipos Genéricos
// ============================================================================

interface BaseOption {
  [key: string]: any
}

interface MultiSelectProps<T extends BaseOption> {
  options: T[]
  onValueChange?: (values: T[]) => void
  value?: T[] // array completo vindo do formulário (com selecionado true/false)
  defaultValues?: T[]
  placeholder?: string
  displayField: keyof T           // ex: "nomeUsuario"
  selectedField: keyof T          // ex: "selecionado" -> true/false
  disabled?: boolean
  className?: string
}

// ============================================================================
// Componente MultiSelect Genérico
// ============================================================================

function MultiSelectInner<T extends BaseOption>(
  {
    options,
    onValueChange,
    value,
    defaultValues = [],
    placeholder = 'Selecione...',
    displayField,
    selectedField,
    disabled = false,
    className,
  }: MultiSelectProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const safeOptions = options ?? []

  // estado interno da lista completa (para quando o componente é não-controlado)
  const [internalOptions, setInternalOptions] = React.useState<T[]>(
    value ?? safeOptions ?? defaultValues,
  )

  // sempre que options ou value mudar externamente, sincroniza
  React.useEffect(() => {
    if (value) {
      setInternalOptions(value)
    } else if (safeOptions) {
      setInternalOptions(safeOptions)
    }
  }, [safeOptions, value])

  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')

  // selecionados são os que têm selectedField === true
  const selectedValues = React.useMemo(
    () => internalOptions.filter((o) => o[selectedField] === true),
    [internalOptions, selectedField],
  )

  const isSelected = React.useCallback(
    (option: T): boolean => option[selectedField] === true,
    [selectedField],
  )

  const toggleOption = React.useCallback(
    (option: T): void => {
      const newOptions = internalOptions.map((item) => {
        if (item === option) {
          return {
            ...item,
            [selectedField]: !Boolean(item[selectedField]),
          }
        }
        return item
      })

      if (value === undefined) {
        setInternalOptions(newOptions)
      }

      // devolve a lista completa, com selecionado true/false atualizado
      onValueChange?.(newOptions)
    },
    [internalOptions, selectedField, onValueChange, value],
  )

  const handleRemoveItem = React.useCallback(
    (option: T, e: React.MouseEvent) => {
      e.stopPropagation()
      const newOptions = internalOptions.map((item) => {
        if (item === option) {
          return {
            ...item,
            [selectedField]: false,
          }
        }
        return item
      })

      if (value === undefined) {
        setInternalOptions(newOptions)
      }

      onValueChange?.(newOptions)
    },
    [internalOptions, selectedField, onValueChange, value],
  )

  const filteredOptions = React.useMemo(() => {
    return internalOptions
      .filter((option) => {
        const displayValue = String(option[displayField]).toLowerCase()
        return displayValue.includes(searchTerm.toLowerCase())
      })
      .sort((a, b) => {
        const aSelected = isSelected(a)
        const bSelected = isSelected(b)

        if (aSelected && !bSelected) return -1
        if (!aSelected && bSelected) return 1

        return String(a[displayField]).localeCompare(String(b[displayField]))
      })
  }, [internalOptions, searchTerm, displayField, isSelected])

  const renderSelectedTags = (): React.ReactNode => {
    if (selectedValues.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>
    }

    const maxVisible = 2
    const visibleItems = selectedValues.slice(0, maxVisible)
    const remainingCount = selectedValues.length - maxVisible

    return (
      <div className="flex flex-wrap gap-1">
        {visibleItems.map((item, index) => (
          <span
            key={`${String(item[displayField])}-${index}`}
            className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
          >
            {String(item[displayField])}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={(e) => handleRemoveItem(item, e)}
            />
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
            +{remainingCount}
          </span>
        )}
      </div>
    )
  }

  return (
    <SelectPrimitive.Root open={open} onOpenChange={setOpen}>
      <SelectTrigger
        ref={ref}
        className={cn('border-foreground', className)}
        disabled={disabled}
      >
        {renderSelectedTags()}
      </SelectTrigger>

      <SelectContent>
        <div className="p-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar..."
            className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        {filteredOptions.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.map((option, index) => {
              const optionDisplay = String(option[displayField])
              const selected = isSelected(option)

              return (
                <SelectItem
                  key={`${optionDisplay}-${index}`}
                  value={optionDisplay}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    selected ? 'bg-accent' : '',
                    'cursor-pointer',
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {selected && <Check className="h-4 w-4" />}
                  </span>
                  {optionDisplay}
                </SelectItem>
              )
            })}
          </div>
        ) : (
          <div className="p-2 text-sm text-muted-foreground">
            Nenhuma opção encontrada
          </div>
        )}
      </SelectContent>
    </SelectPrimitive.Root>
  )
}

const MultiSelect = React.forwardRef(MultiSelectInner) as <
  T extends BaseOption,
>(
  props: MultiSelectProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> },
) => ReturnType<typeof MultiSelectInner>

// ============================================================================
// Componentes Base
// ============================================================================

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    position?: 'popper' | 'item-aligned'
  }
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
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    onClick?: () => void
  }
>(({ className, children, onClick, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
    onMouseDown={(e) => {
      e.preventDefault()
      onClick?.()
    }}
  >
    {children}
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  MultiSelect,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
