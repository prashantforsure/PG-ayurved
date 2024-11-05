'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'

interface DashboardData {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalRevenue: number
  recentEnrollments: {
    id: string
    user: { name: string; email: string }
    course: { title: string }
    enrolledAt: string
  }[]
  popularCourses: {
    id: string
    title: string
    enrollments: number
  }[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.isAdmin) {
      fetchDashboardData()
    }
  }, [status, session])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get<DashboardData>('/api/admin/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  if (status === 'loading' || !dashboardData) {
    return  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
  </div>
  }

  if (!session?.user?.isAdmin) {
    return <div className="flex justify-center items-center h-screen">Access Denied</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className='flex justify-between'>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="">
        <Button onClick={() => router.push('/admin/courses/new')}>Create Course</Button>
      </div>
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData.totalCourses}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData.totalEnrollments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${dashboardData.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dashboardData.recentEnrollments.map((enrollment) => (
                <li key={enrollment.id} className="bg-secondary p-3 rounded-lg">
                  <p className="font-semibold">{enrollment.user.name}</p>
                  <p className="text-sm text-muted-foreground">enrolled in {enrollment.course.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(enrollment.enrolledAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Popular Courses</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.popularCourses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => router.push('/admin/courses')}>Manage Courses</Button>
      </div>
    </div>
  )
}