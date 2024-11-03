import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { ids } = await request.json()
    await prisma.course.deleteMany({
      where: {
        id: { in: ids },
      },
    })
    return NextResponse.json({ message: 'Courses deleted successfully' })
  } catch (error) {
    console.error('Failed to delete courses:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}