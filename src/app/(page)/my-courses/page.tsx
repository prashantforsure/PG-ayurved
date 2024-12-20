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

export default function RedesignedMyCourses() {
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-pulse flex space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        <div className="space-y-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-36 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">My Learning Journey</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Continue your learning journey with your enrolled courses
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 text-blue-600">
              <BookOpen className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Courses Yet
            </h2>
            <p className="text-gray-600">
              You haven't enrolled in any courses. Start your learning journey today!
            </p>
            <Button
              onClick={() => router.push('/courses')}
              className="mt-4 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
            >
              Explore Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={course.id} className="group">
                <Card className="h-full bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
                          <Clock className="h-4 w-4 mr-1 text-blue-500" />
                          {course.totalDuration}m
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
                          {course.totalLessons} lessons
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="space-y-2 p-4">
                    <CardTitle className="text-xl font-bold line-clamp-2 text-gray-900">
                      {course.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                  </CardHeader>

                  <CardFooter className="pt-0 p-4">
                    <Button
                      onClick={() => router.push(`/my-courses/${course.id}`)}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                    >
                      View Details
                    </Button>
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