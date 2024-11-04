'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Clock, User, Check } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Lesson {
  id: string
  title: string
  duration: number
}

interface CourseDetail {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  instructor: string
  price: number
  category: string
  lessons: Lesson[]
  totalDuration: number
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<CourseDetail | null>(null)
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
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="p-0">
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-64 object-cover" />
            </CardHeader>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-4 text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              <div className="flex flex-wrap items-center mb-6 space-x-6">
                <div className="flex items-center text-gray-600">
                  <User className="mr-2 h-5 w-5" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>{course.totalDuration} minutes</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="mr-2 h-5 w-5" />
                  <span>{course.lessons.length} lessons</span>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">What you'll learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Learn A', 'Master B', 'Understand C', 'Apply D'].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">${course.price.toFixed(2)}</span>
              </div>
              <Button className="w-full mb-4">Enroll Now</Button>
              <p className="text-sm text-gray-500 mb-6">30-Day Money-Back Guarantee</p>
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{index + 1}. {lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.duration} minutes</p>
                    </div>
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}