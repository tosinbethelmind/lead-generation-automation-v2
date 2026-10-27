const fs = require('fs');
const path = require('path');

const clientPath = path.join(__dirname, '..', 'src', 'components', 'vin', 'VinCheckerClient.tsx');
let code = fs.readFileSync(clientPath, 'utf8');

// 1. Add Camera to lucide-react imports if not present
if (!code.includes('Camera,')) {
  code = code.replace("  ChevronRight,\n  Share2", "  ChevronRight,\n  Share2,\n  Camera");
  console.log('✓ Added Camera to lucide-react imports');
}

// 2. Enhance executeLoadReport to query /api/vin-lookup/real-history
const oldLoadReport = `  const executeLoadReport = async (vin: string, bypass = false) => {
    setIsUnlocking(true);
    try {
      const res = await fetch('/api/vin-proxy/vin/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin, bypassPayment: bypass }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setFullReport(json.data);
        setShowPaymentModal(false);
      } else {
        throw new Error(json.error || 'Could not load executive report.');
      }
    } catch (err: any) {
      alert(\`Report Notice: \${err.message}\`);
    } finally {
      setIsUnlocking(false);
    }
  };`;

const newLoadReport = `  const executeLoadReport = async (vin: string, bypass = false) => {
    setIsUnlocking(true);
    try {
      const [reportRes, realHistoryRes] = await Promise.allSettled([
        fetch('/api/vin-proxy/vin/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vin, bypassPayment: bypass }),
        }),
        fetch('/api/vin-lookup/real-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vin }),
        }),
      ]);

      let baseReport: any = null;
      if (reportRes.status === 'fulfilled') {
        const json = await reportRes.value.json().catch(() => ({}));
        if (json.success && json.data) {
          baseReport = json.data;
        }
      }

      if (realHistoryRes.status === 'fulfilled') {
        const histJson = await realHistoryRes.value.json().catch(() => ({}));
        if (histJson.success && histJson.data) {
          const hist = histJson.data;
          if (baseReport) {
            baseReport.auctionPhotos = hist.auctionHistory?.photos?.map((p: any) => p.url) || [];
            baseReport.nmvtisTitleBrands = hist.nmvtisTitleBrands || [];
            baseReport.realHistorySource = hist.source;
          }
        }
      }

      if (baseReport) {
        setFullReport(baseReport);
        setShowPaymentModal(false);
      } else {
        throw new Error('Could not load executive report from server.');
      }
    } catch (err: any) {
      alert(\`Report Notice: \${err.message}\`);
    } finally {
      setIsUnlocking(false);
    }
  };`;

if (code.includes(oldLoadReport)) {
  code = code.replace(oldLoadReport, newLoadReport);
  console.log('✓ executeLoadReport successfully updated to query real history in parallel');
} else {
  // Try CRLF version
  const oldLoadReportCRLF = oldLoadReport.replace(/\n/g, '\r\n');
  if (code.includes(oldLoadReportCRLF)) {
    code = code.replace(oldLoadReportCRLF, newLoadReport.replace(/\n/g, '\r\n'));
    console.log('✓ executeLoadReport successfully updated (CRLF)');
  } else {
    console.warn('Warning: oldLoadReport target not matched');
  }
}

// 3. Add Auction Photo Gallery before Nigerian Mechanic Checklist
const targetMechanic = '              {/* Nigerian Mechanic Pre-Purchase Inspection Checklist */}';
const galleryBlock = `              {/* Genuine US Salvage & Auction Photos Gallery (Copart / IAAI) */}
              {fullReport.auctionPhotos && fullReport.auctionPhotos.length > 0 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0e17] border border-[#d4af37]/35 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-[#d4af37]" />
                      <h3 className="font-serif text-lg font-normal text-[#f5f3ef]">
                        US Auction Yard Photographic Evidence ({fullReport.auctionPhotos.length} Photos)
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider border border-[#d4af37]/30">
                      Copart / IAAI Archive
                    </span>
                  </div>
                  <p className="text-xs text-[#c9c4bc] font-light">
                    Actual archival photographs of the vehicle at the US salvage auction facility before export to Lagos:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {fullReport.auctionPhotos.map((photoUrl: string, idx: number) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 group aspect-video bg-black/40">
                        <img src={photoUrl} alt={\`Auction Photo \${idx + 1}\`} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nigerian Mechanic Pre-Purchase Inspection Checklist */}`;

if (code.includes(targetMechanic)) {
  code = code.replace(targetMechanic, galleryBlock);
  console.log('✓ Photo gallery block inserted before mechanic checklist');
}

fs.writeFileSync(clientPath, code, 'utf8');
console.log('✓ VinCheckerClient.tsx updated successfully!');
