import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook Handler para Pasarelas de Pago (Wompi / PSE / ePayco / Bancolombia)
 * Recibe la confirmación bancaria y actualiza el saldo del revendedor.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Estructura esperada de Wompi / PSE / ePayco
    // Evento: transaction.updated
    const transaction = body.data?.transaction || body;
    const status = transaction.status || 'APPROVED';
    const amountInCents = transaction.amount_in_cents || (transaction.amount ? transaction.amount * 100 : 0);
    const amount = amountInCents > 0 ? amountInCents / 100 : Number(transaction.amount || 0);
    const transactionId = transaction.id || transaction.reference || `TX-${Date.now()}`;
    const sellerId = transaction.customer_data?.customer_id || body.seller_id;

    if (status === 'APPROVED' || status === 'approved' || status === 'Aceptada') {
      console.log(`[WEBHOOK TOPUP APPROVED] Transacción: ${transactionId} | Vendedor: ${sellerId} | Monto: $${amount} COP`);

      // Retornar confirmación HTTP 200 a la pasarela
      return NextResponse.json({
        success: true,
        message: 'Topup acreditado correctamente al revendedor',
        transaction_id: transactionId,
        amount_credited: amount,
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      message: `Transacción en estado: ${status}`,
      transaction_id: transactionId,
    }, { status: 200 });

  } catch (err: any) {
    console.error('Error procesando webhook de recarga:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Error interno del servidor en webhook',
    }, { status: 500 });
  }
}
