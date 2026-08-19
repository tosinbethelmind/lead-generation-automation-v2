import asyncio
import edge_tts
import os
import json
import sys
from subprocess import run

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ffmpeg_path = os.path.join(os.path.dirname(__file__), "../node_modules/ffmpeg-static/ffmpeg.exe")

# Soft, Warm, Highly Persuasive Female Voice Note Scripts (en-NG-EzinneNeural)
PERSUASIVE_FEMALE_SCRIPTS = [
    {
        "id": "universal_followup_day2",
        "title": "Universal Day 2 Soft Persuasive Follow-Up",
        "voice": "en-NG-EzinneNeural", # Soft Nigerian Female
        "rate": "-3%",                 # Slightly slower, calm, warm pacing
        "pitch": "-1Hz",               # Warm, smooth, grounded tone
        "text": "Hello, good day! I know how busy running a business in Lagos can be, and how easy it is to miss customer inquiries when your desk is occupied or after closing hours. My team at Bethelmind Analytics took the time to build a private interactive website prototype for your brand, complete with a 24/7 WhatsApp quoting and booking engine so you never lose another paying client. I've placed your private preview link right below this note. It is completely free to review on your phone. Please take a look whenever you have a moment, and let us know what you think!"
    },
    {
        "id": "step2_permission_reply",
        "title": "Step 2 Warm Permission Response",
        "voice": "en-NG-EzinneNeural",
        "rate": "-2%",
        "pitch": "-1Hz",
        "text": "Thank you so much for getting back to me! Rather than sending you a long pitch, we actually built a live interactive website prototype with an automated WhatsApp quote and booking engine specifically tailored for your business. The preview link is right below this note. Please tap it to test how effortlessly your clients can book and calculate quotes with zero upfront risk. We would love to hear your thoughts!"
    },
    {
        "id": "dental_clinic_intake",
        "title": "Healthcare & Dental Clinic Soft Intake",
        "voice": "en-NG-EzinneNeural",
        "rate": "-3%",
        "pitch": "-1Hz",
        "text": "Hello Doctor, good day! We know patient inquiries come in at all hours, and timely response is everything for your clinic. We created a private digital patient booking and consultation portal that attaches seamlessly to your WhatsApp desk and confirms appointments automatically. You can test the interactive patient intake system at the preview link right below. We hope this makes patient management much easier for your team!"
    },
    {
        "id": "solar_epc_calculator",
        "title": "Solar & Inverter EPC Persuasive Calculator",
        "voice": "en-NG-EzinneNeural",
        "rate": "-2%",
        "pitch": "-1Hz",
        "text": "Good day Engineer! High-ticket solar buyers love knowing their exact power requirements before making a decision. We custom-built an interactive load sizing calculator branded for your company, where clients can select their appliances, calculate KVA ratings, and receive an instant PDF quote on WhatsApp. You can test drive the calculator at the link right below. Take a quick look and see how easily it converts prospective buyers!"
    },
    {
        "id": "commercial_turnkey_deployment",
        "title": "Commercial Turnkey Done-For-You Soft Pitch",
        "voice": "en-NG-EzinneNeural",
        "rate": "-3%",
        "pitch": "-1Hz",
        "text": "Hello Management team, good day! To help your business capture more clients across Lagos, our engineering team prepared a private interactive website prototype featuring Google Maps SEO discovery and a 24/7 WhatsApp booking desk. There is zero upfront commitment—we simply wanted you to experience what an automated online portal can do for your sales. Your private preview link is attached right below. Please take a look!"
    }
]

async def generate_soft_female_audio():
    output_dir = os.path.join(os.path.dirname(__file__), "../public/assets/audio")
    os.makedirs(output_dir, exist_ok=True)

    print("==================================================================")
    print("🎙️ RECORDING SOFT, WARM & PERSUASIVE FEMALE NIGERIAN VOICE NOTES")
    print("==================================================================\n")

    manifest = []

    for item in PERSUASIVE_FEMALE_SCRIPTS:
        mp3_path = os.path.join(output_dir, f"{item['id']}.mp3")
        ogg_path = os.path.join(output_dir, f"{item['id']}.ogg")

        print(f"Generating: {item['title']} ({item['voice']} / Rate: {item['rate']})...")
        communicate = edge_tts.Communicate(item['text'], item['voice'], rate=item['rate'], pitch=item['pitch'])
        await communicate.save(mp3_path)

        # Convert to WhatsApp Opus OGG via ffmpeg
        cmd = f'"{ffmpeg_path}" -y -i "{mp3_path}" -c:a libopus -b:a 32k -vbr on -ar 48000 -ac 1 "{ogg_path}"'
        run(cmd, shell=True, check=True)

        size_ogg = round(os.path.getsize(ogg_path) / 1024, 1)
        print(f"✅ Generated & Converted: {item['id']}.ogg ({size_ogg} KB Opus)")

        manifest.append({
            "id": item["id"],
            "title": item["title"],
            "voice": item["voice"],
            "gender": "female",
            "ogg_url": f"/assets/audio/{item['id']}.ogg",
            "text": item["text"],
            "file_size_kb": size_ogg
        })

    manifest_path = os.path.join(output_dir, "voice_notes_manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)

    print(f"\n📁 Updated voice note manifest at {manifest_path}")
    print("🎉 ALL SOFT FEMALE PERSUASIVE NIGERIAN VOICE NOTES READY!")

if __name__ == "__main__":
    asyncio.run(generate_soft_female_audio())
