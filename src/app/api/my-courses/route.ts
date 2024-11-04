import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'


export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const enrolledCourses = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: {
          include: {
            lessons: {
             
              take: 1,
            },
          },
        },
      },
    })

    const formattedCourses = enrolledCourses.map(enrollment => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      
      latestLesson: enrollment.course.lessons[0] ? {
        id: enrollment.course.lessons[0].id,
        title: enrollment.course.lessons[0].title,
      } : null,
    }))

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error('Failed to fetch enrolled courses:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}