const fs = require('fs');

let code = fs.readFileSync('src/app/api/admin/mobile-control/route.ts', 'utf8');

const isCRLF = code.includes('\r\n');
const eol = isCRLF ? '\r\n' : '\n';

// 1. Add import of PILLAR_ONE_SERVICES if not present
if (!code.includes('PILLAR_ONE_SERVICES')) {
  const importTarget = `import {${eol}  getPillar2Telemetry,`;
  const importReplacement = `import { PILLAR_ONE_SERVICES, getPillarOneService } from '@/lib/pillarOneCatalog';${eol}import {${eol}  getPillar2Telemetry,`;
  code = code.replace(importTarget, importReplacement);
  console.log('✅ Added PILLAR_ONE_SERVICES import');
}

// 2. Update claim_lead_site handler to support serviceId and updated pricing
const claimBlockRegex = /if \(action === 'claim_lead_site'\) \{[\s\S]*?waLink: `https:\/\/wa\.me\/[\s\S]*?\n\s*\}\);[\s\S]*?\}/;

const newClaimBlock = `if (action === 'claim_lead_site') {
      const { businessName, phone, category, area, serviceId, customUrl } = body;
      if (!businessName) {
        return NextResponse.json({ success: false, error: 'Business name is required' }, { status: 400 });
      }

      const cleanPhone = String(phone || '').replace(/\\D/g, '');
      const slug = toSafeSlug(businessName, cleanPhone.slice(-10) || 'client');

      const leadInfo = {
        businessName: businessName.trim(),
        category: category || 'Commercial Enterprise',
        area: area || 'Lagos',
        phone: cleanPhone,
        slug
      };

      const result = autoProvisionSiteFromWhatsApp(cleanPhone, {
        leadName: leadInfo.businessName,
        category: leadInfo.category,
        area: leadInfo.area,
        slug
      });

      const previewUrl = \`\${APP_ORIGIN}/preview/\${slug}\`;
      const selectedService = getPillarOneService(serviceId || 'website_ai');
      const onboardUrl = \`\${APP_ORIGIN}/onboard?service=\${selectedService.id}&biz=\${encodeURIComponent(leadInfo.businessName)}&phone=\${cleanPhone}\`;
      
      const pitchText = selectedService.whatsappPitchTemplate(leadInfo.businessName, previewUrl);

      return NextResponse.json({
        success: true,
        slug,
        previewUrl,
        onboardUrl,
        liveSiteUrl: \`\${APP_ORIGIN}/sites/\${slug}\`,
        handoverUrl: \`\${APP_ORIGIN}/handover/\${slug}\`,
        pitchText,
        prefilledWhatsAppPitch: pitchText,
        waDirectLink: \`https://wa.me/\${cleanPhone}?text=\${encodeURIComponent(pitchText)}\`,
        waLink: \`https://wa.me/\${cleanPhone}?text=\${encodeURIComponent(pitchText)}\`,
        provisioned: result
      });
    }`;

// Replace claim_lead_site block
const targetStart = "if (action === 'claim_lead_site') {";
const targetEnd = "waDirectLink: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(pitchText)}`,\r\n        waLink: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(pitchText)}`,\r\n        provisioned: result\r\n      });\r\n    }";
const targetEndLF = "waDirectLink: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(pitchText)}`,\n        waLink: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(pitchText)}`,\n        provisioned: result\n      });\n    }";

const idxStart = code.indexOf(targetStart);
let idxEnd = code.indexOf(targetEnd);
let lenEnd = targetEnd.length;

if (idxEnd === -1) {
  idxEnd = code.indexOf(targetEndLF);
  lenEnd = targetEndLF.length;
}

if (idxStart !== -1 && idxEnd !== -1) {
  code = code.substring(0, idxStart) + newClaimBlock + code.substring(idxEnd + lenEnd);
  console.log('✅ Updated claim_lead_site logic with multi-service support');
} else {
  console.log('⚠️ Could not locate claim_lead_site boundaries:', { idxStart, idxEnd });
}

fs.writeFileSync('src/app/api/admin/mobile-control/route.ts', code, 'utf8');
