import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig } from '@/lib/localConfig';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, email, name, theme, copy } = body;

    if (!leadId || !email || !name) {
      return NextResponse.json({ error: 'Missing required fields: leadId, email, or name' }, { status: 400 });
    }

    const config = getRuntimeConfig();
    const secretKey = config.paystackSecretKey;
    const feeNGN = config.claimFeeNGN || 0;

    if (!secretKey) {
      return NextResponse.json({ error: 'Paystack Secret Key is not configured on the server.' }, { status: 500 });
    }

    if (feeNGN <= 0) {
      return NextResponse.json({ error: 'Setup Claim Fee is set to 0 or not configured. Payment not required.' }, { status: 400 });
    }

    const origin = new URL(req.url).origin;
    const callbackUrl = `${origin}/preview/${leadId}`;

    // Paystack expects amount in kobo (NGN * 100)
    const amountInKobo = Math.round(feeNGN * 100);

    const paystackPayload = {
      email,
      amount: amountInKobo,
      callback_url: callbackUrl,
      metadata: {
        leadId,
        clientName: name,
        clientEmail: email,
        theme,
        copy,
        custom_fields: [
          { display_name: 'Lead ID', variable_name: 'lead_id', value: leadId },
          { display_name: 'Client Name', variable_name: 'client_name', value: name },
          { display_name: 'Client Email', variable_name: 'client_email', value: email }
        ]
      }
    };

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paystackPayload)
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json({ error: data.message || 'Paystack initialization failed' }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference
    });

  } catch (err: any) {
    console.error('Paystack initialization error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
