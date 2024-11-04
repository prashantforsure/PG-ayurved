import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface DeleteCoursesRequest {
  ids: string[]
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as DeleteCoursesRequest
    console.log('Received request body:', body)
    
    if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      console.log('Invalid body:', body)
      return NextResponse.json(
        { error: 'Invalid request: ids array is required' },
        { status: 400 }
      )
    }
    if (!body.ids.every((id: string) => typeof id === 'string')) {
      return NextResponse.json(
        { error: 'Invalid request: all IDs must be strings' },
        { status: 400 }
      )
    }

    console.log('Attempting to delete courses with IDs:', body.ids)

    const existingCourses = await prisma.course.findMany({
      where: {
        id: { in: body.ids },
      },
      select: {
        id: true,
        title: true
      },
    })

    console.log('Found courses:', existingCourses)
    
    if (existingCourses.length !== body.ids.length) {
      const foundIds = existingCourses.map(c => c.id)
      const missingIds = body.ids.filter((id: string) => !foundIds.includes(id))
      
      return NextResponse.json(
        {
          error: 'Some courses do not exist',
          found: existingCourses.length,
          requested: body.ids.length,
          foundIds,
          missingIds
        },
        { status: 404 }
      )
    }

    await prisma.$transaction([
      prisma.enrollment.deleteMany({
        where: {
          courseId: { in: body.ids }
        }
      }),
      
      prisma.lesson.deleteMany({
        where: {
          courseId: { in: body.ids }
        }
      }),
      
      prisma.course.deleteMany({
        where: {
          id: { in: body.ids }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Courses deleted successfully',
      deletedIds: body.ids,
    })
  } catch (error) {
    console.error('Failed to delete courses:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}