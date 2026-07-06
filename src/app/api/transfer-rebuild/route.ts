import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog, updateLeadFields } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, strategy, selectedFeatures } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const validStrategies = ['full_rebuild', 'plugin', 'script_embed'];
    if (!strategy || !validStrategies.includes(strategy)) {
      return NextResponse.json({ error: `Invalid strategy. Must be one of: ${validStrategies.join(', ')}` }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json({ error: `Lead with ID ${leadId} not found` }, { status: 404 });
    }

    // Update modernization fields in CRM/database
    const timestamp = new Date().toISOString();
    const featuresNote = selectedFeatures && selectedFeatures.length > 0 
      ? ` Selected Features: ${selectedFeatures.join(', ')}.` 
      : '';
    const newNotes = `${lead.notes || ''}\n[TRANSFER_STRATEGY_SELECT] Client selected strategy "${strategy}" on ${timestamp}.${featuresNote}`;
    
    await updateLeadFields(leadId, {
      upgrade_strategy: strategy,
      upgradeStrategy: strategy,
      plugin_suggestions: selectedFeatures,
      pluginSuggestions: selectedFeatures,
      generated_copy: null,
      design_theme: null,
      notes: newNotes
    });

    await addLog(
      'Transfer Strategy Select',
      'SUCCESS',
      `Lead "${lead.name}" selected upgrade strategy: ${strategy}`
    );

    return NextResponse.json({
      success: true,
      previewUrl: `/preview/${leadId}`,
      message: `Upgrade strategy updated to ${strategy} successfully!`
    });

  } catch (err: any) {
    console.error('[transfer-rebuild] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
