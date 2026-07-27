async function verifyLiveEndpoints() {
  const baseUrl = 'https://lead-generation-automation-ecru.vercel.app';
  
  console.log('Fetching live counts from Vercel production endpoints...\n');

  try {
    const lagosRes = await fetch(`${baseUrl}/api/outreach/lagos10k`);
    const lagosData = await lagosRes.json();
    console.log('🏢 Lagos 10K API Response:');
    console.log('  Status:', lagosRes.status);
    console.log('  Total Lagos Leads:', lagosData.stats?.totalLagosLeads);
    console.log('  Pipeline Name:', lagosData.pipeline);

    console.log('\n----------------------------------------------------\n');

    const solarRes = await fetch(`${baseUrl}/api/solarquotepro-pipeline`);
    const solarData = await solarRes.json();
    console.log('⚡ Solar 10K API Response:');
    console.log('  Status:', solarRes.status);
    console.log('  Total Solar Installers:', solarData.stats?.totalScrapedInstallers);
    console.log('  Pipeline Name:', solarData.pipeline);

    console.log('\n====================================================');
    console.log(`📊 LIVE VERCEL TOTAL COMBINED: ${(lagosData.stats?.totalLagosLeads || 0) + (solarData.stats?.totalScrapedInstallers || 0)} LEADS`);
    console.log('====================================================');
  } catch (err: any) {
    console.error('Error fetching live endpoints:', err.message);
  }
}

verifyLiveEndpoints();
