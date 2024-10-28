import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('x-razorpay-signature') as string;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(payload)
    .digest("hex");

  if (expectedSignature === signature) {
    const event = JSON.parse(payload);

    if (event.event === 'payment.captured') {
      const { order_id, id } = event.payload.payment.entity;

      await prisma.payment.updateMany({
        where: { razorpayOrderId: order_id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: id,
        },
      });

      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId: order_id },
      });

      if (payment) {
        await prisma.enrollment.create({
          data: {
            userId: payment.userId,
            courseId: payment.courseId,
          },
        });

        // Generate invoice
        await prisma.invoice.create({
          data: {
            userId: payment.userId,
            paymentId: payment.id,
            amount: payment.amount,
            status: 'PAID',
            invoiceNumber: `INV-${Date.now()}`,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}