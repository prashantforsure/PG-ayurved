import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
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
              select: {
                id: true,
                
              },
            },
          },
        },
      },
    })

    const formattedCourses = enrolledCourses.map((enrollment) => {
      const totalLessons = enrollment.course.lessons.length
    
      
      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        thumbnailUrl: enrollment.course.thumbnail,
        totalLessons,
        
        
      }
    })

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error('Error fetching enrolled courses:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}