import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import  prisma  from "@/lib/prisma";
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

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if user is already enrolled
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

    // Create Razorpay order
    const amount = Math.round(course.price * 100);
    const currency = "INR";
    const options = {
      amount,
      currency,
      receipt: `course_${courseId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    try {
      // First create the enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          userId,
          courseId,
        },
      });

      // Then create the payment with the enrollment ID
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

      return NextResponse.json({
        orderId: order.id,
        amount,
        currency,
        paymentId: payment.id,
      });
    } catch (error) {
      // Clean up enrollment if payment creation fails
      await prisma.enrollment.deleteMany({
        where: {
          userId,
          courseId,
          payment: null,
        },
      });
      throw error;
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}