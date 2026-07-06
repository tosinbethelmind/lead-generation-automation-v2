import { RuntimeConfig } from './localConfig';

export const FEATURE_CATALOG = [
  { id: 'quote_estimator', cost: 35000 },
  { id: 'patient_intake', cost: 35000 },
  { id: 'ecommerce', cost: 50000 },
  { id: 'vehicle_valuation', cost: 30000 },
  { id: 'table_reservation', cost: 25000 }
];

export function calculateLeadClaimFee(lead: any, config: RuntimeConfig): number {
  // If the lead does not have a website (New Build), fall back to standard setup claim fee
  const hasWebsite = lead.has_website !== false && lead.hasWebsite !== false;
  if (!hasWebsite) {
    return config.claimFeeNGN || 0;
  }
  
  const strategy = lead.upgrade_strategy || lead.upgradeStrategy || 'full_rebuild';
  let base = 0;
  if (strategy === 'full_rebuild') base = 600000;
  else if (strategy === 'plugin') base = 250000;
  else if (strategy === 'script_embed') base = 65000;
  else base = 600000;
  
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
