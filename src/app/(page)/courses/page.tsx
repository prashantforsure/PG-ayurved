'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Course {
  id: string
  title: string
  description: string
  price: number
  category: {
    name: string
  }
}

interface CoursesResponse {
  courses: Course[]
  totalCourses: number
}

async function getCourses(page = 1, search = '', limit = 12): Promise<CoursesResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses?page=${page}&search=${search}&limit=${limit}`)
  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  return res.json()
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
        <p className="text-sm text-muted-foreground mt-2">Category: {course.category.name}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm font-semibold">${course.price.toFixed(2)}</span>
        <Link href={`/courses/${course.id}`}>
          <Button variant="outline">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function CourseSkeleton() {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-1/3" />
      </CardFooter>
    </Card>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default async function CourseCatalog({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const limit = 12

  let courses: Course[] = []
  let totalCourses = 0

  try {
    const result = await getCourses(page, search, limit)
    courses = result.courses
    totalCourses = result.totalCourses
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    // You might want to add error handling here, such as displaying an error message
  }

  const totalPages = Math.ceil(totalCourses / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Course Catalog</h1>
      <div className="mb-8">
        <form className="flex gap-4">
          <Input
            type="search"
            placeholder="Search courses..."
            name="search"
            defaultValue={search}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Suspense>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          const searchParams = new URLSearchParams({
            page: newPage.toString(),
            ...(search && { search }),
          })
          window.location.search = searchParams.toString()
        }}
      />
    </div>
  )
}