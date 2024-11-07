'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ColumnDef, 
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDown,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from '@/hooks/use-toast'


interface Course {
  id: string
  title: string
  category: string
  price: number
  enrollmentCount: number
  
}
interface APIResponse {
  courses: Course[]
  totalCourses: number
  totalPages: number
}

const columns: ColumnDef<Course>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div className="capitalize">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "enrollmentCount",
    header: () => <div className="text-right">Enrollments</div>,
    cell: ({ row }) => {
      return <div className="text-right">{row.getValue("enrollmentCount")}</div>
    },
  },

 
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const course = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-[#475569] hover:bg-muted">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white shadow-md rounded-md">
            <DropdownMenuLabel className="text-[#475569] font-medium">Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(course.id)}
              className="hover:bg-muted"
            >
              Copy course ID
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-gray-200" />
            <DropdownMenuItem className="hover:bg-muted">View enrollments</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted">View revenue</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted">Toggle status</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted">Duplicate course</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted">Edit course</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted text-red-600">Delete course</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function CoursesPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Course[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  

  const handleRowClick = (courseId: string) => {
    router.push(`/admin/courses/${courseId}/edit`)
  }
  const fetchCourses = async (page = 1, search = '') => {
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: search
      })

      const response = await fetch(`/api/admin/courses?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      const data: APIResponse = await response.json()
      setData(data.courses)
      setTotalPages(data.totalPages)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  const handlePageChange = (newPage: number) => {
    const searchValue = table.getColumn("title")?.getFilterValue() as string
    fetchCourses(newPage, searchValue)
  }
  useEffect(() => {
    const searchValue = table.getColumn("title")?.getFilterValue() as string
    fetchCourses(1, searchValue)
  }, [table?.getColumn("title")?.getFilterValue()])

  

  const handleBatchDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedIds = selectedRows.map(row => row.original.id) 
    
    if (selectedIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select courses to delete.",
        variant: "destructive",
      })
      return
    }
  
    try {
      const response = await fetch('/api/admin/courses/batch-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete courses')
      }
  
      setRowSelection({})
    
      fetchCourses(currentPage)
  
      toast({
        title: "Success",
        description: `Successfully deleted ${selectedIds.length} course(s).`,
      })
    } catch (error) {
      console.error('Error deleting courses:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete courses. Please try again.",
        variant: "destructive",
      })
    }
  }
  return (
    <div className="container mx-auto py-10 mt-10 bg-[#F6F9FC] text-[#334155]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        <Button onClick={() => router.push('/admin/courses/new')} className="bg-[#0EA5E9] text-white hover:bg-[#0c87c0] focus:ring-[#0EA5E9]">
          <Plus className="mr-2 h-4 w-4" /> Add New Course
        </Button>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter courses..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm focus:ring-[#0EA5E9] focus:border-[#0EA5E9]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-gray-100 hover:bg-gray-200 focus:ring-[#0EA5E9]">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white shadow-md rounded-md">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize hover:bg-muted"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => handleRowClick(row.original.id)}
                className="cursor-pointer hover:bg-muted/50"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleRowClick(row.original.id)
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="bg-gray-100 hover:bg-gray-200 focus:ring-[#0EA5E9]"
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="bg-gray-100 hover:bg-gray-200 focus:ring-[#0EA5E9]"
          >
            Next
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-24 text-muted-foreground">
          Loading...
        </div>
      )}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="destructive" onClick={handleBatchDelete} className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600">
            Delete Selected
          </Button>
         
        </div>
      )}
    </div>
  )
}