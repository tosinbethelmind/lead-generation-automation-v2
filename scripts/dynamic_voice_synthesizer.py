import asyncio
import edge_tts
import os
import sys
import json
from subprocess import run

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ffmpeg_path = os.path.join(os.path.dirname(__file__), "../node_modules/ffmpeg-static/ffmpeg.exe")
audio_dir = os.path.join(os.path.dirname(__file__), "../public/assets/audio/dynamic")
os.makedirs(audio_dir, exist_ok=True)

def clean_business_name(raw_name, category=""):
    name = raw_name or ""
    name = name.split("||")[0].split("|")[0].split(" - ")[0].strip()
    name = " ".join(name.split())
    if not name or name.lower().startswith(("lead_", "mock_", "lagos_det_")):
        name = (category.capitalize() + " Enterprise") if category else "your business"
    return name

async def synthesize_lead_voice_note(lead_id, raw_name, area="Lagos", category="", voice="en-NG-EzinneNeural"):
    clean_name = clean_business_name(raw_name, category)
    clean_area = area or "Lagos"

    ogg_filename = f"vn_{lead_id}.ogg"
    mp3_filename = f"vn_{lead_id}.mp3"
    ogg_path = os.path.join(audio_dir, ogg_filename)
    mp3_path = os.path.join(audio_dir, mp3_filename)

    # Return cached if already generated and valid
    if os.path.exists(ogg_path) and os.path.getsize(ogg_path) > 10000:
        return {
            "success": True,
            "cached": True,
            "lead_id": lead_id,
            "business_name": clean_name,
            "ogg_path": ogg_path,
            "size_kb": round(os.path.getsize(ogg_path) / 1024, 1)
        }

    # Dynamic 1-to-1 Cold Calling "Revenue Leak" Closer Script (14-16s punchy direct response)
    script_text = (
        f"Hello team at {clean_name}! Tosin from Bethelmind Analytics Lagos. "
        f"We noticed prospective clients looking for your services in {clean_area} after hours "
        f"can't get instant quotes or bookings on WhatsApp. "
        f"So we actually pre-built a live 24/7 AI quoting portal specifically for {clean_name}. "
        f"I've attached your private preview link right below—tap it to test drive how it works on your phone!"
    )

    # Synthesize MP3 using edge-tts (Soft female cadence: -3% rate, -1Hz pitch)
    communicate = edge_tts.Communicate(script_text, voice, rate="-3%", pitch="-1Hz")
    await communicate.save(mp3_path)

    # Convert to native WhatsApp Opus OGG via ffmpeg
    cmd = f'"{ffmpeg_path}" -y -i "{mp3_path}" -c:a libopus -b:a 32k -vbr on -ar 48000 -ac 1 "{ogg_path}"'
    run(cmd, shell=True, check=True)

    size_kb = round(os.path.getsize(ogg_path) / 1024, 1)

    return {
        "success": True,
        "cached": False,
        "lead_id": lead_id,
        "business_name": clean_name,
        "ogg_path": ogg_path,
        "size_kb": size_kb,
        "script": script_text
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # CLI invocation: python dynamic_voice_synthesizer.py <lead_id> <name> <area> <category>
        lead_id = sys.argv[1]
        name = sys.argv[2] if len(sys.argv) > 2 else "Business Owner"
        area = sys.argv[3] if len(sys.argv) > 3 else "Lagos"
        cat = sys.argv[4] if len(sys.argv) > 4 else "Commercial"
        res = asyncio.run(synthesize_lead_voice_note(lead_id, name, area, cat))
        print(json.dumps(res))
    else:
        # Test sample lead
        res = asyncio.run(synthesize_lead_voice_note("sample_smile_best", "Smile Best Dental || Dental Clinic in Lagos", "Ikeja", "Dentist"))
        print(json.dumps(res, indent=2))
