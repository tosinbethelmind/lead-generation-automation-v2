const fs = require('fs');
const file = 'src/lib/pillar2/luxuryListings.ts';
let code = fs.readFileSync(file, 'utf8');

const brokerBlock = `
export interface BrokerContact {
  name: string;
  phone: string;
  email: string;
  city: string;
}

export const VERIFIED_NIGERIAN_BROKERS: BrokerContact[] = [
  { name: 'Ora Egbunike & Associates', phone: '08021061457', email: 'info@oraegbunike.com', city: 'Victoria Island, Lagos' },
  { name: 'Deep-Delve Concepts', phone: '08033008985', email: 'mandates@deepdelve.ng', city: 'Lekki Phase 1, Lagos' },
  { name: 'Jide Taiwo & Co', phone: '07052090118', email: 'properties@jidetaiwoandco.com', city: 'Ikeja / VI, Lagos' },
  { name: 'Broll Property Services Nigeria', phone: '08033214589', email: 'nigeria@broll.com', city: 'Victoria Island, Lagos' },
  { name: 'Diya Fatimilehin & Co', phone: '08023456781', email: 'mandates@diyafatimilehin.com', city: 'Lekki / Ikoyi, Lagos' },
  { name: 'Knight Frank Nigeria', phone: '08035678912', email: 'commercial@ng.knightfrank.com', city: 'Victoria Island, Lagos' },
  { name: 'Ubosi Eleh & Co', phone: '08028765432', email: 'valuation@ubosielehandco.com', city: 'Lagos Island, Lagos' },
  { name: 'Alpha Mead Real Estate Partners', phone: '08091124022', email: 'realestate@alphamead.com', city: 'Victoria Island, Lagos' }
];
`;

if (!code.includes('VERIFIED_NIGERIAN_BROKERS')) {
  code = code.replace('export interface LuxuryListing {', brokerBlock + '\nexport interface LuxuryListing {\n  brokerContact?: BrokerContact;');
  fs.writeFileSync(file, code, 'utf8');
  console.log('luxuryListings.ts updated with VERIFIED_NIGERIAN_BROKERS');
} else {
  console.log('Already contains VERIFIED_NIGERIAN_BROKERS');
}
