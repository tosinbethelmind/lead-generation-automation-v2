import asyncio
import edge_tts
import os
import json
import sys
from subprocess import run

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ffmpeg_path = os.path.join(os.path.dirname(__file__), "../node_modules/ffmpeg-static/ffmpeg.exe")
audio_dir = os.path.join(os.path.dirname(__file__), "../public/assets/audio/clarity_test")
os.makedirs(audio_dir, exist_ok=True)

# Test 4 distinct variations for maximum clarity and authentic Nigerian cadence
VARIATIONS = [
    {
        "id": "female_ezinne_natural_clarity",
        "title": "Nigerian Female (Ezinne) - Natural Clarity & Phrasing",
        "voice": "en-NG-EzinneNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "volume": "+10%",
        "text": (
            "Good day! This is Tosin from Bethelmind Analytics Lagos desk. "
            "We noticed that when clients look for Smile Best Dental in Ikeja after hours, "
            "they cannot get instant quotes or book appointments on WhatsApp. "
            "So our team actually custom-built a 24/7 AI quoting and booking website for Smile Best Dental. "
            "I have dropped your private preview link right below this voice note. "
            "Please tap it to test drive it directly on your phone, and let us know what you think!"
        )
    },
    {
        "id": "male_abeo_authentic_lagos",
        "title": "Nigerian Male (Abeo) - Authentic Lagos Corporate Cadence",
        "voice": "en-NG-AbeoNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "volume": "+10%",
        "text": (
            "Hello, good day! Tosin here from Bethelmind Analytics Lagos team. "
            "We noticed prospective clients looking for Smile Best Dental in Ikeja after closing hours "
            "cannot get instant quotes or book appointments on WhatsApp. "
            "So we actually built a live 24/7 AI booking portal specifically for Smile Best Dental. "
            "Your private preview link is right below. Tap it to test drive how it works on your phone!"
        )
    },
    {
        "id": "female_conversational_pidgin_touch",
        "title": "Nigerian Female (Ezinne) - Warm Conversational Flow",
        "voice": "en-NG-EzinneNeural",
        "rate": "+1%",
        "pitch": "+0Hz",
        "volume": "+15%",
        "text": (
            "Hello team at Smile Best Dental! Good day from Bethelmind Analytics in Lagos. "
            "We noticed many patients looking for your clinic in Ikeja after hours don't get instant replies on WhatsApp. "
            "So we put together a private 24/7 interactive booking and quote portal just for Smile Best Dental. "
            "The link is right below this note. Take a quick look on your phone and test how easy it is for patients to book!"
        )
    }
]

async def test_clarity():
    print("==================================================================")
    print("🎙️ GENERATING HIGH-BITRATE (64KBPS) NIGERIAN ACCENT VOICE SAMPLES")
    print("==================================================================\n")

    for item in VARIATIONS:
        mp3_path = os.path.join(audio_dir, f"{item['id']}.mp3")
        ogg_path = os.path.join(audio_dir, f"{item['id']}.ogg")

        print(f"Synthesizing: {item['title']}...")
        communicate = edge_tts.Communicate(
            item['text'],
            item['voice'],
            rate=item['rate'],
            pitch=item['pitch'],
            volume=item['volume']
        )
        await communicate.save(mp3_path)

        # High-Fidelity Broadcast Quality Opus Encoding: 64kbps, 48kHz, voice optimized
        cmd = f'"{ffmpeg_path}" -y -i "{mp3_path}" -c:a libopus -b:a 64k -vbr on -application voip -ar 48000 -ac 1 "{ogg_path}"'
        run(cmd, shell=True, check=True)

        size_kb = round(os.path.getsize(ogg_path) / 1024, 1)
        print(f"✅ Created: {item['id']}.ogg ({size_kb} KB, 64kbps Opus)\n")

    print("🎉 ALL SAMPLES GENERATED IN CRYSTAL-CLEAR 64KBPS BROADCAST OPUS!")

if __name__ == "__main__":
    asyncio.run(test_clarity())
