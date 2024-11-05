import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const courseId = body.courseId;
    const userId = session.user.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 }
      );
    }
    const amount = Math.round(course.price * 100);
    const currency = "INR";
    
    const shortCourseId = courseId.slice(-8); 
    const timestamp = Date.now().toString().slice(-8); 
    const receipt = `rcpt_${shortCourseId}_${timestamp}`;

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    const result = await prisma.$transaction(async (prisma) => {
      const enrollment = await prisma.enrollment.create({
        data: {
          userId,
          courseId,
        },
      });

      const payment = await prisma.payment.create({
        data: {
          amount: course.price,
          currency,
          status: "PENDING",
          paymentMethod: "RAZORPAY",
          razorpayOrderId: order.id,
          userId,
          courseId,
          enrollmentId: enrollment.id,
        },
      });

      return { enrollment, payment };
    });

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency,
      paymentId: result.payment.id,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to create order",
        details: error.error || error.message || "Unknown error"
      },
      { status: error.statusCode || 500 }
    );
  }
}