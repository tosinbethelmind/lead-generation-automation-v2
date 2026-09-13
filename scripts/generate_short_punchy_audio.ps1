Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$outDir = Join-Path $PSScriptRoot "..\public\audio"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$wavPath = Join-Path $outDir "Bethelmind_15s_Executive_VoiceNote.wav"
$synth.SetOutputToWaveFile($wavPath)

$script = "Good day management! Tosin here from Bethelmind Analytics Lagos Desk. Why wait weeks on bank Form M or deal with black market delays? We have locked 1,520 Naira per Dollar for your China supplier invoice today, with 15-minute delivery and 100 percent Providus Bank escrow safety. Check the quick breakdown below and let us clear your batch today. Thank you."

$synth.Speak($script)
$synth.Dispose()

Write-Output "SHORT_PUNCHY_AUDIO_GENERATED:$wavPath"
