'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Clock, BookOpen, Users, Star } from 'lucide-react'
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
        <Loader2 className="h-16 w-16 animate-spin text-violet-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
   
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            My Learning Journey
          </h1>
          <p className="mt-2 text-center text-gray-600 max-w-2xl mx-auto">
            Continue your learning journey with your enrolled courses
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 text-violet-600">
              <BookOpen className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Courses Yet
            </h2>
            <p className="text-gray-600">
              You haven't enrolled in any courses. Start your learning journey today!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={course.id} className="group">
                <Card className="h-full bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative aspect-video">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-3 text-white text-sm">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.totalDuration}m
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.totalLessons} lessons
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-xl font-bold line-clamp-2 text-gray-900">
                      {course.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                  </CardHeader>

                  <CardFooter className="pt-0">
                    <div className="w-full space-y-4">
                     
                      <Button
                        onClick={() => router.push(`/my-courses/${course.id}`)}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transition-all duration-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}