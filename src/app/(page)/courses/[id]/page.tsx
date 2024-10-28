'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Define types
interface Course {
  id: string
  title: string
  description: string
  price: number
  startDate: string
  endDate: string
  categoryId: string
}

interface Lesson {
  id: string
  title: string
  description: string
  content: string
  order: number
  startDate: string
  endDate: string
  courseId: string
}

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isEnrolling, setIsEnrolling] = useState(false)

  useEffect(() => {
    fetchCourseDetails()
    fetchLessons()
  }, [params.id])

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get<Course>(`/api/courses/${params.id}`)
      setCourse(response.data)
    } catch (error) {
      console.error('Failed to fetch course details:', error)
      // Handle error (e.g., show error message)
      toast({
        title: "Error",
        description: "Failed to load group details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchLessons = async () => {
    try {
      const response = await axios.get<Lesson[]>(`/api/courses/${params.id}/lessons`)
      setLessons(response.data)
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
      // Handle error (e.g., show error message)
    }
  }

  const handleEnroll = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setIsEnrolling(true)
    try {
      const response = await axios.post('/api/enrollments', { courseId: params.id })
      if (response.status === 200 || response.status === 201) {
        router.push('/dashboard')
      } else {
        throw new Error('Failed to enroll')
      }
    } catch (error) {
      console.error('Failed to enroll:', error)
      // Handle error (e.g., show error message)
    } finally {
      setIsEnrolling(false)
    }
  }

  if (!course) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          <p className="font-semibold text-2xl mb-4">${course.price.toFixed(2)}</p>
          <Button onClick={handleEnroll} disabled={isEnrolling}>
            {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="border rounded p-4">
                <h3 className="font-semibold">Lesson {index + 1}: {lesson.title}</h3>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}