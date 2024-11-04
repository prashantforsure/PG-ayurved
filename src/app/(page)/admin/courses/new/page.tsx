'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Calendar as CalendarIcon, Loader2, Plus, Trash } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Card, CardContent } from "@/components/ui/card"

import { toast } from '@/hooks/use-toast'

import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'


const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  
  lessons: z.array(z.object({
    title: z.string().min(1, 'Lesson title is required'),
    content: z.string().min(1, 'Lesson content is required'),
 
  })),
})

type CourseFormData = z.infer<typeof courseSchema>

export default function CreateCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<CourseFormData>({
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
  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true)
    
   
  
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create course')
      }
  
      const result = await response.json()
      toast({
        title: "Success",
        description: "Course created successfully.",
      })
      router.push('/admin/courses')
    } catch (error) {
      console.error('Error creating course:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create course. Please try again.",
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
            Create Course
          </Button>
        </div>
      </form>
    </div>
  )
}