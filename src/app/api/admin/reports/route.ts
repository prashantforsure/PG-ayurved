import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { subDays, startOfDay, endOfDay } from 'date-fns'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = startOfDay(subDays(new Date(), days))
    const endDate = endOfDay(new Date())

    const [
      totalRevenue,
      totalUsers,
      totalCourses,
      totalEnrollments,
      revenueByDay,
      enrollmentsByDay,
      topCourses,
    ] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'successful',
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.payment.groupBy({
        by: ['createdAt'],
        _sum: { amount: true },
        where: {
          status: 'successful',
          createdAt: { gte: startDate, lte: endDate },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.enrollment.groupBy({
        by: ['enrolledAt'],
        _count: true,
        where: {
          enrolledAt: { gte: startDate, lte: endDate },
        },
        orderBy: { enrolledAt: 'asc' },
      }),
      prisma.course.findMany({
        select: {
          id: true,
          title: true,
          _count: { select: { enrollments: true } },
        },
        orderBy: {
          enrollments: { _count: 'desc' },
        },
        take: 5,
      }),
    ])

    const revenueData = revenueByDay.map(day => ({
      date: day.createdAt.toISOString().split('T')[0],
      revenue: day._sum.amount || 0,
    }))

    const enrollmentData = enrollmentsByDay.map(day => ({
      date: day.enrolledAt.toISOString().split('T')[0],
      enrollments: day._count,
    }))

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      totalUsers,
      totalCourses,
      totalEnrollments,
      revenueByDay: revenueData,
      enrollmentsByDay: enrollmentData,
      topCourses: topCourses.map(course => ({
        id: course.id,
        title: course.title,
        enrollments: course._count.enrollments,
      })),
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}