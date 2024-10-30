import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { format } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    let where: any = {}

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { enrollment: { course: { title: { contains: search, mode: 'insensitive' } } } },
      ]
    }

    if (status !== 'all') {
      where.status = status
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        enrollment: {
          include: {
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const csvHeader = 'User Name,User Email,Course Title,Amount,Currency,Status,Payment Method,Date\n'
    const csvRows = payments.map(payment => 
      `"${payment.user.name}","${payment.user.email}","${payment.enrollment.course.title}",${payment.amount},${payment.currency},${payment.status},${payment.paymentMethod},"${format(payment.createdAt, 'yyyy-MM-dd HH:mm:ss')}"`
    ).join('\n')

    const csvContent = csvHeader + csvRows

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=payments_export_${format(new Date(), 'yyyy-MM-dd')}.csv`,
      },
    })
  } catch (error) {
    console.error('Error exporting payments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}