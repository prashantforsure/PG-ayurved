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
import { Loader2, ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { format } from 'date-fns'
import { toast } from '@/hooks/use-toast'

interface User {
  id: string
  name: string | null
  email: string | null
  isAdmin: boolean
  createdAt: string
}

export default function ManageUsers() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
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
      fetchUsers()
    }
  }, [status, session, currentPage, itemsPerPage])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get<{ users: User[], total: number }>('/api/admin/users', {
        params: { page: currentPage, limit: itemsPerPage, search: searchTerm }
      })
      setUsers(response.data.users)
      setTotalItems(response.data.total)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to load users. Please try again.')
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return <div className="flex justify-center items-center h-screen text-2xl font-bold text-gray-800">Access Denied</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Manage Users</h1>

      <Card className="mb-8 border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800">Search Users</CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800">User List</CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-600">No users found.</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left text-gray-900 font-semibold">Name</TableHead>
                    <TableHead className="text-left text-gray-900 font-semibold">Email</TableHead>
                    <TableHead className="text-left text-gray-900 font-semibold">Role</TableHead>
                    <TableHead className="text-left text-gray-900 font-semibold">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <TableCell className="text-gray-800 font-medium">{user.name || 'N/A'}</TableCell>
                      <TableCell className="text-gray-600">{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-6">
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
                  <span className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} users
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
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