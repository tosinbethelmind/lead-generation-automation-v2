import { NextRequest, NextResponse } from 'next/server';
import {
  calculateCommissionSplits,
  generateEvidenceHash,
  generateDoc1RetainershipText,
  generateDoc2CoBrokerageText,
  generateDoc3JIMText,
  generateDoc4DiasporaMandateText,
  generateSection84Certificate,
  DocumentMetadata
} from '@/lib/pillar2/statutoryDocumentGenerator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealId = searchParams.get('dealId') || 'DEAL-LEKKI1-750M';
    const docType = searchParams.get('docType') || 'master';
    const brokerName = searchParams.get('broker') || 'Orange Island Development Company';
    const priceParam = searchParams.get('price');
    const priceNgn = priceParam ? parseInt(priceParam, 10) : 750000000;

    const splits = calculateCommissionSplits(priceNgn);

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '102.89.44.12';
    const userAgent = req.headers.get('user-agent') || 'Mozilla/5.0 (Bethelmind Sec84 Client)';
    const timestamp = new Date().toISOString();

    const meta: DocumentMetadata = {
      dealId,
      propertyTitle: searchParams.get('title') || 'Contemporary 5-Bedroom Fully-Detached Smart Residence',
      propertyLocation: searchParams.get('location') || 'Off Admiralty Way, Lekki Phase 1, Lagos',
      askingPriceNgn: priceNgn,
      askingPriceFormatted: `₦ ${priceNgn.toLocaleString()}`,
      agencyCommissionPoolNgn: splits.totalPool,
      brokerCutNgn: splits.brokerCut,
      bethelmindCutNgn: splits.bethelmindCut,
      lawyerCutNgn: splits.lawyerCut,
      brokerName,
      brokerPhone: searchParams.get('phone') || '08038774238',
      brokerEmail: searchParams.get('email') || 'mandates@orangeislandng.com',
      buyerName: searchParams.get('buyer') || 'Dr. Ademola Adeyemi & Family (Dallas, TX / Lagos)',
      buyerPhone: searchParams.get('buyerPhone') || '08022791227',
      lawyerChambersName: searchParams.get('chambers') || '[APPOINTED LEGAL CHAMBERS]',
      lawyerLeadCounsel: searchParams.get('counsel') || '[LEAD COUNSEL]',
      lawyerScn: searchParams.get('scn') || '[SCN NUMBER]',
      clientIp,
      userAgent,
      timestamp
    };

    const doc1 = generateDoc1RetainershipText(meta);
    const doc2 = generateDoc2CoBrokerageText(meta);
    const doc3 = generateDoc3JIMText(meta);
    const doc4 = generateDoc4DiasporaMandateText(meta);

    const fullPackText = `${doc1}\n\n=========================================\n\n${doc2}\n\n=========================================\n\n${doc3}\n\n=========================================\n\n${doc4}`;
    const evidenceHash = generateEvidenceHash(fullPackText, meta);
    const certificate = generateSection84Certificate(evidenceHash, meta);

    // If json format is requested
    if (searchParams.get('format') === 'json') {
      return NextResponse.json({
        success: true,
        metadata: meta,
        splits,
        evidenceHash,
        documents: {
          doc1Retainership: doc1,
          doc2CoBrokerage: doc2,
          doc3JointInspectionMemorandum: doc3,
          doc4DiasporaMandate: doc4,
          section84Certificate: certificate
        }
      });
    }

    // Default: Printable Master HTML view
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Statutory Legal Pack - ${meta.dealId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #0f172a; padding: 24px; max-width: 800px; margin: 0 auto; background: #fff; }
    h1 { font-size: 16pt; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 16px; }
    h2 { font-size: 12pt; color: #b45309; margin-top: 24px; border-left: 4px solid #b45309; padding-left: 8px; }
    pre { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px; font-size: 9pt; white-space: pre-wrap; word-break: break-word; }
    .badge { display: inline-block; background: #0f172a; color: #fbbf24; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 8pt; }
    .hash-box { background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #b45309; padding: 10px 14px; border-radius: 4px; margin: 16px 0; font-family: monospace; font-size: 8.5pt; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div>
      <div class="badge">CAC BN: 9912717 &bull; Evidence Act Sec 84</div>
      <h1 style="margin: 8px 0 4px 0;">BETHELMIND DIGITAL SOLUTIONS</h1>
      <div style="font-size: 9pt; color: #64748b;">Moniepoint MFB: 6805375225 &bull; Ref: ${meta.dealId} &bull; ${meta.askingPriceFormatted}</div>
    </div>
    <button onclick="window.print()" style="background: #0f172a; color: #fbbf24; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer;">🖨️ Print / Save PDF</button>
  </div>

  <div class="hash-box">
    <strong>🔒 Cryptographic SHA-256 Hash:</strong><br>${evidenceHash}<br>
    <span style="font-size: 7.5pt; color: #64748b;">Timestamp: ${timestamp} &bull; Client IP: ${clientIp}</span>
  </div>

  <h2>Document 1: Master Legal Retainership Agreement</h2>
  <pre>${doc1}</pre>

  <h2>Document 2: Master Co-Brokerage & 80/20 Commission Sharing Agreement</h2>
  <pre>${doc2}</pre>

  <h2>Document 3: Statutory Joint Inspection Memorandum (JIM)</h2>
  <pre>${doc3}</pre>

  <h2>Document 4: Diaspora Buyer Retention Mandate</h2>
  <pre>${doc4}</pre>

  <h2>Section 84 Evidence Act Certificate of Authenticity</h2>
  <pre>${certificate}</pre>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
