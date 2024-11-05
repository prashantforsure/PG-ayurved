import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseDetail = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
      include: {
       
        category: {
          select: {
            name: true,
            
          },
        },
        lessons: {
          
          select: {
            id: true,
            title: true,
            content:true
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
      thumbnailUrl: courseDetail.thumbnail,
      price: courseDetail.price,
      category: courseDetail.category.name,
      lessons: courseDetail.lessons,
    };

    return NextResponse.json(formattedCourseDetail)
  } catch (error) {
    console.error('Failed to fetch course detail:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}