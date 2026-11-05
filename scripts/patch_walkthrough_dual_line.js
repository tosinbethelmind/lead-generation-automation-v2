const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'app', 'factory', 'walkthrough', 'page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Replace CHAPTERS array
const newChapters = `const CHAPTERS: Chapter[] = [
  {
    id: 1,
    time: '00:00 - 00:25',
    title: 'Introduction: Why Dual-Line Operations Run on Mobile Phones',
    role: 'Mr. Obi (Owner)',
    badge: '👑 Executive Overview',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Managing both Sachet Water (thin margin, high volume) and Bottled Water / Jars (high margin, high inventory risk) without computers.',
    noviceExplanation: 'Water factories in Nigeria run two distinct operations: the high-speed Sachet Line (bags of 20) and the Bottled Water Line (50cl, 75cl, and 19L dispenser jars). As the owner, you do not need expensive office computers. Your smartphone connects directly to both lines, tracking daily gross revenue (₦1,971,000) and net cash profit (₦524,200) even when NEPA drops or data fluctuates.',
    liveLink: '/factory/owner',
    actionText: 'View Owner Dual-Line Screen',
    keyRule: 'Rule: The factory owner should know their exact cash profit from both sachets and bottles before 8:00 PM every evening.'
  },
  {
    id: 2,
    time: '00:25 - 00:55',
    title: 'Staff Login Without Passwords (Zero Learning Curve)',
    role: 'All Factory Staff',
    badge: '👥 No Password Login',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    summary: 'Four large picture cards with 4-digit PINs. No email addresses or complicated passwords.',
    noviceExplanation: 'Nigerian factory workers forget passwords within hours. On this system, nobody types an email. Staff see four large picture cards: Mr. Obi, Kenneth the supervisor, Blessing the cashier, and Musa the driver. Kenneth just taps his picture, types 1-1-1-1, and immediately switches between the Sachet Line and Bottled Line tabs.',
    liveLink: '/factory/login',
    actionText: 'Try Staff Login Screen',
    keyRule: 'Rule: Never give factory workers complex email logins. Use simple 4-digit PINs.'
  },
  {
    id: 3,
    time: '00:55 - 01:30',
    title: 'Dual-Line Production Console (+1 Roll Used & Bottle Preforms)',
    role: 'Kenneth (Supervisor)',
    badge: '📋 Sachet + Bottling Console',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    summary: 'Tap "+1 Roll Used" for sachets (300 bags) or tap "+10 Packs 75cl", "+10 Packs 50cl", "+5 Jars Refilled".',
    noviceExplanation: 'For sachets, Kenneth taps "+1 Roll Used" whenever nylon film finishes (300 bags counted). For the bottling line, he logs PET preforms issued (e.g. 3,000 preforms) and blow-molding rejects (e.g. 24 defective bottles). The system ensures machine operators do not sell unrecorded packs out the back door.',
    liveLink: '/factory/login',
    actionText: 'Test Production Buttons',
    keyRule: 'Rule: 1kg of sachet nylon must yield 16 bags, and blow-molding reject rate must remain below 1.2%.'
  },
  {
    id: 4,
    time: '01:30 - 02:05',
    title: 'Gate POS: Multi-Product Sales & Fake Alert Shield',
    role: 'Blessing (Cashier)',
    badge: '💰 Multi-Product POS Shield',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    summary: 'Sell Sachet bags (₦350), 75cl packs (₦1,200), 50cl packs (₦1,100), and 19L refills (₦900).',
    noviceExplanation: 'Walk-in customers and distributors buy different products. Blessing selects the product, quantity, and Cash vs. Transfer. For Moniepoint/OPay transfers, she verifies credit on the physical POS terminal before opening the gate. Cash in her drawer must match the software to the exact Naira at 6:00 PM.',
    liveLink: '/factory/login',
    actionText: 'Test Cashier Gate POS',
    keyRule: 'Rule: Never release sachets, bottle packs, or dispenser jars until payment is verified on Moniepoint POS.'
  },
  {
    id: 5,
    time: '02:05 - 02:45',
    title: 'Driver Shortages: Burst Pouch Rule & Empty Jar Deposits',
    role: 'Musa (Delivery Driver)',
    badge: '🚚 Driver & Jar Shield',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    summary: 'Auto-debit ₦14,000 for 40 missing sachet bags + Track ₦4,500 deposit for unreturned 19L dispenser jars.',
    noviceExplanation: 'Drivers often claim bags burst or that customers promised to return empty 19L jars. Our rule is strict: if a sachet burst on the road, Musa must bring back the physical plastic pouch. For 19L dispenser jars (which cost ₦4,500 each), Musa must either bring back the empty jar or collect a ₦4,500 deposit from the customer. Zero excuses.',
    liveLink: '/factory/owner',
    actionText: 'See Driver Reconciliation',
    keyRule: 'Rule: 0 physical burst pouches = auto-debit; Unreturned 19L jars without deposit = driver liability.'
  },
  {
    id: 6,
    time: '02:45 - 03:25',
    title: 'Mr. Obi\\'s Owner Portal: Dual-Line Profit & Diesel Slicer',
    role: 'Mr. Obi (Managing Director)',
    badge: '🔑 4-Digit Owner PIN',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Enter PIN 2026 to see today\\'s net profit (₦524,200), generator fuel overhead, and preform audit.',
    noviceExplanation: 'Enter PIN 2026 anytime during the day. See real-time sachet sales (₦1,470,000) plus bottled/jar sales (₦501,000) = ₦1,971,000 total gross. See diesel burned (32 Liters @ ₦1,350 = ₦43,200), nylon film cost (₦280,000), PET preforms/caps (₦95,600), and net cash profit of ₦524,200.',
    liveLink: '/factory/owner',
    actionText: 'Unlock Mr. Obi\\'s Screen',
    keyRule: 'Rule: Maintain generator diesel overhead below ₦12/sachet bag and monitor PET preform reject rate.'
  },
  {
    id: 7,
    time: '03:25 - 03:55',
    title: '8:00 PM WhatsApp Shift Summary & Home Screen App',
    role: 'Kenneth & Mr. Obi',
    badge: '📲 1-Tap WhatsApp Sync',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    summary: 'Supervisor taps one button to dispatch the dual-line production & financial audit to Mr. Obi\\'s WhatsApp.',
    noviceExplanation: 'At 6:00 PM, Kenneth closes the shift and taps "Send Shift Close to Mr. Obi on WhatsApp". At 8:00 PM, Mr. Obi receives the complete daily digest broken down by Sachets, 75cl Bottles, 50cl Bottles, and 19L Dispenser Jars. Finally, save the app to your phone home screen for 1-tap instant access.',
    liveLink: '/factory',
    actionText: 'View Sample WhatsApp Report',
    keyRule: 'Rule: Zero WhatsApp API fees, zero Meta approvals, and zero risk of phone number bans.'
  }
];`;

const chaptersRegex = /const CHAPTERS: Chapter\[\] = \[[\s\S]*?\n\];/;
content = content.replace(chaptersRegex, newChapters);

// Also update video download links to include the PDF manual download button
const oldDownloadRegex = /<div className="flex items-center gap-2">\s*<a\s*href="\/videos\/obi_table_water_os_walkthrough\.webm"[\s\S]*?<\/div>/;
const newDownloadHtml = `<div className="flex flex-wrap items-center gap-2">
              <a
                href="/videos/obi_table_water_os_walkthrough.mp4"
                download
                className="text-[11px] bg-[#0B5FFF]/20 text-[#38BDF8] hover:bg-[#0B5FFF]/30 px-3 py-1 rounded-lg border border-[#0B5FFF]/40 font-bold flex items-center gap-1.5 transition"
              >
                <span>🎬 Download Video (MP4 - 8.3 MB)</span>
              </a>
              <a
                href="/downloads/obi_table_water_complete_handbook.pdf"
                download
                className="text-[11px] bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-3 py-1 rounded-lg border border-emerald-500/40 font-bold flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📄 Download Complete PDF Manual (605 KB)</span>
              </a>
            </div>`;

content = content.replace(oldDownloadRegex, newDownloadHtml);

// Fix video tag to point to MP4
content = content.replace(
  '<source src="/videos/obi_table_water_os_walkthrough.webm" type="video/webm" />',
  '<source src="/videos/obi_table_water_os_walkthrough.mp4" type="video/mp4" />'
);

// Update hero description
content = content.replace(
  'How to Run Obi Table Water OS <span className="text-[#38BDF8]">Like a Pro</span>',
  'Obi Table Water OS: <span className="text-[#38BDF8]">Sachet & Bottled Water Dual-Line Guide</span>'
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ Successfully updated src/app/factory/walkthrough/page.tsx with dual-line operations and download links!');
