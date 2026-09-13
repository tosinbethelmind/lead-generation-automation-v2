Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$outDir = Join-Path $PSScriptRoot "..\public\audio"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$wavPath = Join-Path $outDir "Bethelmind_15s_DirectAuthority_Jacio.wav"
$synth.SetOutputToWaveFile($wavPath)

$script = "Good day Alhaji, this is Tosin from Bethelmind Analytics Lagos Desk. We know your desk regularly clears container shipments from China. Rather than experiencing bank Form M delays or high black market rates, our institutional desk has reserved a locked wholesale rate of 1,520 Naira per Dollar for your 65,000 Dollar clearance today, with 15-minute factory delivery and 100 percent Providus Bank escrow protection. Drop your proforma invoice below to secure this batch today. Thank you, sir."

$synth.Speak($script)
$synth.Dispose()

Write-Output "DIRECT_AUTHORITY_AUDIO_GENERATED:$wavPath"
