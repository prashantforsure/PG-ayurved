import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  

  const skip = (page - 1) * limit

  try {
    const [courses, totalCourses] = await Promise.all([
      prisma.course.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            },
            category ? { category: { name: category } } : {},
            
            
          ],
        },
        include: {
          category: {
            select: { name: true },
          },
          _count: {
            select: { enrollments: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({
        where: {
          AND: [
            {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            },
            category ? { category: { name: category } } : {},
            
          ],
        },
      }),
    ])

    const formattedCourses = courses.map(course => ({
      ...course,
      category: course.category.name,
      enrollmentCount: course._count.enrollments,
    }))

    return NextResponse.json({
      courses: formattedCourses,
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
    })
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.description || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const category = await prisma.category.upsert({
      where: { name: body.category },
      update: {},
      create: { name: body.category },
    });

    const course = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        categoryId: category.id,
        lessons: {
          create: body.lessons?.map((lesson: any) => ({
            title: lesson.title,
            content: lesson.content,
          
          })) || [],
        },
      },
      include: {
        category: true,
        lessons: true,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}