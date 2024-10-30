import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { Prisma } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const enrolledCourses = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const totalSpent = await prisma.payment.aggregate({
      where: { userId: session.user.id },
      _sum: {
        amount: true,
      },
    });

    const lessonWhereInput: Prisma.LessonWhereInput = {
      course: {
        enrollments: {
          some: { userId: session.user.id },
        },
      },
      startDate: {
        gte: new Date(),
      },
    };

    const lessonOrderBy: Prisma.LessonOrderByWithRelationInput = {
      startDate: 'asc',
    };

    const upcomingLessons = await prisma.lesson.findMany({
      where: lessonWhereInput,
      take: 5,
      orderBy: lessonOrderBy,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      enrolledCourses,
      totalSpent: totalSpent._sum.amount || 0,
      upcomingLessons,
    });
  } catch (error) {
    console.error('Failed to fetch student dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student dashboard data' },
      { status: 500 }
    );
  }
}