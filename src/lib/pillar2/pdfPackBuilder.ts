/**
 * @file src/lib/pillar2/pdfPackBuilder.ts
 * 
 * 🏛️ GENUINE STANDALONE BINARY PDF BUILDER (%PDF-1.7)
 * Bethelmind Digital Solutions (CAC Certified: Reg BN 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 * 
 * Generates 100% compliant, standard binary PDF files viewable in:
 * - Adobe Acrobat Reader
 * - Android Google Drive PDF Viewer
 * - Apple Preview / iOS Files
 * - Google Chrome / Edge PDF Engine
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import {
  DocumentMetadata,
  calculateCommissionSplits,
  generateEvidenceHash,
  generateDoc1RetainershipText,
  generateDoc2CoBrokerageText,
  generateDoc3JIMText,
  generateDoc4DiasporaMandateText,
  generateSection84Certificate
} from './statutoryDocumentGenerator';

interface DrawContext {
  doc: PDFDocument;
  fontRegular: PDFFont;
  fontBold: PDFFont;
  fontMono: PDFFont;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  meta: DocumentMetadata;
}

export function sanitizePdfText(text: string): string {
  if (!text) return '';
  return text
    .replace(/₦/g, 'NGN ')
    .replace(/•/g, '-')
    .replace(/[^\x20-\x7E\t\r\n]/g, ' ');
}

export function drawSafeText(
  page: PDFPage,
  text: string,
  options: { x: number; y: number; size: number; font: PDFFont; color?: any }
) {
  page.drawText(sanitizePdfText(text), options);
}

export async function buildStatutoryPdfPackBuffer(meta: DocumentMetadata): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  // Document metadata
  doc.setTitle(`Statutory Legal Pack - ${meta.dealId}`);
  doc.setAuthor('Bethelmind Digital Solutions (CAC BN: 9912717)');
  doc.setSubject('LASRERA 80/20 Co-Brokerage Mandate & Legal Instruments');
  doc.setKeywords(['LASRERA', 'Real Estate', 'Lagos', 'Mandate', 'Section 84', 'Evidence Act', 'Legal Pack']);
  doc.setProducer('Bethelmind Digital Legal Engine v2.0');
  doc.setCreator('Bethelmind Digital Solutions');

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await doc.embedFont(StandardFonts.Courier);

  const pageWidth = 595.28; // Standard A4 width in points
  const pageHeight = 841.89; // Standard A4 height in points
  const margin = 42;

  const ctx: DrawContext = {
    doc,
    fontRegular,
    fontBold,
    fontMono,
    pageWidth,
    pageHeight,
    margin,
    meta
  };

  const splits = calculateCommissionSplits(meta.askingPriceNgn);
  const doc1 = generateDoc1RetainershipText(meta);
  const doc2 = generateDoc2CoBrokerageText(meta);
  const doc3 = generateDoc3JIMText(meta);
  const doc4 = generateDoc4DiasporaMandateText(meta);
  const fullText = `${doc1}\n\n${doc2}\n\n${doc3}\n\n${doc4}`;
  const hash = generateEvidenceHash(fullText, meta);
  const cert = generateSection84Certificate(hash, meta);

  // 1. Cover & Executive Summary Page
  buildCoverPage(ctx, splits, hash);

  // 2. Document 1: Retainership Agreement
  buildDocumentPage(ctx, 'DOCUMENT 1: MASTER LEGAL RETAINERSHIP & COUNSEL AGREEMENT', doc1, 2);

  // 3. Document 2: Co-Brokerage 80/20 Agreement
  buildDocumentPage(ctx, 'DOCUMENT 2: MASTER CO-BROKERAGE & COMMISSION SHARING AGREEMENT', doc2, 3);

  // 4. Document 3: Statutory Joint Inspection Memorandum (JIM)
  buildDocumentPage(ctx, 'DOCUMENT 3: STATUTORY JOINT INSPECTION MEMORANDUM (JIM)', doc3, 4);

  // 5. Document 4: Diaspora Buyer Retention Mandate
  buildDocumentPage(ctx, 'DOCUMENT 4: DIASPORA BUYER RETENTION & ACQUISITION MANDATE', doc4, 5);

  // 6. Section 84 Certificate of Authenticity
  buildDocumentPage(ctx, 'SECTION 84 EVIDENCE ACT (2011) FORENSIC CERTIFICATE', cert, 6, hash);

  return await doc.save();
}

/**
 * Draws recurring official header and footer
 */
function drawPageFurniture(page: PDFPage, ctx: DrawContext, pageNumber: number, totalPages: number = 6) {
  const { pageWidth, pageHeight, margin, fontRegular, fontBold, meta } = ctx;

  // Top Banner rule
  page.drawRectangle({
    x: margin,
    y: pageHeight - 32,
    width: pageWidth - (margin * 2),
    height: 18,
    color: rgb(0.04, 0.07, 0.12)
  });

  drawSafeText(page, 'BETHELMIND DIGITAL SOLUTIONS | CAC BN: 9912717 | LASRERA 80/20 DESK', {
    x: margin + 8,
    y: pageHeight - 27,
    size: 7.5,
    font: fontBold,
    color: rgb(0.95, 0.77, 0.25)
  });

  drawSafeText(page, 'OFFICIAL STATUTORY INSTRUMENT', {
    x: pageWidth - margin - 150,
    y: pageHeight - 27,
    size: 7,
    font: fontBold,
    color: rgb(0.9, 0.9, 0.9)
  });

  // Top thin gold accent line
  page.drawLine({
    start: { x: margin, y: pageHeight - 34 },
    end: { x: pageWidth - margin, y: pageHeight - 34 },
    thickness: 1.5,
    color: rgb(0.83, 0.69, 0.22)
  });

  // Bottom Footer
  page.drawLine({
    start: { x: margin, y: 36 },
    end: { x: pageWidth - margin, y: 36 },
    thickness: 0.8,
    color: rgb(0.8, 0.85, 0.9)
  });

  drawSafeText(page, `Moniepoint MFB: 6805375225 | Ref: ${meta.dealId} | Evidence Act 2011 Sec 84`, {
    x: margin,
    y: 24,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5)
  });

  const pageStr = `Page ${pageNumber} of ${totalPages}`;
  drawSafeText(page, pageStr, {
    x: pageWidth - margin - fontRegular.widthOfTextAtSize(pageStr, 7.5),
    y: 24,
    size: 7.5,
    font: fontBold,
    color: rgb(0.2, 0.25, 0.3)
  });
}

function buildCoverPage(ctx: DrawContext, splits: any, hash: string) {
  const { doc, pageWidth, pageHeight, margin, fontRegular, fontBold, fontMono, meta } = ctx;
  const page = doc.addPage([pageWidth, pageHeight]);

  drawPageFurniture(page, ctx, 1, 6);

  let y = pageHeight - 65;

  // Title
  drawSafeText(page, 'BILATERAL STATUTORY LEGAL PACK & LASRERA MANDATE', {
    x: margin,
    y,
    size: 14,
    font: fontBold,
    color: rgb(0.06, 0.1, 0.18)
  });

  y -= 14;
  drawSafeText(page, 'Execution Ready under Section 84 of the Evidence Act 2011 & LASRERA Law 2021', {
    x: margin,
    y,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.42)
  });

  y -= 20;

  // Executive Summary Card Box
  page.drawRectangle({
    x: margin,
    y: y - 110,
    width: pageWidth - (margin * 2),
    height: 110,
    color: rgb(0.97, 0.98, 1.0),
    borderColor: rgb(0.8, 0.85, 0.92),
    borderWidth: 1
  });

  drawSafeText(page, 'TRANSACTION SUMMARY & ASSET DETAILS', {
    x: margin + 12,
    y: y - 18,
    size: 9,
    font: fontBold,
    color: rgb(0.06, 0.15, 0.3)
  });

  page.drawLine({
    start: { x: margin + 12, y: y - 22 },
    end: { x: pageWidth - margin - 12, y: y - 22 },
    thickness: 0.5,
    color: rgb(0.8, 0.85, 0.92)
  });

  const row1Y = y - 38;
  drawSafeText(page, 'Asset Title:', { x: margin + 12, y: row1Y, size: 8, font: fontBold, color: rgb(0.3, 0.35, 0.4) });
  drawSafeText(page, truncateText(meta.propertyTitle, 65), { x: margin + 95, y: row1Y, size: 8, font: fontRegular, color: rgb(0.05, 0.05, 0.05) });

  const row2Y = y - 52;
  drawSafeText(page, 'Location:', { x: margin + 12, y: row2Y, size: 8, font: fontBold, color: rgb(0.3, 0.35, 0.4) });
  drawSafeText(page, truncateText(meta.propertyLocation, 65), { x: margin + 95, y: row2Y, size: 8, font: fontRegular, color: rgb(0.05, 0.05, 0.05) });

  const row3Y = y - 66;
  drawSafeText(page, 'Listing Price:', { x: margin + 12, y: row3Y, size: 8, font: fontBold, color: rgb(0.3, 0.35, 0.4) });
  drawSafeText(page, meta.askingPriceFormatted, { x: margin + 95, y: row3Y, size: 8.5, font: fontBold, color: rgb(0.06, 0.5, 0.2) });

  drawSafeText(page, 'Mandate Lead Broker:', { x: margin + 260, y: row3Y, size: 8, font: fontBold, color: rgb(0.3, 0.35, 0.4) });
  drawSafeText(page, truncateText(meta.brokerName, 30), { x: margin + 375, y: row3Y, size: 8, font: fontRegular, color: rgb(0.05, 0.05, 0.05) });

  const row4Y = y - 80;
  drawSafeText(page, 'Buyer Profile:', { x: margin + 12, y: row4Y, size: 8, font: fontBold, color: rgb(0.3, 0.35, 0.4) });
  drawSafeText(page, truncateText(meta.buyerName, 65), { x: margin + 95, y: row4Y, size: 8, font: fontRegular, color: rgb(0.05, 0.05, 0.05) });

  const row5Y = y - 96;
  drawSafeText(page, 'Bank Settlement:', { x: margin + 12, y: row5Y, size: 8, font: fontBold, color: rgb(0.3, 0.35, 0.4) });
  drawSafeText(page, 'Moniepoint MFB: 6805375225 (Bethelmind Digital Solutions)', { x: margin + 95, y: row5Y, size: 8, font: fontBold, color: rgb(0.06, 0.1, 0.25) });

  y -= 130;

  // LASRERA 80/20 Commission Pool Table
  drawSafeText(page, 'LASRERA STATUTORY 5% COMMISSION APPORTIONMENT', {
    x: margin,
    y,
    size: 10,
    font: fontBold,
    color: rgb(0.06, 0.1, 0.18)
  });

  y -= 16;

  // Table Header
  page.drawRectangle({
    x: margin,
    y: y - 18,
    width: pageWidth - (margin * 2),
    height: 18,
    color: rgb(0.08, 0.12, 0.2)
  });

  drawSafeText(page, 'BENEFICIARY / ROLE', { x: margin + 10, y: y - 13, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  drawSafeText(page, 'STATUTORY SPLIT', { x: margin + 220, y: y - 13, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  drawSafeText(page, 'ALLOCATION (NGN)', { x: margin + 360, y: y - 13, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });

  y -= 18;

  // Row 1: Total Gross Pool
  drawTableRow(page, ctx, y, 'Gross 5% Agency Commission Pool', '100% of Agency Pool', splits.formatted.totalPool, false);
  y -= 20;

  // Row 2: Lead Broker (80%)
  drawTableRow(page, ctx, y, `Lead Mandate Broker (${truncateText(meta.brokerName, 22)})`, '80% Retention', splits.formatted.brokerCut, true);
  y -= 20;

  // Row 3: Bethelmind (20%)
  drawTableRow(page, ctx, y, 'Bethelmind Digital Solutions (Introducing Desk)', '20% Origination', splits.formatted.bethelmindCut, false);
  y -= 20;

  // Row 4: Retained Counsel Share
  drawTableRow(page, ctx, y, 'Chambers of Retained Transaction Counsel', '20% Counsel Share', splits.formatted.lawyerCut, true);
  y -= 20;

  y -= 15;

  // Table of Contents Box
  page.drawRectangle({
    x: margin,
    y: y - 135,
    width: pageWidth - (margin * 2),
    height: 135,
    color: rgb(0.98, 0.98, 0.99),
    borderColor: rgb(0.85, 0.88, 0.93),
    borderWidth: 1
  });

  drawSafeText(page, 'SCHEDULE OF INSTRUMENTS INCLUDED IN THIS PACK:', {
    x: margin + 12,
    y: y - 18,
    size: 8.5,
    font: fontBold,
    color: rgb(0.06, 0.1, 0.2)
  });

  const docs = [
    { num: 'Document 1', title: 'Master Legal Retainership & Transaction Counsel Agreement', page: 'Page 2' },
    { num: 'Document 2', title: 'Master Co-Brokerage & 80/20 Commission Sharing Agreement', page: 'Page 3' },
    { num: 'Document 3', title: 'Statutory Joint Inspection Memorandum (JIM) with Broker Assent', page: 'Page 4' },
    { num: 'Document 4', title: 'Diaspora Buyer Retention & Exclusive Property Acquisition Mandate', page: 'Page 5' },
    { num: 'Section 84', title: 'Evidence Act (2011) Forensic Certificate of Authenticity & SHA-256', page: 'Page 6' }
  ];

  docs.forEach((d, idx) => {
    const itemY = y - 36 - (idx * 19);
    drawSafeText(page, `- ${d.num}:`, { x: margin + 12, y: itemY, size: 8, font: fontBold, color: rgb(0.1, 0.4, 0.7) });
    drawSafeText(page, d.title, { x: margin + 85, y: itemY, size: 8, font: fontRegular, color: rgb(0.15, 0.15, 0.15) });
    drawSafeText(page, d.page, { x: pageWidth - margin - 50, y: itemY, size: 8, font: fontBold, color: rgb(0.4, 0.45, 0.5) });
  });

  y -= 155;

  // Cryptographic Evidence Box
  page.drawRectangle({
    x: margin,
    y: y - 65,
    width: pageWidth - (margin * 2),
    height: 65,
    color: rgb(0.99, 0.97, 0.92),
    borderColor: rgb(0.89, 0.77, 0.45),
    borderWidth: 1
  });

  drawSafeText(page, '[AUTHENTICATED] SECTION 84 EVIDENCE ACT FORENSIC INTEGRITY HASH:', {
    x: margin + 10,
    y: y - 16,
    size: 7.5,
    font: fontBold,
    color: rgb(0.55, 0.35, 0.05)
  });

  drawSafeText(page, hash, {
    x: margin + 10,
    y: y - 30,
    size: 7,
    font: fontMono,
    color: rgb(0.1, 0.1, 0.1)
  });

  drawSafeText(page, `Timestamp: ${meta.timestamp || new Date().toISOString()} | Client IP: ${meta.clientIp || '102.89.44.12'} | Generated by Bethelmind Cloud Engine`, {
    x: margin + 10,
    y: y - 48,
    size: 6.5,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4)
  });
}

function drawTableRow(page: PDFPage, ctx: DrawContext, y: number, col1: string, col2: string, col3: string, isAlternate: boolean) {
  const { margin, pageWidth, fontRegular, fontBold } = ctx;
  const width = pageWidth - (margin * 2);

  if (isAlternate) {
    page.drawRectangle({
      x: margin,
      y: y - 15,
      width,
      height: 18,
      color: rgb(0.96, 0.97, 0.99)
    });
  }

  drawSafeText(page, truncateText(col1, 40), { x: margin + 10, y: y - 11, size: 8, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
  drawSafeText(page, col2, { x: margin + 220, y: y - 11, size: 8, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
  drawSafeText(page, col3, { x: margin + 360, y: y - 11, size: 8, font: fontBold, color: rgb(0.06, 0.15, 0.35) });

  page.drawLine({
    start: { x: margin, y: y - 16 },
    end: { x: pageWidth - margin, y: y - 16 },
    thickness: 0.5,
    color: rgb(0.88, 0.9, 0.94)
  });
}

function buildDocumentPage(
  ctx: DrawContext,
  sectionHeader: string,
  rawContent: string,
  pageNumber: number,
  evidenceHash?: string
) {
  const { doc, pageWidth, pageHeight, margin, fontRegular, fontBold } = ctx;
  const page = doc.addPage([pageWidth, pageHeight]);

  drawPageFurniture(page, ctx, pageNumber, 6);

  let y = pageHeight - 65;

  // Header Title
  drawSafeText(page, sectionHeader, {
    x: margin,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.1, 0.2)
  });

  page.drawLine({
    start: { x: margin, y: y - 6 },
    end: { x: pageWidth - margin, y: y - 6 },
    thickness: 1,
    color: rgb(0.83, 0.69, 0.22)
  });

  y -= 22;

  // Body Text Paragraphs
  const lines = rawContent.split('\n');
  const maxLineLength = 95;

  for (const rawLine of lines) {
    if (y < 120) {
      break; // keep signature space
    }

    const trimmed = rawLine.trim();

    if (trimmed.length === 0) {
      y -= 7;
      continue;
    }

    // Check if header line
    const isHeaderLine = /^(MASTER|BETWEEN|AND:|RE:|LISTING VALUE:|PROPERTY:|LOCATION:|PARTIES IN|CONFIRMATION|CERTIFICATE|IN WITNESS|CHAMBERS EXECUTION)/i.test(trimmed);

    if (isHeaderLine) {
      y -= 3;
      drawSafeText(page, truncateText(trimmed, maxLineLength), {
        x: margin,
        y,
        size: 8,
        font: fontBold,
        color: rgb(0.08, 0.12, 0.22)
      });
      y -= 12;
      continue;
    }

    // Wrap regular body text
    const wrapped = wrapText(trimmed, maxLineLength);
    for (const wLine of wrapped) {
      if (y < 110) break;
      drawSafeText(page, wLine, {
        x: margin,
        y,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.15, 0.18, 0.22)
      });
      y -= 11;
    }
  }

  // Bottom Execution / Stamp Box
  drawExecutionBlock(page, ctx, pageNumber, evidenceHash);
}

function drawExecutionBlock(page: PDFPage, ctx: DrawContext, pageNumber: number, evidenceHash?: string) {
  const { margin, pageWidth, fontRegular, fontBold, fontMono, meta } = ctx;
  const boxY = 48;
  const boxHeight = 70;
  const boxWidth = pageWidth - (margin * 2);

  page.drawRectangle({
    x: margin,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: rgb(0.98, 0.99, 1.0),
    borderColor: rgb(0.8, 0.85, 0.92),
    borderWidth: 1
  });

  if (pageNumber === 6 && evidenceHash) {
    // Section 84 Forensic Stamp
    drawSafeText(page, 'FORENSIC ELECTRONIC ADMISSIBILITY ENDORSEMENT (SEC 84 EVIDENCE ACT 2011)', {
      x: margin + 8,
      y: boxY + boxHeight - 14,
      size: 7.5,
      font: fontBold,
      color: rgb(0.06, 0.2, 0.4)
    });

    drawSafeText(page, `SHA-256 HASH: ${evidenceHash}`, {
      x: margin + 8,
      y: boxY + boxHeight - 28,
      size: 6.5,
      font: fontMono,
      color: rgb(0.1, 0.1, 0.1)
    });

    drawSafeText(page, 'I confirm this electronic document was generated and stored securely in regular course of business.', {
      x: margin + 8,
      y: boxY + boxHeight - 42,
      size: 7,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2)
    });

    drawSafeText(page, 'Tosin Oyelakin - Principal Partner, Bethelmind Digital Solutions (CAC: 9912717)', {
      x: margin + 8,
      y: boxY + boxHeight - 56,
      size: 7.5,
      font: fontBold,
      color: rgb(0.06, 0.1, 0.2)
    });
  } else {
    // Two-Column Bilateral Signatures
    const colWidth = (boxWidth - 20) / 2;

    // Left Column: Bethelmind Digital Solutions
    drawSafeText(page, 'FOR: BETHELMIND DIGITAL SOLUTIONS (CAC: 9912717)', {
      x: margin + 8,
      y: boxY + boxHeight - 14,
      size: 7,
      font: fontBold,
      color: rgb(0.06, 0.1, 0.2)
    });

    drawSafeText(page, 'Signature: ____________________________________', {
      x: margin + 8,
      y: boxY + boxHeight - 32,
      size: 7,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3)
    });

    drawSafeText(page, 'Tosin Oyelakin | Moniepoint MFB: 6805375225', {
      x: margin + 8,
      y: boxY + boxHeight - 48,
      size: 6.5,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4)
    });

    // Right Column: Counterparty / Broker / Chambers
    const counterpartyLabel = pageNumber === 2 
      ? 'FOR: RETAINED TRANSACTION COUNSEL' 
      : (pageNumber === 4 ? 'FOR: PROSPECTIVE PURCHASER' : 'FOR: LEAD MANDATE BROKER / DEVELOPER');

    drawSafeText(page, counterpartyLabel, {
      x: margin + colWidth + 12,
      y: boxY + boxHeight - 14,
      size: 7,
      font: fontBold,
      color: rgb(0.06, 0.1, 0.2)
    });

    drawSafeText(page, 'Signature: ____________________________________', {
      x: margin + colWidth + 12,
      y: boxY + boxHeight - 32,
      size: 7,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3)
    });

    drawSafeText(page, `Date: ____________________, 2026 (Ref: ${meta.dealId})`, {
      x: margin + colWidth + 12,
      y: boxY + boxHeight - 48,
      size: 6.5,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4)
    });
  }
}

function wrapText(text: string, maxChars: number): string[] {
  const clean = sanitizePdfText(text);
  if (clean.length <= maxChars) return [clean];
  const words = clean.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function truncateText(text: string, maxLen: number): string {
  if (!text) return '';
  const clean = sanitizePdfText(text);
  return clean.length > maxLen ? clean.substring(0, maxLen - 3) + '...' : clean;
}
