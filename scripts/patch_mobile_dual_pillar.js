const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '..', 'src', 'app', 'admin', 'mobile', 'page.tsx');
let code = fs.readFileSync(pageFile, 'utf8');

// 1. Update imports
const oldImport = "  ShieldCheck,\n  Bot\n} from 'lucide-react';";
const newImport = `  ShieldCheck,
  Bot,
  Building,
  Briefcase
} from 'lucide-react';
import Pillar2ControlView from '@/components/admin/Pillar2ControlView';`;

if (code.includes(oldImport)) {
  code = code.replace(oldImport, newImport);
  console.log('✅ Imports replaced successfully.');
} else {
  console.log('⚠️ Old import not matched (may already be replaced).');
}

// 2. Add state variables
const stateTarget = "  const [activeTab, setActiveTab] = useState<'radar' | 'closer' | 'claim' | 'onboard' | 'ai_tester' | 'hubs'>('claim');";
const stateAddition = `  const [pillarMode, setPillarMode] = useState<'pillar1' | 'pillar2'>('pillar1');
  const [pillar2Data, setPillar2Data] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'radar' | 'closer' | 'claim' | 'onboard' | 'ai_tester' | 'hubs'>('claim');`;

if (code.includes(stateTarget)) {
  code = code.replace(stateTarget, stateAddition);
  console.log('✅ State variables added successfully.');
} else {
  console.log('⚠️ State target not matched.');
}

// 3. Update fetchTelemetry to store pillar2Data
const fetchTarget = "        setProvisionedSites(data.provisionedSites || []);\n      }";
const fetchAddition = `        setProvisionedSites(data.provisionedSites || []);
        if (data.pillar2) {
          setPillar2Data(data.pillar2);
        }
      }`;

if (code.includes(fetchTarget)) {
  code = code.replace(fetchTarget, fetchAddition);
  console.log('✅ fetchTelemetry updated successfully.');
} else {
  console.log('⚠️ fetchTarget not matched.');
}

// 4. Add Pillar 2 action handler functions
const handlerTarget = "  const handleTestAi = async (promptToUse?: string) => {";
const pillar2Handlers = `  const handleApprovePillar2 = async (ticketId: string) => {
    setTriggerLoading(ticketId);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({
          action: 'approve_pillar2_ticket',
          ticketId
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(\`✅ Deal #\${ticketId} approved & queued for outbound dispatch!\`);
        if (data.pillar2) setPillar2Data(data.pillar2);
        fetchTelemetry();
      } else {
        setFeedbackMsg(\`❌ \${data.error || 'Failed to approve deal'}\`);
      }
    } catch (err: any) {
      setFeedbackMsg(\`❌ Error: \${err.message}\`);
    } finally {
      setTriggerLoading(null);
    }
  };

  const handleRejectPillar2 = async (ticketId: string) => {
    setTriggerLoading(ticketId);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({
          action: 'reject_pillar2_ticket',
          ticketId
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(\`🗑️ Deal #\${ticketId} archived.\`);
        if (data.pillar2) setPillar2Data(data.pillar2);
        fetchTelemetry();
      }
    } catch (err: any) {
      setFeedbackMsg(\`❌ Error: \${err.message}\`);
    } finally {
      setTriggerLoading(null);
    }
  };

  const handleRunPillar2Discovery = async () => {
    setTriggerLoading('discovery');
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({ action: 'run_pillar2_discovery' })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(\`🔍 Discovered & staged fresh luxury deals!\`);
        if (data.pillar2) setPillar2Data(data.pillar2);
        fetchTelemetry();
      }
    } catch (err: any) {
      setFeedbackMsg(\`❌ Error: \${err.message}\`);
    } finally {
      setTriggerLoading(null);
    }
  };

  const handleProcessPillar2Queue = async () => {
    setTriggerLoading('process_queue');
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({ action: 'process_pillar2_queue' })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(\`⚡ Outbound queue processed: \${data.workerRes?.dispatched || 0} dispatched.\`);
        if (data.pillar2) setPillar2Data(data.pillar2);
        fetchTelemetry();
      }
    } catch (err: any) {
      setFeedbackMsg(\`❌ Error: \${err.message}\`);
    } finally {
      setTriggerLoading(null);
    }
  };

  const handleTestAi = async (promptToUse?: string) => {`;

if (code.includes(handlerTarget)) {
  code = code.replace(handlerTarget, pillar2Handlers);
  console.log('✅ Pillar 2 handlers added successfully.');
} else {
  console.log('⚠️ handlerTarget not matched.');
}

// 5. Add Master Dual-Pillar Switcher before the SME tab navigation header
const navHeaderTarget = "      {/* Main Tab Navigation Header */}";
const masterSwitcher = `      {/* 🚀 DUAL-PILLAR MASTER MODE SWITCHER */}
      <div style={{
        background: '#090e1a',
        borderBottom: '1px solid #1e293b',
        padding: '10px 14px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px'
      }}>
        <button
          onClick={() => setPillarMode('pillar1')}
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            border: pillarMode === 'pillar1' ? '2px solid #0284c7' : '1px solid #1e293b',
            background: pillarMode === 'pillar1' ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.22) 0%, rgba(14, 165, 233, 0.1) 100%)' : '#0f172a',
            color: pillarMode === 'pillar1' ? '#38bdf8' : '#94a3b8',
            fontWeight: 800,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Building size={15} />
          <span>🏢 PILLAR 1: SME Engine</span>
        </button>

        <button
          onClick={() => setPillarMode('pillar2')}
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            border: pillarMode === 'pillar2' ? '2px solid #d97706' : '1px solid #1e293b',
            background: pillarMode === 'pillar2' ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(180, 83, 9, 0.12) 100%)' : '#0f172a',
            color: pillarMode === 'pillar2' ? '#fbbf24' : '#94a3b8',
            fontWeight: 800,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s ease'
          }}
        >
          <Briefcase size={15} />
          <span>🏛️ PILLAR 2: Deal Wire</span>
          {(pillar2Data?.stats?.pendingCount || 0) > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 900,
              marginLeft: '2px'
            }}>
              {pillar2Data?.stats?.pendingCount}
            </span>
          )}
        </button>
      </div>

      {pillarMode === 'pillar1' && (
      /* Main Tab Navigation Header */`;

if (code.includes(navHeaderTarget)) {
  code = code.replace(navHeaderTarget, masterSwitcher);
  console.log('✅ Master Switcher added successfully.');
} else {
  console.log('⚠️ navHeaderTarget not matched.');
}

// 6. Close the pillarMode === 'pillar1' condition right before </main> or wrap main
// Notice that the tab bar is before <main>. Let's see:
// The tab bar closes with </div> right before {/* Main Content Area */}
const tabHeaderEndTarget = "        ))} \n      </div>\n\n      {/* Main Content Area */}";
const tabHeaderEndAlt = "        ))}\n      </div>\n\n      {/* Main Content Area */}";

if (code.includes(tabHeaderEndAlt)) {
  code = code.replace(tabHeaderEndAlt, "        ))}\n      </div>\n      )}\n\n      {/* Main Content Area */}");
  console.log('✅ Closed pillarMode === "pillar1" tab header.');
} else if (code.includes("        ))}\n      </div>")) {
  code = code.replace("        ))}\n      </div>", "        ))}\n      </div>\n      )}");
  console.log('✅ Closed pillarMode === "pillar1" tab header (regex variant).');
}

// 7. In <main style={{ padding: '16px' }}>, conditionally render Pillar 2
const mainStartTarget = "<main style={{ padding: '16px' }}>";
const mainStartAddition = `<main style={{ padding: '16px' }}>
        {pillarMode === 'pillar2' ? (
          <Pillar2ControlView
            pillar2Data={pillar2Data}
            triggerLoading={triggerLoading}
            onApproveTicket={handleApprovePillar2}
            onRejectTicket={handleRejectPillar2}
            onRunDiscovery={handleRunPillar2Discovery}
            onProcessQueue={handleProcessPillar2Queue}
            onRefresh={fetchTelemetry}
            onCopyText={copyToClipboard}
          />
        ) : (
          <>`;

if (code.includes(mainStartTarget)) {
  code = code.replace(mainStartTarget, mainStartAddition);
  console.log('✅ Rendered Pillar2ControlView conditionally inside <main>.');
} else {
  console.log('⚠️ mainStartTarget not matched.');
}

// 8. Close the <> fragment right before </main>
const mainEndTarget = "      </main>";
const mainEndAddition = `          </>
        )}
      </main>`;

if (code.includes(mainEndTarget)) {
  code = code.replace(mainEndTarget, mainEndAddition);
  console.log('✅ Closed fragment before </main>.');
} else {
  console.log('⚠️ mainEndTarget not matched.');
}

fs.writeFileSync(pageFile, code, 'utf8');
console.log('🚀 page.tsx patched and saved successfully.');
