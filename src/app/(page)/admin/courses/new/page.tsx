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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { toast } from '@/hooks/use-toast'

import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'


const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  thumbnail: z.any().optional(), // Add the thumbnail field
  lessons: z.array(z.object({
    title: z.string().min(1, 'Lesson title is required'),
    content: z.string().min(1, 'Lesson content is required'),
  })),
});
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
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('price', data.price.toString());
      formData.append('thumbnail', data.thumbnail[0]); // Add the thumbnail to the form data
      data.lessons.forEach((lesson) => {
        formData.append('lessons', lesson.title);
      });
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        body: formData,
      });
  
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
    <div className="container mx-auto py-10 mt-12 bg-[#F6F9FC] text-[#334155]">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#475569]">
                    Title
                  </label>
                  <Input id="title" {...register('title')} className="mt-1" />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-[#475569]">
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
                  <label htmlFor="category" className="block text-sm font-medium text-[#475569]">
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
                          <SelectItem value="study material">Study Material</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-[#475569]">
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
  <label htmlFor="thumbnail" className="block text-sm font-medium text-[#475569]">
    Thumbnail
  </label>
  <input
  type="file"
  id="thumbnail"
  {...register('thumbnail', { required: 'Thumbnail is required' })}
  className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-0 focus:border-[#0EA5E9]"
/>
{errors.thumbnail && <p className="mt-1 text-sm text-red-600">Thumbnail is required</p>}
</div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-[#475569]">
                      Lessons
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ title: '', content: ''})}
                      className="bg-[#0EA5E9] text-white hover:bg-[#0c87c0] focus:ring-[#0EA5E9]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </div>
                  
                  {fields.map((field, index) => (
                    <Card key={field.id} className="mb-4 shadow-md">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Input
                              placeholder="Lesson title"
                              {...register(`lessons.${index}.title`)}
                              className="focus:ring-[#0EA5E9] focus:border-[#0EA5E9]"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="ml-2 text-[#475569] hover:text-red-600"
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
              <Button type="button" variant="outline" onClick={() => router.push('/admin/courses')} className="bg-gray-100 hover:bg-gray-200 focus:ring-[#0EA5E9]">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#0EA5E9] text-white hover:bg-[#0c87c0] focus:ring-[#0EA5E9]">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}