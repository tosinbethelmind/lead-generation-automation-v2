const fs = require('fs');
const pageFile = 'src/app/admin/mobile/page.tsx';
let code = fs.readFileSync(pageFile, 'utf8');

const navStartTarget = "      {/* Persistent Bottom Mobile Navigation Bar */}\n      <nav style={{\n        position: 'fixed',\n        bottom: 0,\n        left: 0,\n        right: 0,\n        background: 'rgba(7, 10, 18, 0.96)',\n        backdropFilter: 'blur(20px)',\n        borderTop: '1px solid #1e293b',\n        display: 'grid',\n        gridTemplateColumns: 'repeat(6, 1fr)',\n        padding: '8px 2px 12px 2px',\n        zIndex: 100\n      }}>";

const navReplacement = `      {/* Persistent Bottom Mobile Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(7, 10, 18, 0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #1e293b',
        display: 'grid',
        gridTemplateColumns: pillarMode === 'pillar2' ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)',
        padding: '8px 2px 12px 2px',
        zIndex: 100
      }}>
        {pillarMode === 'pillar2' ? (
          <>
            <button
              onClick={() => setPillarMode('pillar1')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <Building size={18} color="#38bdf8" />
              <span style={{ fontSize: '10px', fontWeight: 800 }}>← Pillar 1</span>
            </button>
            <button
              onClick={handleRunPillar2Discovery}
              disabled={triggerLoading === 'discovery'}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fbbf24',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <Search size={18} color="#fbbf24" />
              <span style={{ fontSize: '10px', fontWeight: 800 }}>Discover</span>
            </button>
            <button
              onClick={handleProcessPillar2Queue}
              disabled={triggerLoading === 'process_queue'}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#10b981',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <Send size={18} color="#10b981" />
              <span style={{ fontSize: '10px', fontWeight: 800 }}>Queue ({pillar2Data?.stats?.queuedOutboundCount || 0})</span>
            </button>
            <button
              onClick={fetchTelemetry}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <RefreshCw size={18} color="#94a3b8" />
              <span style={{ fontSize: '10px', fontWeight: 800 }}>Refresh</span>
            </button>
          </>
        ) : (`;

const bottomNavItemsTarget = `        {[
          { key: 'radar', label: 'Radar', icon: Zap },
          { key: 'closer', label: 'Closer', icon: MessageSquare },
          { key: 'claim', label: 'Claim', icon: PlusCircle },
          { key: 'onboard', label: 'Domains', icon: Globe },
          { key: 'ai_tester', label: 'AI Test', icon: Bot },
          { key: 'hubs', label: 'All Hubs', icon: Layers }
        ].map(item => {`;

const bottomNavItemsReplacement = `        {[
          { key: 'radar', label: 'Radar', icon: Zap },
          { key: 'closer', label: 'Closer', icon: MessageSquare },
          { key: 'claim', label: 'Claim', icon: PlusCircle },
          { key: 'onboard', label: 'Domains', icon: Globe },
          { key: 'ai_tester', label: 'AI Test', icon: Bot },
          { key: 'deal_wire', label: 'Deal Wire', icon: Briefcase, onClick: () => setPillarMode('pillar2') }
        ].map(item => {`;

const buttonClickTarget = `            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}`;

const buttonClickReplacement = `            <button
              key={item.key}
              onClick={(item as any).onClick || (() => setActiveTab(item.key as any))}`;

const navEndTarget = `        })}
      </nav>`;

const navEndReplacement = `        })}
        )}
      </nav>`;

// Apply replacements
if (code.includes(navStartTarget)) {
  code = code.replace(navStartTarget, navReplacement);
  console.log('✅ Nav start updated.');
} else {
  // Try regex
  code = code.replace(/\{\/\* Persistent Bottom Mobile Navigation Bar \*\/\}\s*<nav[^>]*>/, navReplacement);
  console.log('✅ Nav start updated (regex).');
}

if (code.includes(bottomNavItemsTarget)) {
  code = code.replace(bottomNavItemsTarget, bottomNavItemsReplacement);
  console.log('✅ Bottom nav items updated.');
} else {
  console.log('⚠️ bottomNavItemsTarget not matched.');
}

if (code.includes(buttonClickTarget)) {
  code = code.replace(buttonClickTarget, buttonClickReplacement);
  console.log('✅ Button click updated.');
} else {
  console.log('⚠️ buttonClickTarget not matched.');
}

if (code.includes(navEndTarget)) {
  code = code.replace(navEndTarget, navEndReplacement);
  console.log('✅ Nav end updated.');
} else {
  console.log('⚠️ navEndTarget not matched.');
}

fs.writeFileSync(pageFile, code, 'utf8');
console.log('Bottom navigation updated successfully.');
