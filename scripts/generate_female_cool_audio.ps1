Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

Write-Output "--- INSTALLED VOICES ---"
foreach ($v in $synth.GetInstalledVoices()) {
    Write-Output "Voice: $($v.VoiceInfo.Name) | Gender: $($v.VoiceInfo.Gender) | Culture: $($v.VoiceInfo.Culture)"
}

# Select Female Voice
try {
    $synth.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female)
    Write-Output "Selected Female Voice: $($synth.Voice.Name)"
} catch {
    Write-Output "Fallback voice used"
}

# Set cool, calm pacing
$synth.Rate = -1 # Slightly slower, calm & executive
$synth.Volume = 100

$outDir = Join-Path $PSScriptRoot "..\public\audio"
$wavPath = Join-Path $outDir "Bethelmind_15s_Female_Jacio.wav"
$synth.SetOutputToWaveFile($wavPath)

$script = "Good day Alhaji, this is Tosin from Bethelmind Analytics Lagos Desk. We know your desk regularly clears container shipments from China. Rather than experiencing 3-week Form M delays or high black market rates, our institutional desk has reserved a locked wholesale rate of 1,520 Naira per Dollar for your next container clearance today, with 15-minute factory delivery and 100 percent Providus Bank escrow protection. Drop your proforma invoice below to secure this batch today. Thank you, sir."

$synth.Speak($script)
$synth.Dispose()

Write-Output "FEMALE_COOL_AUDIO_GENERATED:$wavPath"
