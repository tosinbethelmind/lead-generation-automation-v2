import { NextRequest, NextResponse } from 'next/server';
import { getLeads } from '@/lib/googleSheets';

export async function GET(req: NextRequest) {
  try {
    const leads = await getLeads();
    const total = leads.length;

    let phoneCount = 0;
    let emailCount = 0;
    let primaryContactable = 0;
    let neitherPhoneNorEmail = 0;
    let neitherWithWebsite = 0;
    let neitherWithSocial = 0;

    let instagramCount = 0;
    let facebookCount = 0;
    let linkedinCount = 0;
    let twitterCount = 0;

    const statusCounts: Record<string, number> = {};

    leads.forEach(lead => {
      const phone = (lead.phone_e164 || lead.phone_raw || '').trim();
      const email = (lead.email || '').trim();
      const website = (lead.website || '').trim();
      const status = lead.status || 'NEW';

      statusCounts[status] = (statusCounts[status] || 0) + 1;

      let socialsParsed: Record<string, string> = {};
      if (lead.social_links) {
        try {
          socialsParsed = typeof lead.social_links === 'string' ? JSON.parse(lead.social_links) : lead.social_links;
        } catch (_) {}
      }
      socialsParsed = socialsParsed || {};

      const hasPhone = !!phone;
      const hasEmail = !!email;
      const hasNeither = !hasPhone && !hasEmail;

      if (hasPhone) phoneCount++;
      if (hasEmail) emailCount++;
      if (hasPhone || hasEmail) primaryContactable++;

      if (socialsParsed.instagram) instagramCount++;
      if (socialsParsed.facebook) facebookCount++;
      if (socialsParsed.linkedin) linkedinCount++;
      if (socialsParsed.twitter || socialsParsed.x) twitterCount++;

      if (hasNeither) {
        neitherPhoneNorEmail++;
        if (website) neitherWithWebsite++;
        const hasSocial = Object.keys(socialsParsed).length > 0;
        if (hasSocial) neitherWithSocial++;
      }
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalLeads: total,
        primaryContactable: {
          count: primaryContactable,
          percentage: total > 0 ? parseFloat(((primaryContactable / total) * 100).toFixed(1)) : 0
        },
        phoneCapture: {
          count: phoneCount,
          percentage: total > 0 ? parseFloat(((phoneCount / total) * 100).toFixed(1)) : 0
        },
        emailCapture: {
          count: emailCount,
          percentage: total > 0 ? parseFloat(((emailCount / total) * 100).toFixed(1)) : 0
        },
        missingPrimaryContact: {
          count: neitherPhoneNorEmail,
          percentage: total > 0 ? parseFloat(((neitherPhoneNorEmail / total) * 100).toFixed(1)) : 0
        },
        alternativeOutreach: {
          websiteContactForm: {
            count: neitherWithWebsite,
            percentage: neitherPhoneNorEmail > 0 ? parseFloat(((neitherWithWebsite / neitherPhoneNorEmail) * 100).toFixed(1)) : 0
          },
          socialMediaDM: {
            count: neitherWithSocial,
            percentage: neitherPhoneNorEmail > 0 ? parseFloat(((neitherWithSocial / neitherPhoneNorEmail) * 100).toFixed(1)) : 0
          }
        },
        socialPresenceAcrossAllLeads: {
          instagram: instagramCount,
          facebook: facebookCount,
          linkedin: linkedinCount,
          twitter: twitterCount
        },
        leadStatusDistribution: statusCounts
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
