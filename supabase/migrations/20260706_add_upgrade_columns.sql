-- Add website modernization & transfer/rebuild columns to the leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS cms_platform TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS upgrade_strategy TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS cms_confidence TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS plugin_suggestions TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS embed_note TEXT;

-- Create index on cms_platform and upgrade_strategy for faster dashboard filtering
CREATE INDEX IF NOT EXISTS idx_leads_cms_platform ON leads(cms_platform);
CREATE INDEX IF NOT EXISTS idx_leads_upgrade_strategy ON leads(upgrade_strategy);
