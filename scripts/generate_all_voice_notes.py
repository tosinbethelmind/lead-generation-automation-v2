import asyncio
import edge_tts
import os
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

VOICE_SCRIPTS = [
    {
        "id": "universal_followup_day2",
        "title": "Universal Day 2 Follow-Up Voice Note",
        "voice": "en-NG-AbeoNeural", # Nigerian Male Neural
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "Good day! Tosin here from the Bethelmind Analytics Lagos team. I was reviewing your business profile in Lagos and noticed you get client inquiries after hours when your desk is closed. Our team custom-built a 24/7 interactive quoting and booking portal attached to your brand so you never miss another paying customer. I just dropped your private preview link right below this voice note. Take 30 seconds to test it directly on your phone, and let me know your thoughts!"
    },
    {
        "id": "step2_permission_reply",
        "title": "Step 2 Instant Permission Response Voice Note",
        "voice": "en-NG-AbeoNeural",
        "rate": "+2%",
        "pitch": "+0Hz",
        "text": "Great connecting with you! Tosin here from Bethelmind Analytics in Lagos. Rather than sending you a long pitch, we actually built a live interactive website prototype with an automated 24/7 WhatsApp quote engine for your business. The link is right below—tap it to see how your clients can calculate prices and book appointments automatically with zero upfront commitment. Take a look!"
    },
    {
        "id": "dental_clinic_intake",
        "title": "Dental & Healthcare Patient Intake Voice Note",
        "voice": "en-NG-AbeoNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "Hello Doctor, good day! Tosin from Bethelmind Analytics Lagos. We created a private digital patient booking and consultation portal for your clinic in Lagos that syncs directly with your WhatsApp desk and verifies intake automatically. You can test the interactive patient intake system at the preview link below. Let us know if you would like us to link it to your domain!"
    },
    {
        "id": "solar_epc_calculator",
        "title": "Solar & Inverter EPC Load Sizing Voice Note",
        "voice": "en-NG-AbeoNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "Good day Engineer! Tosin from Bethelmind Analytics. We built a live interactive Solar Load and Inverter Sizing Calculator specifically branded for your company. Clients can select appliances, calculate KVA requirements, and receive a branded PDF quote on WhatsApp automatically. Test out the solar sizing calculator at the link right below and see how it captures diaspora and high-ticket buyers!"
    },
    {
        "id": "commercial_turnkey_deployment",
        "title": "Turnkey Done-For-You Website Deployment Voice Note",
        "voice": "en-NG-AbeoNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "Hello Management team, good day! Tosin here from Bethelmind Analytics Lagos desk. We completed and verified your private interactive website prototype and 24/7 WhatsApp customer quoting desk. It includes your Google Maps SEO discovery, instant Paystack or Moniepoint payments, and ₦0 upfront review. Check out the live demo at the link below and let us know what you think!"
    }
]

async def generate_audio():
    output_dir = os.path.join(os.path.dirname(__file__), "../public/assets/audio")
    os.makedirs(output_dir, exist_ok=True)

    print("==================================================================")
    print("🎙️ RECORDING & SYNTHESIZING ALL 5 NIGERIAN VOICE NOTES (EDGE-TTS)")
    print("==================================================================\n")

    manifest = []

    for item in VOICE_SCRIPTS:
        mp3_path = os.path.join(output_dir, f"{item['id']}.mp3")
        ogg_path = os.path.join(output_dir, f"{item['id']}.ogg")

        print(f"Generating: {item['title']} ({item['voice']})...")
        communicate = edge_tts.Communicate(item['text'], item['voice'], rate=item['rate'], pitch=item['pitch'])
        
        # Save as high quality MP3
        await communicate.save(mp3_path)
        
        # Also copy / save as OGG for Baileys WhatsApp PTT compatibility
        with open(mp3_path, 'rb') as f_in:
            data = f_in.read()
            with open(ogg_path, 'wb') as f_out:
                f_out.write(data)

        size_kb = round(os.path.getsize(mp3_path) / 1024, 1)
        print(f"✅ Generated: {item['id']}.mp3 ({size_kb} KB)")

        manifest.append({
            "id": item["id"],
            "title": item["title"],
            "voice": item["voice"],
            "mp3_url": f"/assets/audio/{item['id']}.mp3",
            "ogg_url": f"/assets/audio/{item['id']}.ogg",
            "text": item["text"],
            "file_size_kb": size_kb
        })

    manifest_path = os.path.join(output_dir, "voice_notes_manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)

    print(f"\n📁 Voice note manifest saved to {manifest_path}")
    print("\n🎉 ALL 5 HIGH-CONVERTING NIGERIAN VOICE NOTES RECORDED & READY!")

if __name__ == "__main__":
    asyncio.run(generate_audio())
