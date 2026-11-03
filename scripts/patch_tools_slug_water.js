const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'app', 'tools', '[slug]', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('WaterFactoryErpDashboard')) {
  content = content.replace(
    /import IntegrationBlueprintDashboard from ['"]@\/components\/IntegrationBlueprintDashboard['"];/,
    "import IntegrationBlueprintDashboard from '@/components/IntegrationBlueprintDashboard';\nimport WaterFactoryErpDashboard from '@/app/factory/page';"
  );
  content = content.replace(
    /if \(cleanSlug === ['"]integrations['"]\) \{\s*return <IntegrationBlueprintDashboard \/>;\s*\}/,
    `if (cleanSlug === 'integrations') {\n    return <IntegrationBlueprintDashboard />;\n  }\n\n  // Unconditional Instant Water Factory ERP Renderer\n  if (/water|factory|fmcg|pure-water|table-water|sachet|bottling/.test(cleanSlug)) {\n    return <WaterFactoryErpDashboard />;\n  }`
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully patched tools [slug] page.tsx!');
} else {
  console.log('Already patched.');
}
