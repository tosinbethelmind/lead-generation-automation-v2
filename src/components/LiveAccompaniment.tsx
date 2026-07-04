"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { PitchDetector } from "pitchy";
import styles from "./live.module.css";

/**
 * LiveAccompaniment component captures microphone audio, detects pitch in real‑time,
 * generates piano and string accompaniment using Tone.js, and records the mixed
 * output. It provides a premium glass‑morphic UI.
 */
export default function LiveAccompaniment() {
  const [recording, setRecording] = useState(false);
  const [available, setAvailable] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const pianoSynthRef = useRef<Tone.PolySynth | null>(null);
  const stringSynthRef = useRef<Tone.Synth | null>(null);

  // Initialise Tone.js synths once
  useEffect(() => {
    Tone.start(); // unlock audio on user gesture later
    pianoSynthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    // Simple piano‑like timbre
    pianoSynthRef.current.set({ volume: -6 });
    stringSynthRef.current = new Tone.Synth({ envelope: { attack: 0.2, decay: 0.3, sustain: 0.5, release: 1 } }).toDestination();
    stringSynthRef.current.set({ volume: -8 });
    setAvailable(true);
    return () => {
      pianoSynthRef.current?.dispose();
      stringSynthRef.current?.dispose();
    };
  }, []);

  const start = async () => {
    if (!available) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    const destination = audioCtx.createMediaStreamDestination();
    destinationRef.current = destination;
    // Connect mic to destination (for recording) and to processor (for pitch)
    source.connect(destination);
    source.connect(processor);
    processor.connect(audioCtx.destination);

    const detector = PitchDetector.forFloat32Array(4096);
    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const [pitch, clarity] = detector.findPitch(input, audioCtx.sampleRate);
      if (clarity > 0.9 && pitch > 50 && pitch < 2000) {
        const midi = Math.round(Tone.Frequency(pitch, "hz").toMidi());
        // Simple accompaniment: play a chord based on the detected note
        const chord = [midi, midi + 4, midi + 7]; // major triad
        pianoSynthRef.current?.triggerAttackRelease(chord.map(n => Tone.Frequency(n, "midi").toNote()), "8n");
        // Add a sustained string note an octave lower
        stringSynthRef.current?.triggerAttackRelease(Tone.Frequency(midi - 12, "midi").toNote(), "2n");
      }
    };

    // Recording setup
    const mixedStream = destination.stream;
    const recorder = new MediaRecorder(mixedStream);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      chunksRef.current = [];
    };
    recorder.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    audioContextRef.current?.close();
    setRecording(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Live Singing Accompaniment</h2>
      <div className={styles.controls}>
        {!recording && (
          <button className={styles.button} onClick={start}>
            Start Session
          </button>
        )}
        {recording && (
          <button className={styles.buttonStop} onClick={stop}>
            Stop &amp; Save
          </button>
        )}
        {downloadUrl && (
          <a className={styles.downloadLink} href={downloadUrl} download="accompaniment.webm">
            Download Recording
          </a>
        )}
      </div>
    </div>
  );
}
