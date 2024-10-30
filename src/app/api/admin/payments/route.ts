import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    let where: any = {}

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { course: { title: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status !== 'all') {
      where.status = status
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
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
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ])

    return NextResponse.json({
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    if (action === 'export') {
      const search = searchParams.get('search') || ''
      const status = searchParams.get('status') || 'all'

      let where: any = {}

      if (search) {
        where.OR = [
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { course: { title: { contains: search, mode: 'insensitive' } } },
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

      const csv = [
        'User Name,User Email,Course Title,Amount,Currency,Status,Payment Method,Date',
        ...payments.map(p => 
          `"${p.user.name}","${p.user.email}","${p.enrollment.course.title}",${p.amount},${p.currency},${p.status},${p.paymentMethod},"${p.createdAt.toISOString()}"`
        )
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=payments_export.csv',
        },
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error exporting payments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}