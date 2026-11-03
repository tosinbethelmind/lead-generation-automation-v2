const fs = require('fs');
const file = 'src/components/admin/Pillar2ControlView.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

const topTarget = `              <button
                onClick={() => setScriptModalTicket(null)}`;

const topRepl = `              <button
                aria-label="Close Brief Modal"
                data-testid="close-script-modal"
                onClick={() => setScriptModalTicket(null)}`;

if (content.includes(topTarget)) {
  content = content.replace(topTarget, topRepl);
  console.log('Top X updated successfully');
} else {
  console.log('Top X target not found');
}

const bottomTarget = `<CheckCircle2 size={13} />
                      <span>Approve & Queue</span>
                    </button>
                  </div>`;

const bottomRepl = `<CheckCircle2 size={13} />
                      <span>Approve & Queue</span>
                    </button>
                    <button
                      onClick={() => setScriptModalTicket(null)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        borderRadius: '8px',
                        padding: '9px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: '100%',
                        marginTop: '8px'
                      }}
                    >
                      Close Brief
                    </button>
                  </div>`;

if (content.includes(bottomTarget)) {
  content = content.replace(bottomTarget, bottomRepl);
  console.log('Bottom close button added successfully');
} else {
  console.log('Bottom target not found');
}

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
