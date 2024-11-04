'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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
  instructor: {
    name: string
    avatarUrl: string
  }
  lessons: Lesson[]
  totalDuration: number
  progress: number
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCourseDetail()
  }, [])

  const fetchCourseDetail = async () => {
    try {
      const response = await axios.get(`/api/my-courses/${params.id}`)
      setCourse(response.data)
    } catch (error) {
      console.error('Error fetching course detail:', error)
    }
  }

  if (!course) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Courses
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-64 object-cover rounded-t-lg" />
            </CardHeader>
            <CardContent>
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center mb-4">
                <User className="mr-2 h-4 w-4" />
                <span className="text-sm text-gray-600">Instructor: {course.instructor.name}</span>
              </div>
              <div className="flex items-center mb-4">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-sm text-gray-600">Total Duration: {course.totalDuration} minutes</span>
              </div>
              <div className="flex items-center mb-4">
                <BookOpen className="mr-2 h-4 w-4" />
                <span className="text-sm text-gray-600">Lessons: {course.lessons.length}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Progress: {course.progress}%</span>
                <Progress value={course.progress} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} className="mb-4">
                  <h3 className="font-semibold">{index + 1}. {lesson.title}</h3>
                  <p className="text-sm text-gray-600">{lesson.duration} minutes</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}