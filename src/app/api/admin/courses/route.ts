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


import { uploadImage } from '@/lib/cloudinary'; // Import the image upload function

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);
    const thumbnail = formData.get('thumbnail') as Blob | undefined; // Get the thumbnail from the form data

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const category_data = await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });

    let thumbnailUrl = null;
    if (thumbnail) {
      thumbnailUrl = await uploadImage(thumbnail);
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        categoryId: category_data.id,
        thumbnail: thumbnailUrl, // Store the thumbnail URL in the database
        lessons: {
          create: formData
            .getAll('lessons')
            .map((lesson) => ({
              title: lesson.toString(),
              content: lesson.toString(),
            })),
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