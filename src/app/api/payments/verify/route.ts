import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import razorpay from '@/lib/razorpay';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = json;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await prisma.payment.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });

      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId: razorpay_order_id },
      });

      if (payment) {
        await prisma.enrollment.create({
          data: {
            userId: payment.userId,
            courseId: payment.courseId,
          },
        });
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to verify payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}