'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';

interface VoiceNotePlayerProps {
  businessName: string;
  category?: string;
  area?: string;
  audioUrl?: string;
  adminPhone?: string;
}

export default function VoiceNotePlayer({
  businessName,
  category = 'Commercial Enterprise',
  area = 'Lagos',
  audioUrl = '/audio/Bethelmind_15s_Nigerian_Female_Jacio.mp3',
  adminPhone = '2348022791227'
}: VoiceNotePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(35);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const waPreFillText = encodeURIComponent(
    `Hello Bethelmind Desk, I just listened to the voice note for ${businessName} in ${area}. We want to activate our 24/7 AI WhatsApp customer closer and Moniepoint payment checkout.`
  );
  const waUrl = `https://wa.me/${adminPhone}?text=${waPreFillText}`;

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/80 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] text-white backdrop-blur-md transition-all hover:border-emerald-500/50">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs md:text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Executive Audio Briefing for {businessName}
          </span>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
          Ezinne Neural Voice (Lagos Desk)
        </span>
      </div>

      {/* Main Player Row */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 hover:from-emerald-500 hover:to-teal-300 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 focus:outline-none"
          title={isPlaying ? 'Pause Audio' : 'Play Audio Briefing'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current text-white" />
          ) : (
            <Play className="w-6 h-6 fill-current text-white translate-x-0.5" />
          )}
        </button>

        {/* Waveform & Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span className="font-medium text-emerald-300">
              {isPlaying ? 'Playing briefing...' : 'Tap play to listen'}
            </span>
            <span className="font-mono text-slate-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Animated Waveform Visualizer */}
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              if (audioRef.current) {
                audioRef.current.currentTime = pos * duration;
              }
            }}
            className="h-7 w-full bg-slate-800/80 rounded-lg p-1 flex items-center gap-1 cursor-pointer overflow-hidden border border-slate-700/50 relative group"
          >
            {/* Background progress fill */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-emerald-500/20 pointer-events-none transition-all"
              style={{ width: `${progressPercent}%` }}
            />

            {/* Soundwave bars */}
            {[40, 65, 80, 45, 90, 75, 100, 60, 85, 50, 95, 70, 80, 55, 90, 65, 100, 45, 85, 60, 95, 75, 50, 85, 60, 40, 70, 90, 60, 45].map((height, i) => {
              const active = (i / 30) * 100 <= progressPercent;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all ${
                    active 
                      ? 'bg-gradient-to-t from-emerald-500 to-teal-300' 
                      : 'bg-slate-600/70 group-hover:bg-slate-500/80'
                  } ${isPlaying && active ? 'animate-pulse' : ''}`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="flex-shrink-0 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          {showTranscript ? 'Hide Audio Transcript' : 'Read Voice Note Transcript'}
        </button>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-sm"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          Claim Free 48-Hour Setup on WhatsApp
        </a>
      </div>

      {/* Transcript Collapsible */}
      {showTranscript && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-slate-300 text-xs leading-relaxed animate-in fade-in duration-200">
          <p className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Voice Note Transcript:
          </p>
          <p className="italic text-slate-300">
            &ldquo;Hello! Good day, this is Ezinne from Bethelmind Analytics Lagos. We analyzed {businessName}&apos;s digital operations in {area}, and we built a live 24/7 AI WhatsApp customer booking and automated quote prototype tailored specifically for {businessName}. It responds to your customer inquiries in less than 3 seconds and handles Moniepoint and Paystack payment verification automatically. Please check the link we sent to test your prototype live, or chat directly with our Lagos team at 0802 279 1227 to claim your free 48-hour setup. Thank you!&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
