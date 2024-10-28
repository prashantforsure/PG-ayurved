'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

// Define types
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
  totalPages: number
}

interface QueryParams {
  search?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  page?: string
}

export default function CourseCatalogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [courses, setCourses] = useState<Course[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    fetchCourses()
  }, [page, search, category, minPrice, maxPrice])

  const fetchCourses = async () => {
    const params: QueryParams = {
      page: page.toString(),
      ...(search && { search }),
      ...(category && { category }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    }

    try {
      const response = await axios.get<CoursesResponse>('/api/courses', { params })
      setCourses(response.data.courses)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      toast({
        title: "Error",
        description: "Failed to load group details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateQueryParams({ search, page: '1' })
  }

  const handleFilter = () => {
    updateQueryParams({ category, minPrice, maxPrice, page: '1' })
  }

  const updateQueryParams = (newParams: QueryParams) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`/courses?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Course Catalog</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 space-y-4">
          <Select value={category} onValueChange={(value: string) => setCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice(e.target.value)}
          />
          <Button onClick={handleFilter} className="w-full">Apply Filters</Button>
        </div>
        <div className="w-full md:w-3/4">
          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <Input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Search</Button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{course.description.substring(0, 100)}...</p>
                  <p className="mt-4 font-semibold">${course.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full">View Course</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            {page > 1 && (
              <Button variant="outline" className="mr-2" onClick={() => updateQueryParams({ page: (page - 1).toString() })}>
                Previous
              </Button>
            )}
            {page < totalPages && (
              <Button variant="outline" onClick={() => updateQueryParams({ page: (page + 1).toString() })}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}