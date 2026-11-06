import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById, createOrGetCommercialInvoice } from '@/lib/monetization/bankableCommercialInvoice';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invoice_id: string }> }
) {
  try {
    const { invoice_id } = await params;
    let invoice = getInvoiceById(invoice_id);

    if (!invoice) {
      const isLogistics = invoice_id.toUpperCase().includes('LOGI') || invoice_id.toUpperCase().includes('DISP');
      const isEstate = invoice_id.toUpperCase().includes('ESTA') || invoice_id.toUpperCase().includes('RENT');
      const isApp = invoice_id.toUpperCase().includes('APP');
      const isSolar = invoice_id.toUpperCase().includes('SOLA');

      const pkgType = isLogistics ? 'LOGISTICS_WAYBILL_PORTAL' :
                      isEstate ? 'ESTATE_SERVICE_CHARGE_PORTAL' :
                      isApp ? 'ANDROID_APP_CONVERSION' :
                      isSolar ? 'SOLAR_BOQ_ENGINE' : 'SME_TURNKEY_WEBSITE';

      invoice = createOrGetCommercialInvoice({
        clientName: isLogistics ? 'Interstate Logistics Client' :
                    isEstate ? 'Estate Management Client' :
                    isSolar ? 'Solar Energy Client' : 'Commercial Client',
        clientPhone: '2348022791227',
        packageType: pkgType
      });
    }

    return NextResponse.json({ success: true, invoice });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
