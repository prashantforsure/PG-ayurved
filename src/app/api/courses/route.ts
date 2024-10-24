import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest){
  try{
    const getCourses = await prisma.course.findMany({
        include: {
            category: true,
          },
    })
    if(!getCourses){
        return NextResponse.json({
            message: "no courses found"
        })
    }
    return NextResponse.json(getCourses)
   }catch(error){
    console.log(error);
    return NextResponse.json({
        error: 'Failed to fetch courses'
    }, {
        status: 500
    })
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