import re

path = 'src/lib/pillar2/pillar2Engine.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace VERIFIED_NIGERIAN_BROKERS block
old_brokers = """const VERIFIED_NIGERIAN_BROKERS = [
  { name: 'Ora Egbunike & Associates', phone: '08021061457', email: 'info@oraegbunike.com', city: 'Victoria Island, Lagos' },
  { name: 'Deep-Delve Concepts', phone: '08033008985', email: 'mandates@deepdelve.ng', city: 'Lekki Phase 1, Lagos' },
  { name: 'Jide Taiwo & Co', phone: '07052090118', email: 'properties@jidetaiwoandco.com', city: 'Ikeja / VI, Lagos' },
  { name: 'Broll Property Services Nigeria', phone: '08033214589', email: 'nigeria@broll.com', city: 'Victoria Island, Lagos' },
  { name: 'Diya Fatimilehin & Co', phone: '08023456781', email: 'mandates@diyafatimilehin.com', city: 'Lekki / Ikoyi, Lagos' },
  { name: 'Knight Frank Nigeria', phone: '08035678912', email: 'commercial@ng.knightfrank.com', city: 'Victoria Island, Lagos' },
  { name: 'Ubosi Eleh & Co', phone: '08028765432', email: 'valuation@ubosielehandco.com', city: 'Lagos Island, Lagos' },
  { name: 'Alpha Mead Real Estate Partners', phone: '08091124022', email: 'realestate@alphamead.com', city: 'Victoria Island, Lagos' }
];"""

new_brokers = """const VERIFIED_NIGERIAN_BROKERS = [
  { name: 'Ora Egbunike & Associates', phone: '08038774238', email: 'info@oraegbunike.com', city: 'Victoria Island, Lagos' },
  { name: 'Deep-Delve Concepts', phone: '08033008985', email: 'mandates@deepdelve.ng', city: 'Lekki Phase 1, Lagos' },
  { name: 'Jide Taiwo & Co', phone: '07052090092', email: 'properties@jidetaiwoandco.com', city: 'Ikeja / VI, Lagos' },
  { name: 'Broll Property Services Nigeria', phone: '08033214589', email: 'nigeria@broll.com', city: 'Victoria Island, Lagos' },
  { name: 'Diya Fatimilehin & Co', phone: '09053964068', email: 'mandates@diyafatimilehin.com', city: 'Lekki / Ikoyi, Lagos' },
  { name: 'Knight Frank Nigeria', phone: '08035678912', email: 'commercial@ng.knightfrank.com', city: 'Victoria Island, Lagos' },
  { name: 'Ubosi Eleh & Co', phone: '08054797515', email: 'valuation@ubosielehandco.com', city: 'Lagos Island, Lagos' },
  { name: 'Alpha Mead Real Estate Partners', phone: '07019999343', email: 'realestate@alphamead.com', city: 'Victoria Island, Lagos' }
];"""

# Replace in content regardless of CRLF
content_norm = content.replace('\r\n', '\n')
old_norm = old_brokers.replace('\r\n', '\n')
new_norm = new_brokers.replace('\r\n', '\n')

if old_norm in content_norm:
    content_norm = content_norm.replace(old_norm, new_norm)
    print("Replaced VERIFIED_NIGERIAN_BROKERS successfully!")
else:
    print("WARNING: old_brokers not found in content!")

# Also fix line 666: const broker = VERIFIED_NIGERIAN_BROKERS[0];
old_broker_fallback = "const broker = VERIFIED_NIGERIAN_BROKERS[0];"
new_broker_fallback = """const listingIdx = PRIME_LUXURY_LISTINGS.findIndex(l => ticketId.startsWith(l.id));
      const broker = VERIFIED_NIGERIAN_BROKERS[(listingIdx >= 0 ? listingIdx : 0) % VERIFIED_NIGERIAN_BROKERS.length];"""

if old_broker_fallback in content_norm:
    content_norm = content_norm.replace(old_broker_fallback, new_broker_fallback)
    print("Replaced fallback broker selection successfully!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)
print("Done writing pillar2Engine.ts")
