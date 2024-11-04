'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"


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
  lessons: z.array(z.object({
    title: z.string().min(1, 'Lesson title is required'),
    content: z.string().min(1, 'Lesson content is required'),
    duration: z.number().min(1, 'Duration must be 1 or greater'),
  })),
})

type CourseFormData = z.infer<typeof courseSchema>

export default function CreateCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop' | 'student'>('desktop')
  const router = useRouter()

  const { register, control, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      visibility: 'private',
      certificateOffered: false,
      lessons: [{ title: '', content: '', duration: 0 }],
    },
  })

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create course')
      }

      toast({
        title: "Success",
        description: "Course created successfully.",
      })
      router.push('/admin/courses')
    } catch (error) {
      console.error('Error creating course:', error)
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
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
              {/* <Select onValueChange={(value) => register('category').onChange(value)}> */}
              <Select 
                onValueChange={(value) => {
                register('category').onChange({
                target: { value, name: 'visibility' },
                type: 'change'
                 });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
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
              <label htmlFor="enrollmentLimit" className="block text-sm font-medium text-gray-700">
                Enrollment Limit
              </label>
              <Input id="enrollmentLimit" type="number" {...register('enrollmentLimit', { valueAsNumber: true })} className="mt-1" />
              {errors.enrollmentLimit && <p className="mt-1 text-sm text-red-600">{errors.enrollmentLimit.message}</p>}
            </div>

           

            <div className="flex items-center space-x-2">
              <Switch id="certificateOffered" {...register('certificateOffered')} />
              <label htmlFor="certificateOffered" className="text-sm font-medium text-gray-700">
                Certificate Offered
              </label>
            </div>

            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                Visibility
              </label>
              {/* <Select onValueChange={(value) => register('visibility').onChange(value)}> */}
              <Select 
                onValueChange={(value) => {
                register('visibility').onChange({
                target: { value, name: 'visibility' },
                type: 'change'
                 });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lessons
              </label>
              
              <Textarea placeholder="Add lesson details here..." className="mt-1" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as 'mobile' | 'desktop' | 'student')}>
            <TabsList>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="desktop">Desktop</TabsTrigger>
              <TabsTrigger value="student">Student View</TabsTrigger>
            </TabsList>
            <TabsContent value="mobile">
              <Card>
                <CardContent className="p-4">
                  <div className="w-[375px] h-[667px] border border-gray-200 rounded-lg overflow-hidden mx-auto">
               
                    <p className="p-4">Mobile Preview</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="desktop">
              <Card>
                <CardContent className="p-4">
                  <div className="w-full aspect-video border border-gray-200 rounded-lg overflow-hidden">
              
                    <p className="p-4">Desktop Preview</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="student">
              <Card>
                <CardContent className="p-4">
                  <div className="w-full aspect-video border border-gray-200 rounded-lg overflow-hidden">
                 
                    <p className="p-4">Student View Preview</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/courses')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Course
          </Button>
        </div>
      </form>
    </div>
  )
}