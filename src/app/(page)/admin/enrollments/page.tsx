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
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

import { format } from 'date-fns'
import { toast } from '@/hooks/use-toast'

interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  user: {
    name: string | null
    email: string | null
  }
  course: {
    title: string
  }
}

export default function ViewEnrollments() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.isAdmin) {
      fetchEnrollments()
    }
  }, [status, session, currentPage, itemsPerPage])

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get<{ enrollments: Enrollment[], total: number }>('/api/admin/enrollments', {
        params: { page: currentPage, limit: itemsPerPage, search: searchTerm }
      })
      setEnrollments(response.data.enrollments)
      setTotalItems(response.data.total)
    } catch (error) {
      console.error('Failed to fetch enrollments:', error)
      setError('Failed to load enrollments. Please try again.')
      toast({
        title: "Error",
        description: "Failed to load enrollments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchEnrollments()
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (status === 'loading') {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">View Enrollments</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-slate-900">Search Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              type="text"
              placeholder="Search by user name, email, or course title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Search</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Enrollment List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : enrollments.length === 0 ? (
            <div className="text-center text-slate-600">No enrollments found.</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-900">User</TableHead>
                    <TableHead className="text-slate-900">Course</TableHead>
                    <TableHead className="text-slate-900">Enrolled At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div className="text-slate-900">{enrollment.user.name || 'N/A'}</div>
                        <div className="text-sm text-slate-600">{enrollment.user.email || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="text-slate-900">{enrollment.course.title}</TableCell>
                      <TableCell className="text-slate-900">{format(new Date(enrollment.enrolledAt), 'PPP')}</TableCell>
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
                  <span className="text-sm text-slate-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-slate-900"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="text-slate-900"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}