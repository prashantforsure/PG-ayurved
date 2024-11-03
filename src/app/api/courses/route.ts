import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prisma from '@/lib/prisma';
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 12
    const search = searchParams.get('search') || ''
  
    const skip = (page - 1) * limit
  
    try {
      const [courses, totalCourses] = await Promise.all([
        prisma.course.findMany({
          where: {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.course.count({
          where: {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        }),
      ])
  
      return NextResponse.json({ courses, totalCourses })
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }

export async function POST( req: NextRequest){
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try{
    const body = await req.json();
    const { title, description, price, startDate, endDate, categoryId } = body;

    const course = await prisma.course.create({
        data: {
            title,
            description,
            price: parseFloat(price),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            categoryId,
        }
    })
    return NextResponse.json(course, { status: 201 });
    }catch(error){
    console.error('Failed to create course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}