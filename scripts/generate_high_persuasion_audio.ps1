Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$outDir = Join-Path $PSScriptRoot "..\public\audio"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$wavPath = Join-Path $outDir "sample_voicenote_high_persuasion.wav"
$synth.SetOutputToWaveFile($wavPath)

$script = "Good day Alhaji, management at Jacio International. This is Tosin from Bethelmind Analytics Lagos Desk. We understand you already have your regular exchange dealers for your China container wires. But we also know the daily headaches with regular BDC guys: unconfirmed transfers, black market price gouging, and 24 to 48 hours of delays that stall your container clearing in Guangzhou. With Bethelmind Analytics, you get three massive advantages today: First, a guaranteed wholesale rate of 1,520 Naira per Dollar, saving you up to 1.5 Million Naira on this batch. Second, your factory receives the wire in under 15 minutes with official Swift MT103 proof. And most importantly, you are 100 percent protected by our CBN-licensed Providus Bank Escrow Vault 9928371029. Your money does not go to a personal account; it is locked safely in institutional trust until your China supplier confirms receipt. You do not even have to change your regular dealer. Just test a single batch with us today and experience the speed and bank safety yourself. Check the official breakdown below under Reference BM-OTC-701-JACIO. Thank you."

$synth.Speak($script)
$synth.Dispose()

Write-Output "HIGH_PERSUASION_AUDIO_GENERATED:$wavPath"
