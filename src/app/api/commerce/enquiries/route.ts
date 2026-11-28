import { NextRequest, NextResponse } from 'next/server';
import { resolveAdminRequest } from '@/lib/commerce/adminAuth';
import {
  listEnquiries,
  updateEnquiryStatus,
  type LeadPipelineStatus,
} from '@/lib/commerce/enquiries';

import { recordAnalyticsEvent } from '@/lib/commerce/salesAnalytics';

const VALID_STATUSES = new Set<LeadPipelineStatus>([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL SENT',
  'QUOTE SENT',
  'AWAITING PAYMENT',
  'PAID',
  'IN PROGRESS',
  'COMPLETED',
  'WON',
  'LOST',
]);

export async function GET(req: NextRequest) {
  const admin = await resolveAdminRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const enquiries = await listEnquiries();
  const format = req.nextUrl.searchParams.get('format');

  if (format === 'csv') {
    const header = 'ID,Name,Business,WhatsApp,Email,Service,Package,Budget,PreferredContact,Status,Source,Campaign,CreatedAt\n';
    const rows = enquiries
      .map((e) =>
        [
          e.id,
          `"${(e.name || '').replace(/"/g, '""')}"`,
          `"${(e.businessName || '').replace(/"/g, '""')}"`,
          e.whatsapp,
          e.email || '',
          `"${(e.selectedService || '').replace(/"/g, '""')}"`,
          `"${(e.selectedPackage || '').replace(/"/g, '""')}"`,
          `"${(e.estimatedBudget || '').replace(/"/g, '""')}"`,
          e.preferredContactMethod || 'WhatsApp',
          e.status,
          e.utmSource || e.source || '',
          e.utmCampaign || '',
          e.createdAt,
        ].join(',')
      )
      .join('\n');

    return new NextResponse(header + rows, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="bethelmind_enquiries.csv"',
      },
    });
  }

  return NextResponse.json({ success: true, enquiries });
}

export async function PATCH(req: NextRequest) {
  const admin = await resolveAdminRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { id, status, followUpNotes } = body;

  if (!id || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ success: false, error: 'Valid id and status are required' }, { status: 400 });
  }

  const updated = await updateEnquiryStatus(id, status, followUpNotes);
  if (!updated) {
    return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
  }

  if (status === 'QUALIFIED') {
    recordAnalyticsEvent({
      eventName: 'qualified_lead',
      businessDivision: 'business_solutions',
      utmSource: updated.utmSource || updated.source || 'direct',
      utmCampaign: updated.utmCampaign || 'untagged',
      abVariant: 'control',
      valueNgn: Number(updated.agreedPriceNgn || 0),
    });
  }

  return NextResponse.json({ success: true, enquiry: updated });
}
