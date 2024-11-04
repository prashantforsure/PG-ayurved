import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        lessons: true,
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Failed to fetch course:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updatedCourse = await prisma.course.update({
        where: { 
          id: params.id 
        },
        data: {
          title: body.title,
          description: body.description,
          category: {
            connect: {
              name: body.category 
            }
          },
          price: body.price,
          lessons: {
            deleteMany: {},
            create: body.lessons,
          },
        },
        include: {
          lessons: true,
          category: true, 
        },
      })
      
    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error('Failed to update course:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}