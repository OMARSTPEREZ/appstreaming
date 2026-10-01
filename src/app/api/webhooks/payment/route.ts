import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET || 'wompi_events_secret_demo';

/**
 * Webhook y Conciliación en Tiempo Real para Pagos QR / Pasarela (Wompi / PSE / Bold)
 * POST /api/webhooks/payment
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // 1. Extraer datos de la transacción
    const event = body.event;
    const transaction = body.data?.transaction || body.transaction || body;
    const reference = transaction.reference || body.reference;
    const status = transaction.status || body.status || 'APPROVED';
    const amountInCents = transaction.amount_in_cents || (transaction.amount ? Number(transaction.amount) * 100 : 0);
    const amount = amountInCents > 0 ? amountInCents / 100 : Number(transaction.amount || 0);
    const transactionId = transaction.id || `TX-${Date.now()}`;
    const gateway = transaction.payment_method_type || body.gateway || 'wompi';

    console.log(`[PAYMENT WEBHOOK] Ref: ${reference} | Status: ${status} | Monto: $${amount} COP`);

    if (!reference) {
      return NextResponse.json({ success: false, error: 'Falta referencia única de pago' }, { status: 400 });
    }

    // 2. Si la transacción está aprobada, conciliar y acreditar en Supabase
    if (status === 'APPROVED' || status === 'approved' || status === 'Aceptada') {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.rpc('process_webhook_approval', {
          p_reference: reference,
          p_gateway: gateway.toLowerCase(),
          p_transaction_id: transactionId,
          p_amount: amount > 0 ? amount : null,
        });

        if (error) {
          console.error('[Supabase process_webhook_approval Error]:', error);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Pago conciliado y saldo acreditado con éxito en Supabase',
          data,
        }, { status: 200 });
      }

      // Standalone mode response
      return NextResponse.json({
        success: true,
        message: 'Pago aprobado y saldo acreditado (Modo Standalone / Demo)',
        reference,
        amount,
        status: 'approved',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      message: `Transacción registrada en estado: ${status}`,
      reference,
    }, { status: 200 });

  } catch (err: any) {
    console.error('Error en /api/webhooks/payment:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Error procesando webhook de pago',
    }, { status: 500 });
  }
}
