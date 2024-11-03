'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Clock, Calendar, BarChart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

interface Course {
  id: string
  title: string
  description: string
  price: number
  instructor: string
  duration: string
  startDate: string
  level: string
  category: {
    name: string
  }
  image: string
}

async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch course')
  }
  return res.json()
}

export default async function CourseDetails({ params }: { params: { id: string } }) {
  let course: Course

  try {
    course = await getCourse(params.id)
  } catch (error) {
    console.error('Failed to fetch course:', error)
    toast({
      title: "Error",
      description: "not been able post",
      variant: "destructive",
    })
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
          <div className="aspect-video relative mb-6">
            <Image 
              src={course.image} 
              alt={course.title} 
              layout="fill" 
              objectFit="cover" 
              className="rounded-lg"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{course.duration}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Start Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Date(course.startDate).toLocaleDateString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Level</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{course.level}</div>
              </CardContent>
            </Card>
          </div>
          <h2 className="text-2xl font-bold mb-4">About the Instructor</h2>
          <p className="text-muted-foreground mb-6">{course.instructor}</p>
        </div>
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold mb-4">${course.price.toFixed(2)}</div>
              <Button className="w-full mb-4" size="lg">
                Buy Now
              </Button>
              <p className="text-sm text-muted-foreground mb-4">
                30-day money-back guarantee
              </p>
              <h3 className="font-semibold mb-2">This course includes:</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ {course.duration} of on-demand video</li>
                <li>✓ Access on mobile and TV</li>
                <li>✓ Certificate of completion</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}