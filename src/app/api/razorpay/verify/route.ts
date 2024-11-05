import { NextRequest, NextResponse } from "next/server";

import  prisma  from "@/lib/prisma";
const crypto = require('crypto');

export async function POST(req: NextRequest) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        await req.json();
  
      // Generate signature for verification
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = require('crypto')
        .createHmac("sha256", process.env.RAZORPAY_SECRET!)
        .update(body.toString())
        .digest("hex");
  
      const isAuthentic = expectedSignature === razorpay_signature;
  
      if (!isAuthentic) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
  
      // Update payment status
      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId: razorpay_order_id },
        include: {
          enrollment: true,
        },
      });
  
      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }
  
      // Generate invoice number
      const invoiceCount = await prisma.invoice.count();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${(
        invoiceCount + 1
      ).toString().padStart(5, "0")}`;
  
      // Update payment and create invoice in a transaction
      const updatedPayment = await prisma.$transaction(async (prisma) => {
        // Update the payment
        const payment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "COMPLETED",
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          },
        });
  
        // Create the invoice
        const invoice = await prisma.invoice.create({
          data: {
            invoiceNumber,
            amount: payment.amount,
            status: "PAID",
            userId: payment.userId,
            paymentId: payment.id,
          },
        });
  
        return { payment, invoice };
      });
  
      return NextResponse.json({
        success: true,
        payment: updatedPayment,
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      return NextResponse.json(
        { error: "Failed to verify payment" },
        { status: 500 }
      );
    }
  }