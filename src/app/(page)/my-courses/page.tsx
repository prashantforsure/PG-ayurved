'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search, BookOpen, Clock } from 'lucide-react'
import { toast } from '@/hooks/use-toast'


interface Course {
  id: string
  title: string
  description: string
  progress: number
  totalLessons: number
  completedLessons: number
  lastAccessedAt: string
}

export default function EnrolledCourses() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('lastAccessed')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchEnrolledCourses()
    }
  }, [status])

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get<Course[]>('/api/student/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error)
      toast({
        title: "Error",
        description: "Failed to fetch enrolled courses:",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAndSortedCourses = courses
    .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'progress') {
        return b.progress - a.progress
      } else {
        return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
      }
    })

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <div className="flex justify-center items-center h-screen">Access Denied</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Courses</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastAccessed">Last Accessed</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCourses.map(course => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress: {course.progress}%</span>
                  <span className="text-sm text-gray-500">
                    {course.completedLessons}/{course.totalLessons} lessons
                  </span>
                </div>
                <Progress value={course.progress} className="w-full mb-4" />
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="mr-2 h-4 w-4" />
                  Last accessed: {new Date(course.lastAccessedAt).toLocaleDateString()}
                </div>
              </div>
              <Button className="w-full" onClick={() => router.push(`/courses/${course.id}`)}>
                <BookOpen className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedCourses.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-xl font-semibold">No courses found</p>
          <p className="text-gray-500">Try adjusting your search or explore new courses</p>
          <Button className="mt-4" onClick={() => router.push('/courses')}>
            Explore Courses
          </Button>
        </div>
      )}
    </div>
  )
}