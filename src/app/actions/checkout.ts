'use server';

import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { CartItem } from '@/lib/types';

export interface CheckoutResult {
  success: boolean;
  message?: string;
  error?: string;
  total_spent?: number;
  remaining_balance?: number;
  sales?: any[];
}

/**
 * Server Action para Checkout Atómico con Bloqueo de Concurrencia (Row-level locking)
 */
export async function processCartCheckoutAction(
  items: CartItem[],
  sellerId: string
): Promise<CheckoutResult> {
  try {
    if (!items || items.length === 0) {
      return { success: false, error: 'El carrito está vacío' };
    }

    if (!sellerId) {
      return { success: false, error: 'Identificador de revendedor requerido' };
    }

    const payload = items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    // Si Supabase Cloud está configurado, invocar la función RPC atómica
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('purchase_cart', {
        p_items: payload,
        p_seller_id: sellerId,
      });

      if (error) {
        console.error('[RPC purchase_cart error]:', error);
        return { success: false, error: error.message };
      }

      if (data && !data.success) {
        return { success: false, error: data.error || 'Falla en la transacción de compra' };
      }

      return {
        success: true,
        message: 'Compra procesada exitosamente en base de datos',
        total_spent: data.total_spent,
        remaining_balance: data.remaining_balance,
        sales: data.sales,
      };
    }

    // Modo Standalone / Demo fallback
    return {
      success: true,
      message: 'Compra procesada con éxito (Modo Demo Store)',
    };
  } catch (err: any) {
    console.error('Error en Server Action processCartCheckoutAction:', err);
    return {
      success: false,
      error: err.message || 'Error inesperado procesando la compra',
    };
  }
}
