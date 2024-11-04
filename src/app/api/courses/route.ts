import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        thumbnail: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail: course.thumbnail,
      category: course.category.name,
    }))

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}