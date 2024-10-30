import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import razorpay from '@/lib/razorpay';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';



export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { courseId } = json;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const options = {
      amount: Math.round(course.price * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `course_${courseId}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = await prisma.payment.create({
      data: {
        amount: course.price,
        currency: "INR",
        status: "PENDING",
        razorpayOrderId: order.id,
        userId: session.user.id,
        courseId: courseId,
      },
    });

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Failed to create payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}