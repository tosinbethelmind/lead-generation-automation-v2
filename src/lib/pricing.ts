import { RuntimeConfig } from './localConfig';

export const FEATURE_CATALOG = [
  { id: 'quote_estimator', cost: 35000 },
  { id: 'patient_intake', cost: 35000 },
  { id: 'ecommerce', cost: 50000 },
  { id: 'vehicle_valuation', cost: 30000 },
  { id: 'table_reservation', cost: 25000 }
];

export function calculateLeadClaimFee(lead: any, config: RuntimeConfig): number {
  const hasWebsite = lead.has_website !== false && lead.hasWebsite !== false && lead.website && lead.website.trim() !== '';
  const strategy = lead.upgrade_strategy || lead.upgradeStrategy || (hasWebsite ? 'script_embed' : 'basic_presence');
  
  let base = 0;
  if (strategy === 'full_rebuild') base = 600000;
  else if (strategy === 'plugin') base = 250000;
  else if (strategy === 'basic_presence') base = 150000;
  else if (strategy === 'script_embed') base = 65000;
  else base = config.claimFeeNGN || 600000;
  
  let featuresCost = 0;
  let selectedFeatures: string[] = [];
  if (lead.plugin_suggestions || lead.pluginSuggestions) {
    try {
      const parsed = Array.isArray(lead.plugin_suggestions || lead.pluginSuggestions)
        ? (lead.plugin_suggestions || lead.pluginSuggestions)
        : JSON.parse(lead.plugin_suggestions || lead.pluginSuggestions || '[]');
      selectedFeatures = parsed;
    } catch (e) {}
  }
  
  if (Array.isArray(selectedFeatures)) {
    selectedFeatures.forEach((fid: string) => {
      const f = FEATURE_CATALOG.find((x) => x.id === fid);
      if (f) {
        featuresCost += f.cost;
      }
    });
  }
  
  return base + featuresCost;
}
