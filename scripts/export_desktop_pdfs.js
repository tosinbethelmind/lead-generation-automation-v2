const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const DESKTOP_DIR = 'C:\\Users\\HomePC\\Desktop';
const HTML_FILE = path.resolve(__dirname, '../public/print_lawyer_pack.html');

async function exportPdfs() {
  console.log('Launching Chromium for PDF generation...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const fileUrl = 'file:///' + HTML_FILE.replace(/\\/g, '/');
  console.log('Loading HTML file:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });

  // 1. Export Master Pack (All 4 Documents in one PDF)
  console.log('1. Generating Master Legal Pack PDF (All 4 Documents)...');
  const masterPath = path.join(DESKTOP_DIR, 'Bethelmind_Master_Legal_Pack_All_Documents.pdf');
  await page.pdf({
    path: masterPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
  });
  console.log('   ✅ Saved:', masterPath, `(${fs.statSync(masterPath).size} bytes)`);

  // Document selectors inside page-container
  // Doc 1: first page-break
  // Doc 2: second page-break
  // Doc 3: third page-break
  // Doc 4: fourth div

  // 2. Export Document 1: Retainership Agreement
  console.log('2. Generating Document 1: Lawyer Retainership Agreement...');
  await page.evaluate(() => {
    const pages = document.querySelectorAll('.page-container > div');
    pages.forEach((p, idx) => {
      p.style.display = idx === 0 ? 'block' : 'none';
    });
  });
  const doc1Path = path.join(DESKTOP_DIR, 'Bethelmind_Doc1_Lawyer_Retainership_Agreement.pdf');
  await page.pdf({
    path: doc1Path,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
  });
  console.log('   ✅ Saved:', doc1Path, `(${fs.statSync(doc1Path).size} bytes)`);

  // 3. Export Document 2: Master Bilateral Co-Brokerage Agreement
  console.log('3. Generating Document 2: Master Bilateral Co-Brokerage Agreement (LASRERA 80/20)...');
  await page.evaluate(() => {
    const pages = document.querySelectorAll('.page-container > div');
    pages.forEach((p, idx) => {
      p.style.display = idx === 1 ? 'block' : 'none';
    });
  });
  const doc2Path = path.join(DESKTOP_DIR, 'Bethelmind_Doc2_Master_CoBrokerage_Agreement.pdf');
  await page.pdf({
    path: doc2Path,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
  });
  console.log('   ✅ Saved:', doc2Path, `(${fs.statSync(doc2Path).size} bytes)`);

  // 4. Export Document 3: Statutory Joint Inspection Memorandum (JIM)
  console.log('4. Generating Document 3: Joint Inspection Memorandum (JIM)...');
  await page.evaluate(() => {
    const pages = document.querySelectorAll('.page-container > div');
    pages.forEach((p, idx) => {
      p.style.display = idx === 2 ? 'block' : 'none';
    });
  });
  const doc3Path = path.join(DESKTOP_DIR, 'Bethelmind_Doc3_Statutory_Joint_Inspection_Memorandum_JIM.pdf');
  await page.pdf({
    path: doc3Path,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
  });
  console.log('   ✅ Saved:', doc3Path, `(${fs.statSync(doc3Path).size} bytes)`);

  // 5. Export Document 4: Diaspora Buyer Retention Mandate
  console.log('5. Generating Document 4: Diaspora Buyer Retention Mandate...');
  await page.evaluate(() => {
    const pages = document.querySelectorAll('.page-container > div');
    pages.forEach((p, idx) => {
      p.style.display = idx === 3 ? 'block' : 'none';
    });
  });
  const doc4Path = path.join(DESKTOP_DIR, 'Bethelmind_Doc4_Diaspora_Buyer_Retention_Mandate.pdf');
  await page.pdf({
    path: doc4Path,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
  });
  console.log('   ✅ Saved:', doc4Path, `(${fs.statSync(doc4Path).size} bytes)`);

  await browser.close();
  console.log('\n🎉 ALL 5 PDF FILES SUCCESSFULLY EXPORTED TO YOUR DESKTOP!');
}

exportPdfs().catch(err => {
  console.error('❌ Error exporting PDFs:', err.message);
});
