'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import axios from 'axios'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import { toast } from '@/hooks/use-toast'
import { Calendar } from '@/components/ui/calender'

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  featuredImage: z.string().optional(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  startDate: z.date(),
  endDate: z.date(),
  enrollmentLimit: z.number().int().min(0, 'Enrollment limit must be 0 or greater'),
  prerequisites: z.array(z.string()),
  certificateOffered: z.boolean(),
  visibility: z.enum(['public', 'private']),
  status: z.enum(['active', 'draft', 'archived']),
  lessons: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Lesson title is required'),
    content: z.string().min(1, 'Lesson content is required'),
    duration: z.number().min(1, 'Duration must be 1 or greater'),
  })),
})

type CourseFormData = z.infer<typeof courseSchema>

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courseData, setCourseData] = useState<CourseFormData | null>(null)
  const [versionHistory, setVersionHistory] = useState([])
  const [courseStats, setCourseStats] = useState({
    enrollmentCount: 0,
    revenue: 0,
    completionRate: 0,
    averageRating: 0,
  })
  const [studentProgress, setStudentProgress] = useState([])
  const router = useRouter()

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  })

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`/api/admin/courses/${params.id}`)
        setCourseData(response.data)
        reset(response.data)
      } catch (error) {
        console.error('Error fetching course data:', error)
        toast({
          title: "Error",
          description: "Failed to fetch course data. Please try again.",
          variant: "destructive",
        })
      }
    }

    const fetchVersionHistory = async () => {
      try {
        const response = await axios.get(`/api/admin/courses/${params.id}/versions`)
        setVersionHistory(response.data)
      } catch (error) {
        console.error('Error fetching version history:', error)
      }
    }

    const fetchCourseStats = async () => {
      try {
        const response = await axios.get(`/api/admin/courses/${params.id}/stats`)
        setCourseStats(response.data)
      } catch (error) {
        console.error('Error fetching course stats:', error)
      }
    }

    const fetchStudentProgress = async () => {
      try {
        const response = await axios.get(`/api/admin/courses/${params.id}/progress`)
        setStudentProgress(response.data)
      } catch (error) {
        console.error('Error fetching student progress:', error)
      }
    }

    fetchCourseData()
    fetchVersionHistory()
    fetchCourseStats()
    fetchStudentProgress()
  }, [params.id, reset])

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true)
    try {
      await axios.put(`/api/admin/courses/${params.id}`, data)
      toast({
        title: "Success",
        description: "Course updated successfully.",
      })
      router.push('/admin/courses')
    } catch (error) {
      console.error('Error updating course:', error)
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (newStatus: 'active' | 'draft' | 'archived') => {
    try {
      await axios.patch(`/api/admin/courses/${params.id}/status`, { status: newStatus })
      toast({
        title: "Success",
        description: `Course status updated to ${newStatus}.`,
      })
      // Refresh course data
      const response = await axios.get(`/api/admin/courses/${params.id}`)
      setCourseData(response.data)
      reset(response.data)
    } catch (error) {
      console.error('Error updating course status:', error)
      toast({
        title: "Error",
        description: "Failed to update course status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateCourse = async () => {
    try {
      const response = await axios.post(`/api/admin/courses/${params.id}/duplicate`)
      toast({
        title: "Success",
        description: "Course duplicated successfully.",
      })
      router.push(`/admin/courses/${response.data.id}/edit`)
    } catch (error) {
      console.error('Error duplicating course:', error)
      toast({
        title: "Error",
        description: "Failed to duplicate course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportCourseData = async () => {
    try {
      const response = await axios.get(`/api/admin/courses/${params.id}/export`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `course_${params.id}_export.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error exporting course data:', error)
      toast({
        title: "Error",
        description: "Failed to export course data. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!courseData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Course: {courseData.title}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions <MoreHorizontal className="ml-2 h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStatusChange('active')}>Set Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('draft')}>Set Draft</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('archived')}>Archive Course</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDuplicateCourse}>Duplicate Course</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCourseData}>Export Course Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit Course</TabsTrigger>
          <TabsTrigger value="stats">Course Statistics</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
          <TabsTrigger value="progress">Student Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input id="title" {...register('title')} className="mt-1" />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />
                    )}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>

            
                <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AIAPGET">AIAPGET (M.D. , M.S.)</SelectItem>
                      <SelectItem value="PSC">Ayurved PSC | UPSC(AMO)</SelectItem>
                      <SelectItem value="Phd">Ayurved Ph.D</SelectItem>
                      <SelectItem value="dams">BAMS</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <Input id="price" type="number" {...register('price', { valueAsNumber: true })} className="mt-1" />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                             
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                           
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
                  </div>
                </div>
              </div>

              

              <div className="space-y-6">
           
               

           

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lessons
                  </label>
              
                  <Textarea placeholder="Edit lesson details here..." className="mt-1" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/courses')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Course
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrollment Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courseStats.enrollmentCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${courseStats.revenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courseStats.completionRate.toFixed(2)}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courseStats.averageRating.toFixed(1)}/5</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versionHistory.map((version: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{version.version}</TableCell>
                  <TableCell>{new Date(version.date).toLocaleString()}</TableCell>
                  <TableCell>{version.changes}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => {/* Restore logic */}}>
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="progress">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Last Lesson</TableHead>
                <TableHead>Time Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentProgress.map((student: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.completionRate}%</TableCell>
                  <TableCell>{student.lastLesson}</TableCell>
                  <TableCell>{student.timeSpent} hours</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}