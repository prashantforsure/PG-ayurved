'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Clock, User, Check, PlayCircle, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BuyButton } from '@/components/BuyButton'

interface Lesson {
  id: string
  title: string
  content: string
}

interface CourseDetail {
  id: string
  title: string
  description: string
  thumbnailUrl: string | null
  instructor: string
  price: number
  category: string
  lessons: Lesson[]
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCourseDetail()
  }, [])

  const fetchCourseDetail = async () => {
    try {
      const response = await axios.get(`/api/courses/${params.id}`)
      setCourse(response.data)
    } catch (error) {
      console.error('Error fetching course detail:', error)
    }
  }

  if (!course) {
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

  const totalLessons = course.lessons.length
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-white/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative aspect-video">
                {course.thumbnailUrl ? (
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-purple-100 flex items-center justify-center">
                    <BookOpen className="h-20 w-20 text-violet-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                    {course.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {course.title}
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed">{course.description}</p>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center text-gray-600">
                    <User className="mr-2 h-5 w-5 text-violet-500" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="mr-2 h-5 w-5 text-violet-500" />
                    
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="mr-2 h-5 w-5 text-violet-500" />
                    <span>{totalLessons} lessons</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">What you'll learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Master key concepts', 'Build real projects', 'Gain practical skills', 'Industry best practices'].map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Course Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="group">
                      <div 
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-violet-200 transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveLesson(activeLesson === lesson.id ? null : lesson.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                            <PlayCircle className="h-5 w-5 text-violet-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {index + 1}. {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {lesson.content} 
                            </p>
                          </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                          activeLesson === lesson.id ? 'transform rotate-180' : ''
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    ${course.price.toFixed(2)}
                  </span>
                </div>
                <BuyButton courseId={course.id} />
                <div className="mt-6 p-4 bg-violet-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Course includes:</h3>
                  <ul className="space-y-3">
                    
                    <li className="flex items-center text-sm text-gray-600">
                      <BookOpen className="mr-2 h-4 w-4 text-violet-500" />
                      {totalLessons} lessons
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500 mt-6 text-center">
                  Contact for 15-days demo
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}