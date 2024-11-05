import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
const crypto = require('crypto');

interface RazorpayVerificationBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RazorpayVerificationBody = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(signatureBody.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
      include: {
        enrollment: true,
      },
    });

    if (!existingPayment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(
      invoiceCount + 1
    ).toString().padStart(5, "0")}`;

    const result = await prisma.$transaction(async (tx) => {
     
      const updatedPayment = await tx.payment.update({
        where: { id: existingPayment.id },
        data: {
          status: "COMPLETED",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        include: {
          course: true,
          user: true,
          enrollment: true,
        },
      });

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          amount: existingPayment.amount,
          status: "PAID",
          userId: existingPayment.userId,
          paymentId: existingPayment.id,
        },
      });

      return { payment: updatedPayment, invoice };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}