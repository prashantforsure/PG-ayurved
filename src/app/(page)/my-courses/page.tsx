'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Course {
  id: string
  title: string
  thumbnailUrl: string
  latestLesson: {
    id: string
    title: string
  }
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/my-courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const filteredAndSortedCourses = courses
    .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title))

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handleCourseClick = (courseId: string) => {
    router.push(`/my-courses/${courseId}`)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Select onValueChange={handleSortChange} value={sortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Course Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCourses.map(course => (
          <Card key={course.id} className="flex flex-col cursor-pointer" onClick={() => handleCourseClick(course.id)}>
            <CardHeader>
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-48 object-cover rounded-t-lg" />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardTitle className="mb-2">{course.title}</CardTitle>
              <p className="text-sm text-gray-600">Latest lesson: {course.latestLesson.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}