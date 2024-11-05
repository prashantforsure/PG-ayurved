import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'


export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        enrollments: true,
        
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.image,    
      joinedDate: user.createdAt,
      enrolledCourses: user.enrollments.length,
     
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}