import asyncio
import edge_tts
import os
import sys
import json
import re
from subprocess import run

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ffmpeg_path = os.path.join(os.path.dirname(__file__), "../node_modules/ffmpeg-static/ffmpeg.exe")

def is_genuine_business(lead):
    raw_name = (lead.get('name') or '').strip()
    if not raw_name or len(raw_name) < 4:
        return False
    
    # Reject synthetic / template patterns
    reject_patterns = [
        r'premium\s+(salon|spa|dental|restaurant|auto|real|fashion)',
        r'^(rule_|instant welcome|after-hours|lead_|mock_|test|synthetic_)',
        r'template',
        r'demo\s+business',
        r'example'
    ]
    for p in reject_patterns:
        if re.search(p, raw_name, re.I):
            return False

    phone = lead.get('phone_e164') or lead.get('phone_raw') or ''
    digits = re.sub(r'\D', '', str(phone))
    if len(digits) < 10 or len(digits) > 14:
        return False
    for pat in ['0000', '1111', '8888', '9999', '123456', '666777']:
        if pat in digits:
            return False

    return True

def clean_name_for_voice(raw_name):
    name = re.sub(r'\|\|.*$', '', raw_name)
    name = re.sub(r'\|.*$', '', name)
    name = re.sub(r' - .*$', '', name)
    name = re.sub(r'\(.*?\)', '', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name[:55]

async def synthesize_one(lead, output_dir, semaphore, manifest):
    async with semaphore:
        clean_name = clean_name_for_voice(lead['name'])
        slug = re.sub(r'[^a-z0-9]+', '_', clean_name.lower()).strip('_')[:30]
        lead_id = lead.get('lead_id') or f"lead_{slug}"
        audio_filename = f"vn_{slug}"
        
        final_ogg = os.path.join(output_dir, f"{audio_filename}.ogg")
        final_mp3 = os.path.join(output_dir, f"{audio_filename}.mp3")
        temp_mp3 = os.path.join(output_dir, f"{audio_filename}_temp.mp3")

        script_text = (
            f"Good day Alhaji, good day Chief. This is the Bethelmind Institutional OTC Desk contacting the management team at {clean_name}. "
            f"We know your company already has your regular FX plug for China and Asia container shipments. "
            f"However, for {clean_name}'s factory orders today, we locked your wholesale floor rate at 1,375 Naira per Dollar, "
            f"backed 100% by institutional escrow vaults with 450 to 600 Million Naira bonded security collateral. "
            f"Our physical settlement corridors operate across Victoria Island and the Trade Fair Complex. "
            f"You get under 15-minute China factory wire clearance with official Swift MT103 confirmation before fund release. "
            f"Kindly reply here or on WhatsApp with your China supplier proforma invoice to lock your allocation immediately. Thank you!"
        )

        try:
            communicate = edge_tts.Communicate(
                script_text,
                "en-NG-EzinneNeural",
                rate="-3%",
                pitch="-1Hz"
            )
            await communicate.save(temp_mp3)

            if os.path.exists(ffmpeg_path):
                run([ffmpeg_path, "-y", "-i", temp_mp3, "-c:a", "libopus", "-b:a", "24k", final_ogg], capture_output=True)
                run([ffmpeg_path, "-y", "-i", temp_mp3, "-c:a", "libmp3lame", "-b:a", "64k", final_mp3], capture_output=True)
                if os.path.exists(temp_mp3):
                    os.remove(temp_mp3)
            else:
                if os.path.exists(temp_mp3):
                    os.rename(temp_mp3, final_mp3)

            manifest.append({
                "lead_id": lead_id,
                "business_name": clean_name,
                "category": lead.get('category', 'Commercial Importer'),
                "phone": lead.get('phone_e164') or lead.get('phone_raw'),
                "audio_url": f"/assets/audio/{audio_filename}.ogg",
                "mp3_url": f"/assets/audio/{audio_filename}.mp3"
            })
            print(f"  ✓ Synthesized for: {clean_name} -> {audio_filename}.ogg", flush=True)
        except Exception as e:
            print(f"  ⚠️ Error synthesizing {clean_name}: {e}", flush=True)
            if os.path.exists(temp_mp3):
                try: os.remove(temp_mp3)
                except: pass

async def main():
    output_dir = os.path.join(os.path.dirname(__file__), "../public/assets/audio")
    os.makedirs(output_dir, exist_ok=True)
    leads_path = os.path.join(os.path.dirname(__file__), "../local_db/leads_db.json")

    print("=" * 85, flush=True)
    print("🎙️ BATCH GENERATING UNIQUE PERSONALIZED VOICE NOTES FOR GENUINE IMPORTERS", flush=True)
    print("   Voice: Cool Nigerian Female (en-NG-EzinneNeural)", flush=True)
    print("=" * 85 + "\n", flush=True)

    # Clean up old temporary files
    for fname in os.listdir(output_dir):
        if fname.endswith("_temp.mp3") or "premium_salon" in fname or "premium_dental" in fname:
            try: os.remove(os.path.join(output_dir, fname))
            except: pass

    with open(leads_path, "r", encoding="utf-8") as f:
        all_leads = json.load(f)

    # Curate high-intent genuine commercial targets
    genuine_targets = []
    seen = set()
    for l in all_leads:
        if is_genuine_business(l):
            name = clean_name_for_voice(l['name'])
            if name not in seen:
                seen.add(name)
                genuine_targets.append(l)
                if len(genuine_targets) >= 20: # Curate top 20 verified commercial importers
                    break

    print(f"Found {len(genuine_targets)} verified commercial businesses to synthesize.\n", flush=True)

    semaphore = asyncio.Semaphore(4)
    manifest = []

    tasks = [synthesize_one(lead, output_dir, semaphore, manifest) for lead in genuine_targets]
    await asyncio.gather(*tasks)

    manifest_path = os.path.join(output_dir, "personalized_voice_notes_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print("\n" + "=" * 85, flush=True)
    print(f"✅ BATCH COMPLETE: Successfully Generated {len(manifest)} Unique Personalized Voice Notes!", flush=True)
    print(f"📄 Manifest Saved: public/assets/audio/personalized_voice_notes_manifest.json", flush=True)
    print("=" * 85, flush=True)

if __name__ == "__main__":
    asyncio.run(main())
