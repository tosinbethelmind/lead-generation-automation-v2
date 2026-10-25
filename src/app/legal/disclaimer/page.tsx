/**
 * @file src/app/legal/disclaimer/page.tsx
 * Comprehensive Sector Tools, Calculators & Algorithmic Estimator Disclaimer
 * Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise, RC 7034297)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, Scale, CheckCircle2, Lock, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sector Tools & Calculation Disclaimers | Bethelmind Digital Solutions',
  description: 'Official statutory disclaimers, engineering limitations, and non-binding calculation policies for all Bethelmind sector tools and calculators.',
};

export default function CalculatorDisclaimerPage() {
  return (
    <div className="legal-content">
      {/* Header Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#d4af37', fontSize: '0.75rem', fontWeight: 700, marginBottom: 20 }}>
        <Scale style={{ width: 14, height: 14 }} />
        <span>Statutory Calculation & Engineering Disclaimer</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#ffffff', margin: '0 0 10px', lineHeight: 1.2 }}>
        Sector Tools & Calculation Accuracy Policy
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 28, lineHeight: 1.6 }}>
        <strong>Entity:</strong> Bethelmind Digital Solutions (CAC Certified Enterprise · RC 7034297 · Federal Republic of Nigeria)<br />
        <strong>Last Updated & Enforced:</strong> Q4 2026
      </p>

      {/* Prominent Summary Alert Box */}
      <div style={{ background: 'rgba(212, 175, 55, 0.06)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 16, padding: '18px 22px', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <AlertTriangle style={{ width: 22, height: 22, color: '#d4af37', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.7 }}>
            <strong style={{ color: '#ffffff' }}>IMPORTANT STATUTORY NOTICE:</strong> All interactive calculators, Bill of Quantities (BOQ) auto-generators, customs duty sizers, survey amortization modules, procedure co-pay calculators, and automated PDF estimates published on this website or embedded across client sites are <strong style={{ color: '#d4af37' }}>preliminary mathematical simulations provided strictly for educational, administrative, and initial commercial quotation purposes</strong>. They do not constitute certified engineering blueprints, official government customs assessments, formal legal title conveyances, medical diagnoses, or licensed financial advice.
          </div>
        </div>
      </div>

      <h2>1. Technology Provider Status & Professional Scope</h2>
      <p>
        Bethelmind Digital Solutions operates strictly as a <strong>software technology, web development, and workflow automation enterprise</strong>. Bethelmind Digital Solutions is not:
      </p>
      <ul>
        <li>A licensed professional engineering firm or electrical contractor (Council for the Regulation of Engineering in Nigeria — COREN);</li>
        <li>A licensed customs clearing agent or freight forwarding body (Council for the Regulation of Freight Forwarding in Nigeria — CRFFN);</li>
        <li>A registered land surveying authority (Surveyors Council of Nigeria — SURCON);</li>
        <li>A licensed medical clinic, health maintenance organization, or medical practitioner (Medical and Dental Council of Nigeria — MDCN);</li>
        <li>A licensed legal practitioner or law firm (Nigerian Bar Association — NBA / Supreme Court of Nigeria);</li>
        <li>A licensed tax advisory firm (Chartered Institute of Taxation of Nigeria — CITN / Institute of Chartered Accountants of Nigeria — ICAN); or</li>
        <li>A financial advisory firm or investment manager (Securities and Exchange Commission — SEC / Central Bank of Nigeria — CBN).</li>
      </ul>
      <p>
        Use of our sector calculation engines does not establish a professional-client relationship beyond that of a software service subscriber.
      </p>

      <h2>2. Sector-Specific Calculation Disclaimers</h2>

      <h3>A. Solar Energy & Inverter Bill of Quantities (BOQ) Sizer</h3>
      <p>
        The Solar &amp; Inverter BOQ Generator models nominal solar PV wattage, hybrid inverter kVA ratings, 51.2V LiFePO4 battery storage, and DisCo Band A/B tariff avoidance based on standard appliance consumption benchmarks in Nigeria. Users expressly acknowledge that:
      </p>
      <ul>
        <li><strong>Physical Load Audit Required:</strong> Appliance inrush currents (e.g., compressor start-up loads for non-inverter air conditioners and pumping machines) vary significantly. A physical on-site clamp meter audit by a certified solar installer is mandatory prior to procurement or installation.</li>
        <li><strong>Environmental Factors:</strong> Actual solar panel output depends upon solar irradiance, ambient rooftop temperature, roof pitch and orientation, dust accumulation (harmattan conditions), and shading.</li>
        <li><strong>Battery Cycle Life &amp; Depth of Discharge:</strong> Usable backup hours are modeled at nominal 80% to 90% Depth of Discharge (DoD). Operating beyond manufacturer battery specifications will degrade cell lifespan.</li>
        <li><strong>Price Fluctuations:</strong> Equipment costs for Tier-1 solar panels, MPPT hybrid inverters, and lithium battery packs fluctuate based on foreign exchange (FX) rates and logistics tariffs. Quotations generated by the tool represent indicative market pricing and do not constitute a price lock until an official proforma invoice is issued.</li>
      </ul>

      <h3>B. Tokunbo VIN Customs Duty &amp; Port Landing Sizer</h3>
      <p>
        The Automotive Customs Duty Calculator simulates statutory customs import duty (20%), National Automotive Council (NAC) levy (15%), and Value Added Tax (VAT 7.5%) in alignment with the Nigeria Customs Service (NCS) Common External Tariff (CET) and official CBN customs clearance FX benchmarks. Users expressly acknowledge that:
      </p>
      <ul>
        <li><strong>Official NCS Valuation Matrix:</strong> Final statutory duty payable at PTML, Tin Can Island, or Apapa port is determined exclusively by the Nigeria Customs Service upon physical examination and Electronic Single Goods Declaration (SGD) assessment.</li>
        <li><strong>Port Terminal &amp; Demurrage Variations:</strong> Shipping line charges, terminal storage demurrage, terminal handling charges (THC), and inspection fees are determined by private terminal operators and shipping lines and are subject to storage duration and operational delays.</li>
        <li><strong>Regulatory Adjustments:</strong> Official customs exchange rates (NCS clearance FX rate) and benchmark valuations change periodically by federal directive without notice.</li>
      </ul>

      <h3>C. Real Estate Plot Layout, Survey Levies &amp; Mortgage Amortizer</h3>
      <p>
        The Real Estate Plot Layout &amp; Survey Amortizer computes standard 300 sqm (Half Plot) and 500/600 sqm (Full Plot) land allocation ratios, registered survey (Red Copy) estimates, Deed of Assignment charges, and installment schedules. Users expressly acknowledge that:
      </p>
      <ul>
        <li><strong>Title Verification:</strong> Land calculation estimates do not certify or guarantee land title authenticity, absence of government acquisition, Gazette status, Governor&apos;s Consent, or Certificate of Occupancy (C of O). Buyers must conduct independent legal searches at the relevant State Land Bureau.</li>
        <li><strong>Surveyor Stamp:</strong> Plot coordinates and boundary layouts generated in prototypes do not constitute a beacon coordinate chart approved by a registered surveyor (SURCON).</li>
      </ul>

      <h3>D. Clinic HMO Claims &amp; Procedure Co-Pay Reconciler</h3>
      <p>
        The Clinic HMO Reconciler estimates procedure co-pay schedules, HMO procedure tariff caps, and surgical admission deposits. Users acknowledge that:
      </p>
      <ul>
        <li>Estimates do not constitute medical diagnosis, treatment recommendations, or clinical triage.</li>
        <li>HMO pre-authorization codes (AuthCodes) and coverage approvals are governed solely by individual patient policy limits and HMO provider agreements (e.g., Reliance, Hygeia, AXA Mansard).</li>
      </ul>

      <h3>E. Statutory PAYE, Pension &amp; Salary Take-Home Sizer</h3>
      <p>
        The Salary Take-Home Calculator illustrates statutory deductions under the Personal Income Tax Act (PITA), Consolidated Relief Allowance (CRA), 8% employee pension contribution (Pension Reform Act 2014), and National Housing Fund (NHF).
      </p>
      <ul>
        <li>The tool provides mathematical models for educational and budget planning purposes only.</li>
        <li>It does not constitute formal tax advice or certification. Employers and employees must consult a licensed tax consultant (CITN/ICAN) and verify statutory liabilities with the relevant State Internal Revenue Service (e.g., LIRS, FIRS).</li>
      </ul>

      <h3>F. Hyperlocal Logistics Freight &amp; Dispatch Sizer</h3>
      <p>
        Freight calculations represent distance-based routing models. Final waybill freight charges are subject to physical scale verification (actual weight vs. volumetric weight), goods classification, and interstate toll tariffs.
      </p>

      <h3>G. Sports Analytics, SureScore &amp; Match Predictor</h3>
      <p>
        Statistical prediction tools model historical Poisson distributions, expected goals (xG), and ELO ratings strictly for <strong>18+ recreational entertainment and analytics purposes</strong>.
      </p>
      <ul>
        <li>Bethelmind does not facilitate betting, pool betting, or financial wagers.</li>
        <li>Past statistical performance is no guarantee of future match outcomes. Bethelmind assumes zero liability for any personal financial loss incurred in connection with third-party wagering.</li>
      </ul>

      <h2>3. Non-Binding Nature of Generated Quotes &amp; PDF Estimates</h2>
      <p>
        Any PDF proposal, quotation summary, or WhatsApp message pre-filled by our tools is an <strong>invitation to treat</strong>, not a legally binding unilateral commercial contract. Binding commercial agreements are formalized only when:
      </p>
      <ol>
        <li>An authorized company representative verifies the technical scope;</li>
        <li>An official bankable commercial invoice is issued by Bethelmind Digital Solutions; and</li>
        <li>The agreed milestone deposit is received and confirmed in the corporate Moniepoint Microfinance Bank account (<code>6805375225</code> · Bethelmind Digital Solutions).</li>
      </ol>

      <h2>4. Limitation of Liability &amp; Hold Harmless</h2>
      <p>
        To the fullest extent permitted by the laws of the Federal Republic of Nigeria:
      </p>
      <ul>
        <li>Bethelmind Digital Solutions, its proprietors, software engineers, and partners shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from the use of, or inability to use, any calculation tool.</li>
        <li>This includes, without limitation, damages for loss of profits, equipment breakdown, solar battery failure, customs demurrage or penalties, tax arrears, property title defects, or third-party business disputes.</li>
        <li>The user assumes full responsibility for independently verifying all calculation outputs with relevant licensed professionals and official government bodies prior to executing financial transactions.</li>
      </ul>

      <h2>5. Governing Law &amp; Jurisdiction</h2>
      <p>
        This Policy and any dispute arising from the use of Bethelmind sector tools and calculators shall be governed exclusively by the laws of the Federal Republic of Nigeria, and shall be subject to the exclusive jurisdiction of the competent courts of Lagos State, Nigeria.
      </p>

      <h2>6. Contact &amp; Clarification</h2>
      <p>
        For inquiries regarding calculation assumptions, technical formulas, or custom commercial calibrations:
      </p>
      <p>
        <strong>Bethelmind Digital Solutions</strong><br />
        CAC Certified Enterprise · RC 7034297<br />
        Plot 12, Commercial Corridor, Lagos, Nigeria<br />
        Desk WhatsApp: <code>+234 802 279 1227</code><br />
        Corporate Settlement: Moniepoint Microfinance Bank (<code>6805375225</code>)
      </p>
    </div>
  );
}
