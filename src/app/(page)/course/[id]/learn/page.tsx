'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Loader2, CheckCircle, Circle, PlayCircle, FileText, MessageCircle } from 'lucide-react'


interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz'
  content: string
  duration: number
  completed: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string
  modules: Module[]
  progress: number
}

export default function CourseLearn() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchCourseData()
    }
  }, [status, params.id])

  const fetchCourseData = async () => {
    try {
      const response = await axios.get<Course>(`/api/courses/${params.id}/learn`)
      setCourse(response.data)
      setCurrentLesson(response.data.modules[0].lessons[0])
    } catch (error) {
      console.error('Failed to fetch course data:', error)
      toast.error('Failed to load course data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLessonComplete = async (lessonId: string) => {
    try {
      await axios.post(`/api/courses/${params.id}/lessons/${lessonId}/complete`)
      setCourse(prevCourse => {
        if (!prevCourse) return null
        return {
          ...prevCourse,
          modules: prevCourse.modules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, completed: true } : lesson
            )
          })),
          progress: calculateProgress(prevCourse.modules, lessonId)
        }
      })
      toast.success('Lesson completed!')
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error)
      toast.error('Failed to update lesson progress')
    }
  }

  const calculateProgress = (modules: Module[], completedLessonId: string): number => {
    const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0)
    const completedLessons = modules.reduce((sum, module) => 
      sum + module.lessons.filter(lesson => lesson.completed || lesson.id === completedLessonId).length, 0
    )
    return Math.round((completedLessons / totalLessons) * 100)
  }

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

  if (!course) {
    return <div className="flex justify-center items-center h-screen">Course not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
      <Progress value={course.progress} className="w-full mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{currentLesson?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentLesson?.type === 'video' && (
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <iframe
                    src={currentLesson.content}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              {currentLesson?.type === 'text' && (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }}></div>
              )}
              {currentLesson?.type === 'quiz' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Quiz</h3>
                  {/* Implement quiz component here */}
                </div>
              )}
              <Button 
                className="mt-4" 
                onClick={() => currentLesson && handleLessonComplete(currentLesson.id)}
                disabled={currentLesson?.completed}
              >
                {currentLesson?.completed ? 'Completed' : 'Mark as Complete'}
              </Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Course Description</h3>
                  <p>{course.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes">
              <Card>
                <CardContent className="pt-6">
                  {/* Implement notes component here */}
                  <p>Your notes for this lesson will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="discussion">
              <Card>
                <CardContent className="pt-6">
                  {/* Implement discussion component here */}
                  <p>Discussion forum for this lesson will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module, index) => (
                  <AccordionItem value={`module-${index}`} key={module.id}>
                    <AccordionTrigger>{module.title}</AccordionTrigger>
                    <AccordionContent>
                      {module.lessons.map((lesson) => (
                        <Button
                          key={lesson.id}
                          variant="ghost"
                          className={`w-full justify-start mb-2 ${currentLesson?.id === lesson.id ? 'bg-secondary' : ''}`}
                          onClick={() => setCurrentLesson(lesson)}
                        >
                          {lesson.completed ? (
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="mr-2 h-4 w-4" />
                          )}
                          {lesson.type === 'video' && <PlayCircle className="mr-2 h-4 w-4" />}
                          {lesson.type === 'text' && <FileText className="mr-2 h-4 w-4" />}
                          {lesson.type === 'quiz' && <MessageCircle className="mr-2 h-4 w-4" />}
                          {lesson.title}
                        </Button>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}