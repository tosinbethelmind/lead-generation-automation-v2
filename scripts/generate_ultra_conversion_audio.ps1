Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$outDir = Join-Path $PSScriptRoot "..\public\audio"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$wavPath = Join-Path $outDir "Bethelmind_15s_UltraConversion_Jacio.wav"
$synth.SetOutputToWaveFile($wavPath)

$script = "Good day Alhaji, this is Tosin from Bethelmind Analytics Lagos Desk. I am reaching out directly to the management at Jacio International in ASPAMDA. Quick question: are you funding any container shipments to China this week? Our institutional desk has locked 1,520 Naira per Dollar for your clearance today, with 15-minute delivery to your supplier and 100 percent bank escrow safety. Check the quick summary I sent below, or let me know if you want us to lock a test batch today. Thank you, sir."

$synth.Speak($script)
$synth.Dispose()

Write-Output "ULTRA_CONVERSION_AUDIO_GENERATED:$wavPath"
