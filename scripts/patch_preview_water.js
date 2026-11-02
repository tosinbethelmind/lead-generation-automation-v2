const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'preview', '[lead_id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('WaterFactoryErpDashboard')) {
  // Add dynamic import
  content = content.replace(
    /const ShaderGradientLiquidLogo = dynamic\(\(\) => import\('@\/components\/three\/ShaderGradientLiquidLogo'\), \{ ssr: false \}\);/,
    "const ShaderGradientLiquidLogo = dynamic(() => import('@/components/three/ShaderGradientLiquidLogo'), { ssr: false });\nconst WaterFactoryErpDashboard = dynamic(() => import('@/app/factory/page'), { ssr: false });"
  );

  // Add bypass when leadId matches water/factory
  content = content.replace(
    /const leadId = Array\.isArray\(rawLeadId\) \? rawLeadId\[0\] : \(rawLeadId as string \|\| ''\);/,
    "const leadId = Array.isArray(rawLeadId) ? rawLeadId[0] : (rawLeadId as string || '');\n\n  // Instant high-conversion ERP redirect for Water Factory & Bottling leads\n  if (/water|table-water|pure-water|factory|sachet|bottling/i.test(leadId)) {\n    return <WaterFactoryErpDashboard />;\n  }"
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched PreviewPage for Water Factory ERP!');
} else {
  console.log('Already patched.');
}
