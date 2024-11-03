import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    const totalEnrollments = await prisma.enrollment.count();
    const totalRevenue = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    });

    const recentEnrollments = await prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    });

    const popularCourses = await prisma.course.findMany({
      take: 5,
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentEnrollments,
      popularCourses,
    });
  } catch (error) {
    console.error('Failed to fetch admin dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch admin dashboard data' }, { status: 500 });
  }
}