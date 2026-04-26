import { ClipboardList, Search, X } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'

interface IButtonSearchProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleButtonSearchName: (value: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestPromisse: any
  title: string
  filterField: string
  disabled?: boolean
}

export function ButtonSearch({
  handleButtonSearchName,
  requestPromisse,
  title,
  disabled,
  filterField,
}: IButtonSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [pagination, setPagination] = useState(1)
  const [filter, setFilter] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [displayData, setDisplayData] = useState<any>([])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSelectValue(value: any) {
    handleButtonSearchName(value)
  }

  function handleOpenModal() {
    setIsOpen(true)
    handleButtonSearchName('')
  }

  async function GetData() {
    const response = await requestPromisse(pagination)
    setData(response)
    setDisplayData(response.items)
  }

  async function handleFilteredData() {
    if (filter !== '') {
      requestPromisse(pagination, `${filterField}=${filter}`)
    }
  }

  async function handlePagination(i: number) {
    const response = await requestPromisse(i, filter)
    setPagination(i)
    setData(response)
    setDisplayData(response.items)
  }

  return (
    <div>
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger asChild>
          <Button
            className="rounded-l-none"
            onClick={() => {
              GetData()
              handleOpenModal()
            }}
            disabled={disabled}
          >
            <ClipboardList />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="h-[40rem] w-[20rem] p-0">
          <div className="flex h-[35rem] w-full flex-col gap-4">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex h-12 items-center justify-between rounded-lg bg-foreground px-4 text-primary-foreground">
                <p></p>
                <span>{title}</span>
                <X
                  className="h-3 w-3 cursor-pointer self-center"
                  onClick={() => setIsOpen(false)}
                />
              </AlertDialogTitle>
            </AlertDialogHeader>
            <span className="flex p-4">
              <Input
                placeholder="filtro"
                className="rounded-r-none"
                onChange={(e) => setFilter(e.target.value)}
              />
              <Button
                variant="outline"
                className="rounded-l-none border-l-0 border-muted-foreground"
              >
                <Search
                  className="h-3 w-3"
                  onClick={() => handleFilteredData()}
                />
              </Button>
            </span>
            <ul className="flex max-h-[24rem] w-[17.5rem] flex-col items-center gap-2 self-center overflow-auto">
              {displayData &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                displayData.map((lead: any, index: number) => {
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      value="teste"
                      className="h-12 w-full border"
                      onClick={() => {
                        handleSelectValue(lead)
                        setIsOpen(false)
                      }}
                    >
                      {lead.nome ? lead.nome : lead.parceiro}
                    </Button>
                  )
                })}
            </ul>
          </div>
          <AlertDialogFooter className="max-h-[4rem] bg-foreground">
            <Pagination className="bg-foreground p-4 text-muted">
              <PaginationContent>
                {pagination > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePagination(pagination - 1)}
                    />
                  </PaginationItem>
                )}
                {Math.ceil(data.totalCount / 10) > 1 ? (
                  <>
                    {pagination - 1 > 0 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePagination(pagination - 1)}
                        >
                          {pagination - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink isActive>{pagination}</PaginationLink>
                    </PaginationItem>
                    {pagination + 1 <= data.totalPages && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePagination(pagination + 1)}
                        >
                          {pagination + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </>
                ) : (
                  <PaginationItem>
                    <PaginationLink isActive>1</PaginationLink>
                  </PaginationItem>
                )}
                {pagination < data.totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePagination(pagination + 1)}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
