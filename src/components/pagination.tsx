import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export interface IPropsPagePaginationComponent {
  totalCount: number
  totalPages: number
  pageNumber: number
}

interface IRegisterModuloProps {
  handlePagination: (value: number) => void
  handleMaxResultCount: (maxResultCount: string) => void
  propsPagination: IPropsPagePaginationComponent
}

export function PaginationComponent({
  handlePagination,
  handleMaxResultCount,
  propsPagination,
}: IRegisterModuloProps) {
  const hasPrevious = propsPagination.pageNumber > 1
  const hasNext = propsPagination.pageNumber < propsPagination.totalPages
  const showPagination = Math.ceil(propsPagination.totalCount / 10) > 1

  return (
    <Pagination className="p-2 text-slate-100 bg-[#061a12] border-t border-emerald-900/20">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="text-[10px] font-medium text-emerald-500/80 uppercase tracking-widest leading-normal">
          <div>
            <span>Total de registros: {propsPagination.totalCount}</span>
          </div>
          <div>
            <span>Total de páginas: {propsPagination.totalPages}</span>
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <PaginationContent className="gap-1">
            {propsPagination.pageNumber > 2 && (
              <PaginationItem>
                <PaginationFirst className="hover:bg-emerald-500/20 hover:text-emerald-400" onClick={() => handlePagination(1)} />
              </PaginationItem>
            )}
            {hasPrevious && (
              <PaginationItem>
                <PaginationPrevious
                  className="hover:bg-emerald-500/20 hover:text-emerald-400"
                  onClick={() =>
                    handlePagination(propsPagination.pageNumber - 1)
                  }
                />
              </PaginationItem>
            )}

            {showPagination ? (
              <>
                {hasPrevious && (
                  <PaginationItem>
                    <PaginationLink
                      className="hover:bg-emerald-500/10 hover:text-emerald-400 border-none"
                      onClick={() =>
                        handlePagination(propsPagination.pageNumber - 1)
                      }
                    >
                      {propsPagination.pageNumber - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink isActive className="bg-emerald-600 border-none hover:bg-emerald-500 text-white shadow-sm">
                    {propsPagination.pageNumber}
                  </PaginationLink>
                </PaginationItem>

                {hasNext && (
                  <PaginationItem>
                    <PaginationLink
                      className="hover:bg-emerald-500/10 hover:text-emerald-400 border-none"
                      onClick={() =>
                        handlePagination(propsPagination.pageNumber + 1)
                      }
                    >
                      {propsPagination.pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
              </>
            ) : (
              <PaginationItem>
                <PaginationLink isActive className="bg-emerald-600 border-none text-white">
                  {propsPagination.pageNumber}
                </PaginationLink>
              </PaginationItem>
            )}

            {hasNext && (
              <PaginationItem>
                <PaginationNext
                  className="hover:bg-emerald-500/20 hover:text-emerald-400"
                  onClick={() =>
                    handlePagination(propsPagination.pageNumber + 1)
                  }
                />
              </PaginationItem>
            )}
            {propsPagination.totalPages > 2 && (
              <PaginationItem>
                <PaginationLast className="hover:bg-emerald-500/20 hover:text-emerald-400" onClick={() => handlePagination(propsPagination.totalPages)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-500/50 uppercase hidden sm:inline">Exibir</span>
          <Select
            defaultValue="20"
            onValueChange={(value: string) => handleMaxResultCount(value)}
          >
            <SelectTrigger className="w-[70px] bg-emerald-950/50 border-emerald-900/30 text-emerald-100 hover:bg-emerald-900/50 transition-colors h-8 text-xs font-bold rounded-lg px-2">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="w-[70px] bg-slate-900 border-emerald-900/50 text-emerald-100">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Pagination>
  )
}
