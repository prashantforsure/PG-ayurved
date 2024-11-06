'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, BookOpen, Clock, CheckCircle2, PlayCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'

interface Lesson {
  id: string
  title: string
  content: string
}

interface CourseDetail {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  totalLessons: number
  totalDuration: number
  progress: number
  lessons: Lesson[]
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchCourseDetail()
    }
  }, [status, params.id])

  const fetchCourseDetail = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<CourseDetail>(`/api/my-courses/${params.id}`)
      setCourse(response.data)
    } catch (error) {
      console.error('Failed to fetch course details:', error)
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="animate-pulse flex space-x-4">
        <div className="h-12 w-12 rounded-full bg-violet-200"></div>
        <div className="space-y-3">
          <div className="h-4 w-24 bg-violet-200 rounded"></div>
          <div className="h-4 w-36 bg-violet-200 rounded"></div>
        </div>
      </div>
    </div>
    )
  }

  if (!course) {
    return <div className="text-center text-gray-600">Course not found.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 overflow-hidden">
          <div className="relative w-full pt-[56.25%]">
            <img 
              src={course.thumbnailUrl} 
              alt={course.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20" />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">{course.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                <span>{course.totalLessons} lessons</span>
              </div>
              
          
            </div>
           
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
        <div className="space-y-4">
          {course.lessons.map((lesson, index) => (
            <Card key={lesson.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="bg-white p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{lesson.title}</CardTitle>
                </div>
                
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-600 text-sm mb-4">{lesson.content}</p>
               
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}