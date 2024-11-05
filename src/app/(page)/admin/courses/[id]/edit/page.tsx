'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { Loader2, Plus, Trash } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"


import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import { toast } from '@/hooks/use-toast'

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  lessons: z.array(z.object({
    title: z.string().min(1, 'Lesson title is required'),
    content: z.string().min(1, 'Lesson content is required'),
  })).min(1, 'At least one lesson is required'),
})

type CourseFormData = z.infer<typeof courseSchema>

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const { register, control, handleSubmit, formState: { errors }, setValue, reset } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      lessons: [{ title: '', content: ''}],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessons"
  })

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`/api/admin/courses/${params.id}`)
        const courseData = response.data
        reset(courseData)
      } catch (error) {
        console.error('Error fetching course data:', error)
        toast({
          title: "Error",
          description: "Failed to fetch course data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchCourseData()
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

  return (
    <div className="container mx-auto py-10 mt-12">
      <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
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
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Lessons
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ title: '', content: ''})}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <Card key={field.id} className="mb-4">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Input
                          placeholder="Lesson title"
                          {...register(`lessons.${index}.title`)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="ml-2"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Controller
                        name={`lessons.${index}.content`}
                        control={control}
                        render={({ field }) => (
                          <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {errors.lessons && <p className="mt-1 text-sm text-red-600">Please add at least one lesson</p>}
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
    </div>
  )
}