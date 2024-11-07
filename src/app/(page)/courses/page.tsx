'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Search, BookOpen, Clock, Users, ChevronDown, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Course {
  id: string
  title: string
  thumbnailUrl: string | null
  price: number
  instructor: string
  category: string
}

export default function RedesignedCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses')
      const formattedCourses = response.data.map((course: any) => ({
        id: course.id,
        title: course.title,
        thumbnailUrl: course.thumbnail || '/placeholder.jpg',
        price: course.price,
        instructor: 'John Doe',
        category: course.category.name,
      }))
      setCourses(formattedCourses)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const filteredAndSortedCourses = courses
    .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'price') return a.price - b.price
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50 pt-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
        <div className="my-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Discover Your Next Course</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Explore our collection of expert-led courses to advance your skills
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
            <Select onValueChange={setSortBy} value={sortBy}>
              <SelectTrigger className="w-[180px] bg-gray-100 border-gray-200">
                <SelectValue placeholder="Sort by" />
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Course Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
          {filteredAndSortedCourses.map((course) => (
            <div key={course.id} className="group">
              <Card className="h-full bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative aspect-video">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                      {course.category}
                    </span>
                  </div>
                </div>

                <CardHeader className="space-y-2 p-4">
                  <CardTitle className="text-xl font-bold line-clamp-2 text-gray-900">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100 p-4">
                  <span className="text-lg font-bold text-blue-600">
                    ₹{course.price.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}