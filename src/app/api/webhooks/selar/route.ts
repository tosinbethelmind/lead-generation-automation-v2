import { NextRequest, NextResponse } from 'next/server';
import { verifySelarSignature } from '@/lib/commerce/paymentOrchestrator';
import {
  upsertCustomer,
  createOrder,
  hasProcessedWebhookEvent,
  recordTransaction,
  updateOrder,
  recordFulfilmentException,
} from '@/lib/commerce/ledger';
import { sendSmsMessage } from '@/lib/sms';

const PRODUCT_FILE_MAP: Record<string, { filename: string; title: string; priceNgn: number }> = {
  'solar-buster': {
    filename: 'PRODUCT_1_SOLAR_TARIFF_BUSTER_MASTER_PACK.md',
    title: 'The 2026 Solar Load Sizer & Anti-Fake Buying Kit',
    priceNgn: 10000,
  },
  'land-dossier': {
    filename: 'PRODUCT_2_LEKKI_LAND_RISK_AND_DEMOLITION_DOSSIER.md',
    title: 'Lekki-Epe Land Risk & Coastal Highway Demolition Dossier',
    priceNgn: 25000,
  },
  'diaspora-audit': {
    filename: 'PRODUCT_3_DIASPORA_SITE_INSPECTION_AND_VIDEO_AUDIT_PASS.md',
    title: 'Diaspora Lagos Site Inspection & 4K Video Audit Pass',
    priceNgn: 220000,
  },
  'whatsapp-closer': {
    filename: 'PRODUCT_4_WHATSAPP_AI_SALES_CLOSER_AND_SCRIPTS_KIT.md',
    title: 'The 2026 WhatsApp Sales Closer & Auto-Responder Kit',
    priceNgn: 15000,
  },
  'sme-legal': {
    filename: 'PRODUCT_5_NIGERIAN_SME_LEGAL_SCUML_AND_CONTRACT_VAULT.md',
    title: 'Nigerian Startup & SME Legal, SCUML & Contract Vault',
    priceNgn: 12500,
  },
  'luxury-health': {
    filename: 'PRODUCT_6_LAGOS_AESTHETICS_AND_DENTAL_GUIDE.md',
    title: 'Lagos Luxury Aesthetics & Dental Procedure Transparency Guide',
    priceNgn: 8000,
  },
  'china-1688': {
    filename: 'PRODUCT_7_CHINA_1688_DIRECT_SOURCING_BLUEPRINT.md',
    title: 'China 1688 & Guangzhou Direct Factory Sourcing Blueprint',
    priceNgn: 15000,
  },
  'shortlet-os': {
    filename: 'PRODUCT_8_LEKKI_SHORTLET_CASHFLOW_OPERATING_OS.md',
    title: 'Lekki & Ikeja Shortlet Operating OS & Agreement Vault',
    priceNgn: 20000,
  },
  'remote-usd': {
    filename: 'PRODUCT_9_REMOTE_TECH_USD_BANKING_TAX_GUIDE.md',
    title: 'Remote Tech & Freelancer Multi-Currency Banking Vault',
    priceNgn: 12500,
  },
  'relocation-pof': {
    filename: 'PRODUCT_10_RELOCATION_PROOF_OF_FUNDS_DEFENSE_VAULT.md',
    title: 'UK, Canada & US Relocation Proof of Funds Defense Vault',
    priceNgn: 25000,
  },
  'auto-customs': {
    filename: 'PRODUCT_11_AUTO_IMPORT_CUSTOMS_VIN_VERIFIER.md',
    title: 'Nigerian Auto Import & Customs Duty VIN Verifier',
    priceNgn: 18000,
  },
  'agro-export': {
    filename: 'PRODUCT_12_NON_OIL_AGRO_COMMODITY_EXPORT_DOSSIER.md',
    title: 'Non-Oil Agro-Commodity Export Master Dossier',
    priceNgn: 30000,
  },
  'logistics-fleet': {
    filename: 'PRODUCT_13_COMMERCIAL_LOGISTICS_DISPATCH_FLEET_OS.md',
    title: 'Commercial Logistics & Dispatch Rider Fleet Operating OS',
    priceNgn: 15000,
  },
  'fmcg-placement': {
    filename: 'PRODUCT_14_FMCG_SUPERMARKET_RETAIL_PLACEMENT_BLACKBOOK.md',
    title: 'Nigerian Supermarket & FMCG Retail Placement Blackbook',
    priceNgn: 15000,
  },
  'building-boq': {
    filename: 'PRODUCT_15_LAGOS_CONSTRUCTION_MATERIAL_BOQ_SIZER.md',
    title: 'Lagos Construction Material Price Index & Structural BOQ Sizer',
    priceNgn: 20000,
  },
  'b2b-proposal': {
    filename: 'PRODUCT_16_B2B_CORPORATE_PROPOSAL_TENDER_VAULT.md',
    title: 'Corporate & Government Nigeria B2B Proposal & Tender Vault',
    priceNgn: 25000,
  },
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sigCheck = verifySelarSignature(rawBody, req.headers);
    if (!sigCheck.valid) {
      return NextResponse.json({ error: sigCheck.reason || 'Unauthorized Selar webhook' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const customerName = payload.customer_name || payload.customer?.name || payload.name || 'Valued Customer';
    const customerEmail = payload.customer_email || payload.customer?.email || payload.email || '';
    const customerPhone = payload.customer_phone || payload.customer?.phone || payload.phone || '';
    const amountPaid = Number(payload.amount_paid || payload.amount || 0);
    const currency = String(payload.currency || 'NGN').toUpperCase();
    const orderRef = String(payload.order_id || payload.reference || `SELAR-${Date.now()}`);
    const productTitle = String(payload.product_title || payload.product?.name || payload.product_name || 'Digital Asset Pack');
    const rawProductId = String(payload.product_id || payload.item_id || payload.item || '');

    const webhookEventId = `selar-${orderRef}`;
    if (await hasProcessedWebhookEvent(webhookEventId)) {
      return NextResponse.json({ success: true, alreadyProcessed: true, orderRef });
    }

    let matchedProductId = 'solar-buster';
    if (rawProductId && PRODUCT_FILE_MAP[rawProductId]) {
      matchedProductId = rawProductId;
    } else {
      const lowerTitle = productTitle.toLowerCase();
      for (const [key, val] of Object.entries(PRODUCT_FILE_MAP)) {
        if (lowerTitle.includes(key.replace('-', ' ')) || lowerTitle.includes(val.title.toLowerCase().slice(0, 12))) {
          matchedProductId = key;
          break;
        }
      }
    }

    const productMeta = PRODUCT_FILE_MAP[matchedProductId];
    const customer = await upsertCustomer({
      name: customerName,
      email: customerEmail,
      whatsappNumber: customerPhone,
    });

    const order = await createOrder({
      orderReference: orderRef,
      customerId: customer.id,
      division: 'digital_asset',
      packageName: productMeta.title,
      totalAmountNgn: productMeta.priceNgn,
      depositAmountNgn: productMeta.priceNgn,
      balanceAmountNgn: 0,
      amountPaidNgn: amountPaid,
      currency,
      paymentStage: 'full',
      paymentStatus: amountPaid >= productMeta.priceNgn ? 'paid' : 'failed',
      fulfilmentStatus: amountPaid >= productMeta.priceNgn ? 'completed' : 'exception',
      paymentProvider: 'selar',
      transactionReference: orderRef,
      metadata: { matchedProductId },
    });

    await recordTransaction({
      orderId: order.id,
      provider: 'selar',
      providerReference: orderRef,
      expectedAmountNgn: productMeta.priceNgn,
      verifiedAmountNgn: amountPaid,
      currency,
      verificationStatus: amountPaid >= productMeta.priceNgn ? 'verified' : 'amount_mismatch',
      webhookEventId,
      rawPayload: payload,
      verifiedAt: new Date().toISOString(),
    });

    if (amountPaid < productMeta.priceNgn) {
      await recordFulfilmentException({
        orderId: order.id,
        workflowType: 'digital_product',
        errorMessage: `Selar amount mismatch: expected ₦${productMeta.priceNgn}, received ₦${amountPaid}`,
      });
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
    }

    const host = req.headers.get('host') || 'www.bethelmindanalytics.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const downloadUrl = `${protocol}://${host}/api/store/download/${matchedProductId}?ref=${encodeURIComponent(orderRef)}`;

    if (customerPhone) {
      try {
        await sendSmsMessage(
          customerPhone,
          `Bethelmind: Payment confirmed for ${productMeta.title}. Download link: ${downloadUrl}`
        );
      } catch {}
    }

    await updateOrder(order.id, { fulfilmentStatus: 'completed' });

    return NextResponse.json({
      success: true,
      orderReference: orderRef,
      downloadUrl,
    });
  } catch (err: any) {
    console.error('[Selar Webhook Error]:', err);
    return NextResponse.json({ error: err.message || 'Selar webhook failed' }, { status: 500 });
  }
}
