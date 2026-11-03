const fs = require('fs');

let code = fs.readFileSync('src/app/admin/mobile/page.tsx', 'utf8');

// Replace static import with dynamic import
const staticImport = "import Pillar2ControlView from '../../../components/admin/Pillar2ControlView';";
const dynamicImport = `import dynamic from 'next/dynamic';\r\n\r\nconst Pillar2ControlView = dynamic(\r\n  () => import('../../../components/admin/Pillar2ControlView'),\r\n  { ssr: false, loading: () => <div style={{ color: '#94a3b8', padding: '24px', textAlign: 'center' }}>Loading Desk...</div> }\r\n);`;

if (code.includes(staticImport)) {
  code = code.replace(staticImport, dynamicImport);
  fs.writeFileSync('src/app/admin/mobile/page.tsx', code, 'utf8');
  console.log('✅ Converted Pillar2ControlView to dynamic client import');
} else {
  console.log('⚠️ staticImport not found');
}
