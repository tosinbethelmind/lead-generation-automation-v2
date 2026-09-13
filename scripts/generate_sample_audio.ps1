Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$outDir = Join-Path $PSScriptRoot "..\public\audio"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$wavPath = Join-Path $outDir "sample_voicenote_jacio.wav"

$synth.SetOutputToWaveFile($wavPath)
$text = "Good day Alhaji, management at Jacio International. This is Tosin from Bethelmind Analytics Lagos Desk. I am reaching out directly regarding your container factory shipments from China. We know traditional bank Form M takes 3 to 4 weeks, so our institutional liquidity desk has reserved and locked a wholesale rate of 1,520 Naira per Dollar for your 65,000 Dollar clearance today with guaranteed same-day supplier delivery and Providus Bank escrow safety. I have sent the official settlement breakdown below for your review. Let me know once you check it so we lock your batch. Thank you."
$synth.Speak($text)
$synth.Dispose()

Write-Output "AUDIO_GENERATED_SUCCESS:$wavPath"
