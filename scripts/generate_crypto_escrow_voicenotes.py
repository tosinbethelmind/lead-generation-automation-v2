import asyncio
import edge_tts
import os
import sys
from subprocess import run

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ffmpeg_path = os.path.join(os.path.dirname(__file__), "../node_modules/ffmpeg-static/ffmpeg.exe")

CRYPTO_VOICENOTE_TEXT = (
    "Good day Alhaji, good day Chief. This is the Bethelmind Institutional OTC Liquidity Desk in Victoria Island. "
    "We know your company already has your regular FX plug for China factory shipments. "
    "However, if you want zero rate-jumping slippage and your supplier credited in under 15 minutes, "
    "we locked today's wholesale rate at 1,375 Naira per Dollar with 100% CBN-regulated Merchant Escrow protection. "
    "Your deposit goes directly into the verified merchant escrow vault, and funds clear only after you verify the Swift MT103 confirmation receipt from your factory. "
    "Kindly reply here with your China supplier proforma invoice, and our desk will issue the official verified merchant escrow clearing account immediately. Thank you!"
)

VOICE_CONFIGS = [
    {
        "id": "crypto_escrow_female",
        "voice": "en-NG-EzinneNeural",
        "gender": "female",
        "title": "Cool Nigerian Female Treasury Officer",
        "rate": "-3%",
        "pitch": "-1Hz"
    },
    {
        "id": "crypto_escrow_male",
        "voice": "en-NG-AbeoNeural",
        "gender": "male",
        "title": "Executive Nigerian Male Desk Partner",
        "rate": "-2%",
        "pitch": "-2Hz"
    }
]

async def generate_crypto_voicenotes():
    output_dir = os.path.join(os.path.dirname(__file__), "../public/assets/audio")
    os.makedirs(output_dir, exist_ok=True)
    print("=" * 80)
    print("🎙️ GENERATING HIGH-CONVERSION NIGERIAN VOICE NOTES (FEMALE & MALE)")
    print("=" * 80)

    for cfg in VOICE_CONFIGS:
        print(f"\n[Synthesizing] {cfg['title']} ({cfg['voice']})...")
        temp_mp3 = os.path.join(output_dir, f"{cfg['id']}_temp.mp3")
        final_ogg = os.path.join(output_dir, f"{cfg['id']}.ogg")
        final_mp3 = os.path.join(output_dir, f"{cfg['id']}.mp3")
        final_wav = os.path.join(output_dir, f"{cfg['id']}.wav")

        communicate = edge_tts.Communicate(CRYPTO_VOICENOTE_TEXT, cfg['voice'], rate=cfg['rate'], pitch=cfg['pitch'])
        await communicate.save(temp_mp3)

        # Convert to WhatsApp OPUS OGG & WAV if ffmpeg available
        if os.path.exists(ffmpeg_path):
            run([ffmpeg_path, "-y", "-i", temp_mp3, "-c:a", "libopus", "-b:a", "24k", final_ogg], capture_output=True)
            run([ffmpeg_path, "-y", "-i", temp_mp3, "-c:a", "pcm_s16le", "-ar", "16000", final_wav], capture_output=True)
            run([ffmpeg_path, "-y", "-i", temp_mp3, "-c:a", "libmp3lame", "-b:a", "64k", final_mp3], capture_output=True)
            if os.path.exists(temp_mp3):
                os.remove(temp_mp3)
        else:
            if os.path.exists(temp_mp3):
                os.rename(temp_mp3, final_mp3)

        print(f"  ✓ Created: public/assets/audio/{cfg['id']}.ogg (.mp3 / .wav)")

    print("\n" + "=" * 80)
    print("✅ All Nigerian Crypto Escrow Voice Notes Generated Successfully!")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(generate_crypto_voicenotes())
