import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PRODUCT_FILE_MAP: Record<string, { filename: string; title: string; contentType: string }> = {
  'solar-buster': {
    filename: 'PRODUCT_1_SOLAR_TARIFF_BUSTER_MASTER_PACK.md',
    title: 'Bethelmind_Solar_Load_Sizer_And_AntiFake_Kit_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'land-dossier': {
    filename: 'PRODUCT_2_LEKKI_LAND_RISK_AND_DEMOLITION_DOSSIER.md',
    title: 'Bethelmind_Lekki_Land_Risk_And_Demolition_Dossier_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'diaspora-audit': {
    filename: 'PRODUCT_3_DIASPORA_SITE_INSPECTION_AND_VIDEO_AUDIT_PASS.md',
    title: 'Bethelmind_Diaspora_Lagos_Site_Inspection_Protocol_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'whatsapp-closer': {
    filename: 'PRODUCT_4_WHATSAPP_AI_SALES_CLOSER_AND_SCRIPTS_KIT.md',
    title: 'Bethelmind_WhatsApp_Sales_Closer_And_AutoResponder_Kit_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'sme-legal': {
    filename: 'PRODUCT_5_NIGERIAN_SME_LEGAL_SCUML_AND_CONTRACT_VAULT.md',
    title: 'Bethelmind_Nigerian_SME_Legal_SCUML_Contract_Vault_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'luxury-health': {
    filename: 'PRODUCT_6_LAGOS_AESTHETICS_AND_DENTAL_GUIDE.md',
    title: 'Bethelmind_Lagos_Aesthetics_And_Dental_Price_Index_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'china-1688': {
    filename: 'PRODUCT_7_CHINA_1688_DIRECT_SOURCING_BLUEPRINT.md',
    title: 'Bethelmind_China_1688_Direct_Sourcing_Blueprint_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'shortlet-os': {
    filename: 'PRODUCT_8_LEKKI_SHORTLET_CASHFLOW_OPERATING_OS.md',
    title: 'Bethelmind_Lekki_Shortlet_Operating_OS_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'remote-usd': {
    filename: 'PRODUCT_9_REMOTE_TECH_USD_BANKING_TAX_GUIDE.md',
    title: 'Bethelmind_Remote_Tech_USD_Banking_Tax_Vault_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'relocation-pof': {
    filename: 'PRODUCT_10_RELOCATION_PROOF_OF_FUNDS_DEFENSE_VAULT.md',
    title: 'Bethelmind_Relocation_POF_Defense_Vault_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'auto-customs': {
    filename: 'PRODUCT_11_AUTO_IMPORT_CUSTOMS_VIN_VERIFIER.md',
    title: 'Bethelmind_Auto_Import_Customs_Duty_Verifier_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'agro-export': {
    filename: 'PRODUCT_12_NON_OIL_AGRO_COMMODITY_EXPORT_DOSSIER.md',
    title: 'Bethelmind_NonOil_Agro_Commodity_Export_Dossier_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'logistics-fleet': {
    filename: 'PRODUCT_13_COMMERCIAL_LOGISTICS_DISPATCH_FLEET_OS.md',
    title: 'Bethelmind_Logistics_Dispatch_Fleet_OS_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'fmcg-placement': {
    filename: 'PRODUCT_14_FMCG_SUPERMARKET_RETAIL_PLACEMENT_BLACKBOOK.md',
    title: 'Bethelmind_Supermarket_Retail_Placement_Blackbook_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'building-boq': {
    filename: 'PRODUCT_15_LAGOS_CONSTRUCTION_MATERIAL_BOQ_SIZER.md',
    title: 'Bethelmind_Lagos_Construction_Material_BOQ_Sizer_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  },
  'b2b-proposal': {
    filename: 'PRODUCT_16_B2B_CORPORATE_PROPOSAL_TENDER_VAULT.md',
    title: 'Bethelmind_Corporate_B2B_Proposal_Tender_Vault_2026.md',
    contentType: 'text/markdown; charset=utf-8'
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const productConfig = PRODUCT_FILE_MAP[productId];

    if (!productConfig) {
      return NextResponse.json(
        { error: 'Product asset not found. Please check your download link or contact desk at 08022791227.' },
        { status: 404 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'digital-products', productConfig.filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Deliverable file is being generated. Please retry in a few moments.' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': productConfig.contentType,
        'Content-Disposition': `attachment; filename="${productConfig.title}"`,
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
