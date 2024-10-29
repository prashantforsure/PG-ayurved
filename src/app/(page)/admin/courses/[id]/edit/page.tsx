'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'


interface CourseData {
  id: string
  title: string
  description: string
  price: number
  categoryId: string
  startDate: string
  endDate: string
}

interface Category {
  id: string
  name: string
}

export default function EditCourse() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.isAdmin) {
      fetchCourseData()
      fetchCategories()
    }
  }, [status, session])

  const fetchCourseData = async () => {
    try {
      const response = await axios.get<CourseData>(`/api/admin/courses/${params.id}`)
      setCourseData(response.data)
    } catch (error) {
      console.error('Failed to fetch course data:', error)
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>('/api/admin/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast({
        title: "Error",
        description: "Failed to load categories details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseData(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setCourseData(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== 'authenticated' || !session.user.isAdmin || !courseData) {
        toast({
            title: "Error",
            description: "You must be logged in as an admin to edit a course.",
            variant: "destructive",
          })
      
      return
    }

    setIsSubmitting(true)
    try {
      await axios.put(`/api/admin/courses/${courseData.id}`, courseData)
      toast({
        title: "Error",
        description: "Course updated successfully",
      })
     
      router.push('/admin/courses')
    } catch (error) {
      console.error('Failed to update course:', error)
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      })
     
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return <div className="flex justify-center items-center h-screen">Access Denied</div>
  }

  if (!courseData) {
    return <div className="flex justify-center items-center h-screen">Course not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Course</h1>
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={courseData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select
                name="categoryId"
                value={courseData.categoryId}
                onValueChange={(value) => handleSelectChange('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={courseData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={courseData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Course'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}