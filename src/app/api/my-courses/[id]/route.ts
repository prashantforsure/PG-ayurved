import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Lesson } from '@prisma/client'

interface FormattedLesson {
  id: string
  title: string
  content: string | null
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
      },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    })

    if (!enrollment || !enrollment.course) {
      return NextResponse.json({ error: 'Course not found or not enrolled' }, { status: 404 })
    }

    const totalLessons = enrollment.course.lessons.length

    const formattedLessons = enrollment.course.lessons.map((lesson: Lesson): FormattedLesson => ({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content, 
    }))

    const courseDetail = {
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      thumbnailUrl: enrollment.course.thumbnail, 
      totalLessons,
      lessons: formattedLessons,
    }

    return NextResponse.json(courseDetail)
  } catch (error) {
    console.error('Error fetching course details:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}