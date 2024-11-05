'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, BookOpen, Clock, CheckCircle2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Course {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  totalLessons: number
  totalDuration: number
  progress: number
}

export default function MyCourses() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchCourses()
    }
  }, [status])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<Course[]>('/api/my-courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      toast({
        title: "Error",
        description: "Failed to load your courses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">My Courses</h1>
        {courses.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>You are not enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="flex flex-col bg-white overflow-hidden transition-all duration-300 hover:shadow-lg h-[400px]"
              >
                <div className="relative w-full pt-[56.25%]">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20" />
                </div>
                <CardHeader className="flex-none">
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </CardHeader>
                
                <CardFooter className="flex-none border-t border-gray-100 p-4">
                  <div className="w-full space-y-4">
                  
                    <Button 
                      onClick={() => router.push(`/my-courses/${course.id}`)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    >
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}