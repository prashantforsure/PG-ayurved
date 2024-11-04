import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseDetail = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
      include: {
       
        lessons: {
          
          select: {
            id: true,
            title: true,
           
          },
        },
        enrollments: {
          where: {
            userId: session.user.id,
          },
          
        },
      },
    })

    if (!courseDetail) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    
    const formattedCourseDetail = {
      id: courseDetail.id,
      title: courseDetail.title,
      description: courseDetail.description,
      
    
      lessons: courseDetail.lessons,
     
    }

    return NextResponse.json(formattedCourseDetail)
  } catch (error) {
    console.error('Failed to fetch course detail:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}