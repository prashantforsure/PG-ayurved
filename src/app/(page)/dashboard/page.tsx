'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Loader2, BookOpen, GraduationCap, Clock, Award } from 'lucide-react'

import { format } from 'date-fns'
import { toast } from '@/hooks/use-toast'
import { Calendar } from '@/components/ui/calender'

interface Course {
  id: string
  title: string
  progress: number
  nextLesson: {
    title: string
    date: string
  }
}

interface Assignment {
  id: string
  title: string
  dueDate: string
  course: {
    title: string
  }
}

interface Achievement {
  id: string
  title: string
  description: string
  earnedAt: string
}

interface DashboardData {
  enrolledCourses: Course[]
  upcomingAssignments: Assignment[]
  recentAchievements: Achievement[]
}

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get<DashboardData>('/api/student/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome back, {session.user.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.enrolledCourses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.enrolledCourses.filter(course => course.progress === 100).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{dashboardData?.upcomingAssignments.length}</div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{dashboardData?.recentAchievements?.length}</div> */}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="space-y-4">
          {dashboardData?.enrolledCourses.map(course => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span>Progress: {course.progress}%</span>
                  <span>Next Lesson: {course.nextLesson.title}</span>
                </div>
                <Progress value={course.progress} className="w-full" />
                <Button className="mt-4" onClick={() => router.push(`/courses/${course.id}`)}>
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="assignments" className="space-y-4">
          {dashboardData?.upcomingAssignments.map(assignment => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Course: {assignment.course.title}</p>
                <p>Due Date: {format(new Date(assignment.dueDate), 'PPP')}</p>
                <Button className="mt-4">Start Assignment</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="achievements" className="space-y-4">
          {dashboardData?.recentAchievements.map(achievement => (
            <Card key={achievement.id}>
              <CardHeader>
                <CardTitle>{achievement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{achievement.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Earned on {format(new Date(achievement.earnedAt), 'PPP')}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}