import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';


export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { paymentId } = json;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const invoice = await prisma.invoice.create({
      data: {
        userId: payment.userId,
        paymentId: payment.id,
        amount: payment.amount,
        status: payment.status === 'SUCCESS' ? 'PAID' : 'PENDING',
        invoiceNumber: `INV-${Date.now()}`,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Failed to generate invoice:', error);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}