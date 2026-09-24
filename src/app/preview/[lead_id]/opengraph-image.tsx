import { ImageResponse } from 'next/og';
import { findBundledLead, sanitizeDisplayName } from '@/lib/leadsBundle';

export const runtime = 'nodejs';
export const alt = 'VIP Commercial Automation Preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ lead_id: string }> }) {
  const { lead_id } = await params;
  const leadId = lead_id || '';

  let lead: any = findBundledLead(leadId);
  let category = lead?.category || 'Commercial Enterprise';
  const rawName = lead?.name || leadId;
  const displayName = sanitizeDisplayName(rawName, category);
  const location = `${lead?.area || lead?.city || 'Lagos'}, Nigeria`;
  const rating = lead?.rating ? Number(lead.rating).toFixed(1) : '4.9';
  const reviewsCount = lead?.reviews_count || 38;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#090d16',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)',
          backgroundSize: '40px 40px',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          border: '14px solid #0284c7',
        }}
      >
        {/* Top Proof Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 24px',
              backgroundColor: '#0369a1',
              borderRadius: '9999px',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '0.05em',
            }}
          >
            <span>👑</span>
            <span>VIP DEMO RESERVED</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '9999px',
              color: '#34d399',
              fontSize: '19px',
              fontWeight: 700,
            }}
          >
            <span>⚡</span>
            <span>24/7 AI WhatsApp Quoter Ready</span>
          </div>
        </div>

        {/* Center Main Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1050px' }}>
          <div style={{ fontSize: '24px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Exclusive Done-For-You Architecture
          </div>
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              margin: 0,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              maxWidth: '1020px',
            }}
          >
            {displayName}
          </h1>
          <p style={{ fontSize: '28px', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            {category} • {location}
          </p>
        </div>

        {/* Bottom Footer Info */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid rgba(51, 65, 85, 0.8)',
            paddingTop: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '26px', color: '#fbbf24', fontWeight: 800 }}>
              ⭐⭐⭐⭐⭐ {rating}/5.0
            </span>
            <span style={{ fontSize: '22px', color: '#64748b' }}>•</span>
            <span style={{ fontSize: '22px', color: '#cbd5e1' }}>
              ({reviewsCount} Verified Customer Inquiries)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px', color: '#e2e8f0', fontWeight: 700 }}>
              Bethelmind Analytics Lagos
            </span>
            <span style={{ fontSize: '20px', color: '#38bdf8' }}>→</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
