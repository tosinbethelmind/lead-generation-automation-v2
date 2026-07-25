import { getActiveLeadRepository } from '@/lib/googleSheets';
import { getDesignTheme, buildFallbackCopy } from '@/lib/designGenerator';

/**
 * Asynchronously pre-generates AI marketing copy & visual design tokens for newly harvested leads.
 * Pre-caches generated_copy and design_theme in Supabase before outreach messages are dispatched,
 * ensuring lead preview page load speeds of <15ms.
 */
export async function preGenerateLeadAssets(lead: any): Promise<{ success: boolean; cached: boolean }> {
  if (!lead || !lead.lead_id) {
    return { success: false, cached: false };
  }

  // Skip if lead already has cached assets
  if (lead.generated_copy && lead.design_theme) {
    return { success: true, cached: true };
  }

  try {
    const repo = getActiveLeadRepository();
    const theme = getDesignTheme(lead.category || '');

    let copy: any = null;
    let generatedTheme: any = null;

    try {
      const { generateCopyWithProviders } = await import('@/lib/llmProvider');
      const generated = await generateCopyWithProviders(lead);
      if (generated) {
        copy = generated.copy;
        generatedTheme = generated.theme;
      }
    } catch (err: any) {
      console.warn(`[PreGenWorker] LLM provider copy generation fallback for lead ${lead.lead_id}:`, err.message);
    }

    const finalCopy = copy || buildFallbackCopy(lead);
    const finalTheme = {
      ...theme,
      ...(generatedTheme || {})
    };

    await repo.updateLeadFields(lead.lead_id, {
      generated_copy: finalCopy,
      design_theme: finalTheme
    });

    console.log(`[PreGenWorker] ✅ Successfully pre-cached copy & theme for lead: ${lead.lead_id}`);
    return { success: true, cached: false };
  } catch (err: any) {
    console.error(`[PreGenWorker] ❌ Failed to pre-generate assets for lead ${lead.lead_id}:`, err.message);
    return { success: false, cached: false };
  }
}
