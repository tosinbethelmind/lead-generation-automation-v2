Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$outDir = Join-Path $PSScriptRoot "..\public\audio"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$clients = @(
    @{
        File = "sample_voicenote_jacio.wav";
        Text = "Good day Alhaji, management at Jacio International. This is Tosin from Bethelmind Analytics Lagos Desk. I am reaching out directly regarding your container factory shipments from China. We know traditional bank Form M takes 3 to 4 weeks, so our institutional liquidity desk has reserved and locked a wholesale rate of 1,520 Naira per Dollar for your 65,000 Dollar clearance today with guaranteed same-day supplier delivery and Providus Bank escrow safety. I have sent the official settlement breakdown below with your unique allocation reference BM-OTC-701-JACIO for your review. Let me know once you check it so we lock your batch. Thank you."
    },
    @{
        File = "sample_voicenote_maldini.wav";
        Text = "Good day Executive Team at Maldini Granites and Marble in Surulere. This is Tosin from Bethelmind Analytics Lagos Desk. I am reaching out concerning your international container freight and stone supplier wires. Rather than experiencing bank documentation bottlenecks, our desk has locked an exclusive wholesale rate of 1,520 Naira per Dollar for your 65,000 Dollar allocation with zero bank delay and full Providus Bank escrow protection. I have dropped the official proposal text below with your unique reference BM-OTC-702-MALDINI. Kindly review and let me know if we should secure this allocation for your desk today."
    },
    @{
        File = "sample_voicenote_fouani.wav";
        Text = "Good day Procurement Team at Fouani on Allen Avenue, Ikeja. This is Tosin from Bethelmind Analytics. We specialize in fast-track institutional foreign exchange settlement for major commercial electronics importers. We have secured a locked commercial rate of 1,520 Naira per Dollar for your 50,000 Dollar single-container batch today, backed by CBN-licensed Providus Bank escrow trust. Your factory receives payment within 15 minutes with official Swift proof. I have sent the complete settlement breakdown below under your reference BM-OTC-703-FOUANI. Please review and let me know to lock this batch for you."
    },
    @{
        File = "sample_voicenote_cohbs.wav";
        Text = "Good day Management at COHBS International in Ikeja. This is Tosin from Bethelmind Analytics. We provide direct institutional supplier clearance for industrial hardware importers. We have locked a special wholesale rate of 1,520 Naira per Dollar for your 35,000 Dollar supplier invoice today with full Providus Bank escrow security and same-day payment delivery to your manufacturer. Check the settlement details I just sent below under reference BM-OTC-704-COHBS, and let us get your invoice cleared today. Thank you."
    }
)

foreach ($c in $clients) {
    $wavPath = Join-Path $outDir $c.File
    $synth.SetOutputToWaveFile($wavPath)
    $synth.Speak($c.Text)
    Write-Output "GENERATED:$wavPath"
}

$synth.Dispose()
Write-Output "ALL_AUDIO_GENERATED_SUCCESS"
