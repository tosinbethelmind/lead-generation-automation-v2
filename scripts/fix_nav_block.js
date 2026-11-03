const fs = require('fs');
const pageFile = 'src/app/admin/mobile/page.tsx';
let code = fs.readFileSync(pageFile, 'utf8');

const targetBlock = `        ) : (
        {[
          { key: 'radar', label: 'Radar', icon: Zap },
          { key: 'closer', label: 'Closer', icon: MessageSquare },
          { key: 'claim', label: 'Claim', icon: PlusCircle },
          { key: 'onboard', label: 'Domains', icon: Globe },
          { key: 'ai_tester', label: 'AI Test', icon: Bot },
          { key: 'hubs', label: 'All Hubs', icon: Layers }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? '#38bdf8' : '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <Icon size={18} color={isActive ? '#38bdf8' : '#64748b'} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 800 : 600 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>`;

const replacementBlock = `        ) : (
          [
            { key: 'radar', label: 'Radar', icon: Zap },
            { key: 'closer', label: 'Closer', icon: MessageSquare },
            { key: 'claim', label: 'Claim', icon: PlusCircle },
            { key: 'onboard', label: 'Domains', icon: Globe },
            { key: 'ai_tester', label: 'AI Test', icon: Bot },
            { key: 'deal_wire', label: 'Deal Wire', icon: Briefcase, onClick: () => setPillarMode('pillar2') }
          ].map((item: any) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={item.onClick || (() => setActiveTab(item.key as any))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: item.key === 'deal_wire' ? '#fbbf24' : (isActive ? '#38bdf8' : '#64748b'),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: '4px 0'
                }}
              >
                <Icon size={18} color={item.key === 'deal_wire' ? '#fbbf24' : (isActive ? '#38bdf8' : '#64748b')} />
                <span style={{ fontSize: '10px', fontWeight: isActive || item.key === 'deal_wire' ? 800 : 600 }}>{item.label}</span>
              </button>
            );
          })
        )}
      </nav>`;

if (code.includes(targetBlock)) {
  code = code.replace(targetBlock, replacementBlock);
  console.log('✅ Matched targetBlock cleanly.');
} else {
  // Normalize line endings and match
  console.log('⚠️ Strict match failed, trying normalized replacement.');
  const normCode = code.replace(/\r\n/g, '\n');
  const normTarget = targetBlock.replace(/\r\n/g, '\n');
  if (normCode.includes(normTarget)) {
    code = normCode.replace(normTarget, replacementBlock);
    console.log('✅ Normalized match succeeded.');
  }
}

fs.writeFileSync(pageFile, code, 'utf8');
console.log('Finished updating bottom nav.');
