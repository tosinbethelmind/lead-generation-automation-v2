Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$outDir = Join-Path $PSScriptRoot "..\public\audio"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$clients = @(
    @{
        File = "Bethelmind_15s_Jacio.wav";
        Text = "Good day Alhaji, management at Jacio International in ASPAMDA Trade Fair. Tosin here from Bethelmind Analytics. Why wait weeks on Form M? We have locked 1,520 Naira per Dollar for your 65,000 Dollar Guangzhou container wire today, with 15-minute delivery and 100 percent Providus Bank escrow safety. Check the quick details below with reference BM-OTC-701-JACIO and let us clear your batch today. Thank you."
    },
    @{
        File = "Bethelmind_15s_Maldini.wav";
        Text = "Good day Executive Team at Maldini Granites in Surulere. Tosin here from Bethelmind Analytics. Avoid costly bank delays for your stone supplier wires. We have locked 1,520 Naira per Dollar for your 65,000 Dollar container batch today, with 15-minute direct delivery and 100 percent bank escrow protection. Check the breakdown below under reference BM-OTC-702-MALDINI. Thank you."
    },
    @{
        File = "Bethelmind_15s_Fouani.wav";
        Text = "Good day Procurement Team at Fouani on Allen Avenue, Ikeja. Tosin here from Bethelmind Analytics. We have secured a locked commercial rate of 1,520 Naira per Dollar for your 50,000 Dollar electronics container invoice today, with 15-minute factory clearance and full institutional escrow safety. Check your proposal below under reference BM-OTC-703-FOUANI. Thank you."
    },
    @{
        File = "Bethelmind_15s_Cohbs.wav";
        Text = "Good day Management at COHBS International in Ikeja. Tosin here from Bethelmind Analytics. We have locked 1,520 Naira per Dollar for your 35,000 Dollar industrial hardware supplier invoice today, with 15-minute factory payment and 100 percent escrow security. Check your details below under reference BM-OTC-704-COHBS. Thank you."
    }
)

foreach ($c in $clients) {
    $wavPath = Join-Path $outDir $c.File
    $synth.SetOutputToWaveFile($wavPath)
    $synth.Speak($c.Text)
    Write-Output "GENERATED_UNIQUE_AUDIO:$wavPath"
}

$synth.Dispose()
Write-Output "ALL_4_UNIQUE_AUDIOS_COMPLETED"
