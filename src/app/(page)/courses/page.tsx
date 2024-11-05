'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbr from '@/components/Navbr'
import Navbar from '@/components/Navbar'



interface Course {
  id: string
  title: string
  thumbnailUrl: string | null // Updated to allow null
  price: number
  instructor: string
  category: string
}

export default  function CoursesPage() {
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
        thumbnailUrl: course.thumbnail || '/placeholder.jpg', // Use a placeholder if thumbnail is null
        price: course.price,
        instructor: 'John Doe', // Assuming all courses have the same instructor
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }
 
  return (
    <div className="container mx-auto py-10 px-4">
     
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Explore Courses</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Select onValueChange={handleSortChange} value={sortBy}>
          <SelectTrigger className="w-full md:w-[180px] bg-white border-gray-300">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Course Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCourses.map(course => (
          <Card key={course.id} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="p-0">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">No Thumbnail</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <CardTitle className="mb-2 text-xl font-semibold text-gray-900">{course.title}</CardTitle>
              
              <p className="text-sm text-gray-500">{course.category}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
              <span className="text-lg font-bold text-gray-900">${course.price.toFixed(2)}</span>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => handleCourseClick(course.id)}>
                  View Course
                </Button>
                <Button>Buy Now</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}