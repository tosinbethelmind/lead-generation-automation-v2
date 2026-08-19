import fs from 'fs';
import path from 'path';
import { Lead } from './googleSheets';

let cachedBundle: Record<string, any> | null = null;

function loadBundle(): Record<string, any> {
  if (cachedBundle && Object.keys(cachedBundle).length > 0) return cachedBundle;
  
  // 1. Primary lookup: src/data/leads_bundle.json
  try {
    const bundlePath = path.join(process.cwd(), 'src/data/leads_bundle.json');
    if (fs.existsSync(bundlePath)) {
      const parsed = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
      if (parsed && typeof parsed === 'object') {
        cachedBundle = parsed;
        return cachedBundle!;
      }
    }
  } catch (err) {
    console.warn('Leads bundle read notice:', err);
  }

  // 2. Secondary fallback to local_db
  try {
    const dbPath = path.join(process.cwd(), 'local_db/leads_db.json');
    if (fs.existsSync(dbPath)) {
      const raw = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const list = raw.leads || (Array.isArray(raw) ? raw : Object.values(raw));
      const dict: Record<string, any> = {};
      list.forEach((l: any) => {
        const id = l.lead_id || l.id;
        if (id) {
          dict[id] = l;
          const clean = String(id).toLowerCase().replace(/[^a-z0-9]/g, '');
          if (clean) dict[clean] = l;
          if (l.name) {
            const nameClean = String(l.name).toLowerCase().replace(/[^a-z0-9]/g, '');
            if (nameClean) dict[nameClean] = l;
          }
        }
      });
      cachedBundle = dict;
      return cachedBundle;
    }
  } catch (_) {}

  cachedBundle = {};
  return cachedBundle;
}

export function findBundledLead(leadId: string): Lead | null {
  if (!leadId) return null;
  const bundle = loadBundle();

  // 1. Direct exact ID lookup
  if (bundle[leadId]) {
    return bundle[leadId] as Lead;
  }

  // 2. Slug / Normalized lookup (removes hyphens, spaces, underscores)
  const cleanId = leadId.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleanId && bundle[cleanId]) {
    return bundle[cleanId] as Lead;
  }

  // 3. Search values for matching lead_id or slugified business name
  for (const key of Object.keys(bundle)) {
    const item = bundle[key];
    if (!item) continue;
    if (item.lead_id && item.lead_id.toLowerCase() === leadId.toLowerCase()) {
      return item as Lead;
    }
    if (item.lead_id && item.lead_id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId) {
      return item as Lead;
    }
    if (item.name) {
      const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanName === cleanId) {
        return item as Lead;
      }
    }
  }

  return null;
}

export { sanitizeDisplayName, sanitizeCopyText, formatStagingDomain } from './leadSanitizers';


