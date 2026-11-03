const fs = require('fs');
const pageFile = 'src/app/admin/mobile/page.tsx';
let code = fs.readFileSync(pageFile, 'utf8');

// Replace Bot in imports
code = code.replace(/Bot\s*\r?\n\}\s*from\s*'lucide-react';/, `Bot,
  Building,
  Briefcase
} from 'lucide-react';
import Pillar2ControlView from '@/components/admin/Pillar2ControlView';`);

// Replace setProvisionedSites
code = code.replace(/setProvisionedSites\(data\.provisionedSites \|\| \[\]\);/, `setProvisionedSites(data.provisionedSites || []);
        if (data.pillar2) {
          setPillar2Data(data.pillar2);
        }`);

fs.writeFileSync(pageFile, code, 'utf8');
console.log('Final fixes applied successfully.');
