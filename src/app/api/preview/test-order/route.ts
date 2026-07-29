import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { getPitchDetails } from '@/lib/pitchHelper';
import { getActiveLeadRepository } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, phone, sector } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Missing phone number' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('234')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? '234' + cleanPhone.substring(1)
      : '234' + cleanPhone;

    let businessName = 'Your Business';
    let category = sector || 'general';

    const origin = req.nextUrl?.origin || 'https://apexreach.site';

    const mockLead = {
      lead_id: leadId || `sim-${Date.now()}`,
      name: businessName,
      category,
      phone_e164: formattedPhone,
      phone_raw: formattedPhone,
      phone: formattedPhone,
    };

    if (leadId) {
      try {
        const repo = getActiveLeadRepository();
        const lead = (await repo.getLeadById(leadId)) as any;
        if (lead && lead.name) {
          businessName = lead.name;
          category = lead.category || category;
          mockLead.name = lead.name;
          mockLead.category = lead.category || category;
        }
      } catch (_) {
        // Fallback if lead DB fetch fails
      }
    }

    const pitchDetails = getPitchDetails(mockLead as any, origin, 'ApexReach Team');

    // Formulate realistic simulated customer order message
    const orderRef = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const sampleCustomerName = 'Emeka Oladipo (Lagos)';
    
    let simulatedMessage = `⚡ *LIVE TEST ORDER SIMULATION for ${businessName}*\n`;
    simulatedMessage += `*Ref:* ${orderRef}\n`;
    simulatedMessage += `*Customer:* ${sampleCustomerName}\n`;
    simulatedMessage += `*Channel:* ApexReach WebApp Direct Checkout\n\n`;

    if (category.toLowerCase().includes('solar')) {
      simulatedMessage += `*Request:* 5.5kVA Solar Hybrid BOQ Package\n`;
      simulatedMessage += `*Est. Inverter:* 5.5kVA Hybrid MPPT\n`;
      simulatedMessage += `*Panels:* 6x 550W Tier-1 Mono\n`;
      simulatedMessage += `*Battery:* 5.12kWh Lithium (LiFePO4)\n`;
      simulatedMessage += `*Estimated Amount:* ₦3,850,000\n`;
      simulatedMessage += `*50% Deposit Request:* ₦1,925,000\n\n`;
    } else if (category.toLowerCase().includes('auto') || category.toLowerCase().includes('car')) {
      simulatedMessage += `*Request:* Tokunbo Duties & Clearing Sizer\n`;
      simulatedMessage += `*Vehicle:* 2018 Toyota Camry (VIN Verified)\n`;
      simulatedMessage += `*Customs Duty + Demurrage:* ₦4,250,000\n`;
      simulatedMessage += `*Port:* Tin Can Island Port, Lagos\n\n`;
    } else {
      simulatedMessage += `*Request:* Express Catalog Order & Delivery\n`;
      simulatedMessage += `*Item:* Executive Product Package\n`;
      simulatedMessage += `*Delivery Area:* Victoria Island, Lagos\n`;
      simulatedMessage += `*Total Amount:* ₦185,000\n\n`;
    }

    simulatedMessage += `✅ *Customer Status:* Verified & Ready to pay via Moniepoint DVA!\n`;
    simulatedMessage += `\n*Note:* This is a live simulation to show how leads & orders drop directly to your phone when your webapp is active!`;

    let waSent = false;
    let waError = null;

    try {
      const previewUrl = `${origin}/preview/${mockLead.lead_id}`;
      await sendWhatsAppMessage(mockLead, previewUrl, origin, simulatedMessage);
      waSent = true;
    } catch (err: any) {
      waSent = false;
      waError = err.message || 'WhatsApp service offline';
    }

    return NextResponse.json({
      success: true,
      sentToPhone: formattedPhone,
      waSent,
      waError,
      simulatedPayload: {
        orderRef,
        customerName: sampleCustomerName,
        message: simulatedMessage,
      },
    });
  } catch (error: any) {
    console.error('Error sending test order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to simulate test order' },
      { status: 500 }
    );
  }
}
