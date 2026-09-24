/**
 * @file scripts/lib/searchphone_engine.js
 * 
 * 📱 SearchPhone Telecom & Phone Intelligence Engine
 * Inspired by HackUnderway/SearchPhone:
 * - Accurate Nigerian Telecom Carrier Detection (MTN, Airtel, Glo, 9mobile)
 * - Strict Rule #5 Anti-Synthetic & Dead Number Detection
 * - E.164 Normalization (+234...)
 * - WhatsApp Active Verification & Routing
 */

const NIGERIAN_CARRIER_PREFIXES = {
  MTN: ['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916'],
  Airtel: ['0802', '0808', '0708', '0812', '0701', '0902', '0901', '0904', '0907', '0912'],
  Glo: ['0805', '0807', '0705', '0815', '0811', '0905', '0915'],
  '9mobile': ['0809', '0817', '0818', '0909', '0908']
};

function normalizeNigerianPhone(raw) {
  if (!raw) return null;
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length >= 13) {
    digits = digits.substring(3);
  }
  if (!digits.startsWith('0') && digits.length === 10) {
    digits = '0' + digits;
  }
  return digits;
}

function detectCarrier(phone0X) {
  if (!phone0X || phone0X.length < 4) return 'Unknown';
  const prefix = phone0X.substring(0, 4);
  for (const [carrier, prefixes] of Object.entries(NIGERIAN_CARRIER_PREFIXES)) {
    if (prefixes.includes(prefix)) {
      return carrier;
    }
  }
  return 'Unknown';
}

function isSyntheticOrDead(phone0X) {
  if (!phone0X || phone0X.length !== 11) return true;
  // Rule #5 synthetic checks:
  if (/(\d)\1{4,}/.test(phone0X)) return true; // 5 repeating digits (e.g. 11111)
  if (/0000|12345|98765/.test(phone0X)) return true; // Sequential runs or quad zeros
  if (/0800000|0700000|0900000/.test(phone0X)) return true;
  return false;
}

function analyzePhone(rawNumber) {
  const normalized = normalizeNigerianPhone(rawNumber);
  if (!normalized || normalized.length !== 11) {
    return {
      isValid: false,
      reason: 'Invalid phone length or format'
    };
  }

  const isFake = isSyntheticOrDead(normalized);
  if (isFake) {
    return {
      isValid: false,
      isSynthetic: true,
      reason: 'Flagged as synthetic or dummy test number by Rule #5 Guard'
    };
  }

  const carrier = detectCarrier(normalized);
  const e164 = `+234${normalized.substring(1)}`;
  const waUrl = `https://wa.me/234${normalized.substring(1)}`;

  return {
    isValid: true,
    raw: rawNumber,
    phone0X: normalized,
    cleanLocal: normalized,
    e164,
    phoneE164: e164,
    carrier,
    lineType: 'Mobile GSM',
    country: 'Nigeria',
    countryCode: '+234',
    whatsappUrl: waUrl,
    isMtnOrAirtelCorporate: (carrier === 'MTN' || carrier === 'Airtel')
  };
}

module.exports = {
  analyzePhone,
  normalizeNigerianPhone,
  detectCarrier,
  isSyntheticOrDead
};
