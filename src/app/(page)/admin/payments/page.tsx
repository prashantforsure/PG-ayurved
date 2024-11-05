'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ChevronLeft, ChevronRight, Download } from 'lucide-react'

import { format } from 'date-fns'
import { toast } from '@/hooks/use-toast'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  createdAt: string
  user: {
    name: string
    email: string
  }
  course: {
    title: string
  }
}

export default function ViewPayments() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.isAdmin) {
      fetchPayments()
    }
  }, [status, session, currentPage, itemsPerPage, statusFilter])

  const fetchPayments = async () => {
    try {
      const response = await axios.get<{ payments: Payment[], total: number }>('/api/admin/payments', {
        params: { page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }
      })
      setPayments(response.data.payments)
      setTotalItems(response.data.total)
    } catch (error) {
      console.error('Failed to fetch payments:', error)
      
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchPayments()
  }

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/admin/payments/export', {
        responseType: 'blob',
        params: { search: searchTerm, status: statusFilter }
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'payments_export.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to export payments:', error)
      toast({
        title: "Error",
        description: "Failed to export payments",
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return <div className="flex justify-center items-center h-screen">Access Denied</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <h1 className="text-4xl font-bold mb-8">View Payments</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search and Filter Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search by user name, email, or course title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="successful">Successful</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
          </form>
          <Button onClick={handleExport} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Export Payments
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>{payment.user.name}</div>
                    <div className="text-sm text-gray-500">{payment.user.email}</div>
                  </TableCell>
                  <TableCell>{payment.course.title}</TableCell>
                  <TableCell>{payment.amount} {payment.currency}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'successful' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(payment.createdAt), 'PPP')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev +   1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}