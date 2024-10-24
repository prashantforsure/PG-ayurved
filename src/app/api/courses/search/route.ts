import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const courses = await prisma.course.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          category ? { category: { name: category } } : {},
          { price: { gte: minPrice, lte: maxPrice } },
        ],
      },
      include: {
        category: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalCount = await prisma.course.count({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          category ? { category: { name: category } } : {},
          { price: { gte: minPrice, lte: maxPrice } },
        ],
      },
    });

    return NextResponse.json({
      courses,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Failed to search courses:', error);
    return NextResponse.json({ error: 'Failed to search courses' }, { status: 500 });
  }
}