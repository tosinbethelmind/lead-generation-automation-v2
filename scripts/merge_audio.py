import os
import sys
import json
import glob
import shutil
import subprocess
import pyttsx3
import static_ffmpeg

# Setup static-ffmpeg paths before importing pydub
static_ffmpeg.add_paths()
from pydub import AudioSegment

def find_latest_video(search_dir):
    print(f"Searching for .webm videos in: {search_dir}")
    files = []
    for root, _, filenames in os.walk(search_dir):
        for filename in filenames:
            if filename.endswith(".webm"):
                files.append(os.path.join(root, filename))
    if not files:
        return None
    # Sort by modification time, newest first
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]

def get_video_duration(video_path):
    cmd = [
        "ffprobe", 
        "-v", "quiet", 
        "-print_format", "json", 
        "-show_format", 
        video_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    data = json.loads(res.stdout)
    if "format" in data and "duration" in data["format"]:
        return float(data["format"]["duration"])
    
    print("Duration missing in header. Remuxing to temporary file to calculate duration...")
    temp_fixed = video_path + ".fixed.webm"
    try:
        subprocess.run(["ffmpeg", "-y", "-i", video_path, "-c", "copy", temp_fixed], capture_output=True, check=True)
        res = subprocess.run(["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", temp_fixed], capture_output=True, text=True, check=True)
        data = json.loads(res.stdout)
        return float(data["format"]["duration"])
    finally:
        if os.path.exists(temp_fixed):
            os.remove(temp_fixed)

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    test_results_dir = os.path.join(base_dir, "test-results")
    log_path = os.path.join(test_results_dir, "speech-log.json")
    output_path = os.path.join(base_dir, "public", "assets", "apexreach-demo.webm")

    print(f"Base Directory: {base_dir}")
    print(f"Test Results Directory: {test_results_dir}")
    print(f"Log Path: {log_path}")
    print(f"Output Path: {output_path}")

    video_path = find_latest_video(test_results_dir)
    if not video_path:
        print("Error: No walkthrough video found in test-results directory.")
        sys.exit(1)
    
    print(f"Found latest raw video: {video_path}")

    if not os.path.exists(log_path):
        print(f"Error: Speech log not found at {log_path}")
        sys.exit(1)

    print("Reading speech log...")
    with open(log_path, "r", encoding="utf-8") as f:
        speech_logs = json.load(f)

    if not speech_logs:
        print("No speech events logged. Copying raw video directly.")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        shutil.copy2(video_path, output_path)
        print("Done.")
        sys.exit(0)

    video_dur_sec = get_video_duration(video_path)
    video_dur_ms = int(video_dur_sec * 1000)
    print(f"Video duration: {video_dur_sec}s ({video_dur_ms}ms)")

    # Initialize speech engine
    print("Initializing offline TTS engine (pyttsx3)...")
    engine = pyttsx3.init()
    engine.setProperty('rate', 145)  # Moderate speaking rate for clarity

    temp_dir = os.path.join(base_dir, "temp_speech_clips")
    os.makedirs(temp_dir, exist_ok=True)

    clips = []
    try:
        # 1. Queue all synthesis requests
        print(f"Queueing {len(speech_logs)} synthesis requests...")
        for i, entry in enumerate(speech_logs):
            text = entry["text"]
            clip_name = f"clip_{i}.wav"
            clip_path = os.path.join(temp_dir, clip_name)
            engine.save_to_file(text, clip_path)

        print("Executing synthesis queue (runAndWait)...")
        engine.runAndWait()

        # Build clips list and check existence
        for i, entry in enumerate(speech_logs):
            text = entry["text"]
            timestamp = entry["timestamp"]
            clip_name = f"clip_{i}.wav"
            clip_path = os.path.join(temp_dir, clip_name)
            if os.path.exists(clip_path):
                clips.append((clip_path, timestamp))
            else:
                print(f"Warning: Failed to generate clip for: {text}")

        # 2. Compute total audio duration to avoid truncation
        max_audio_end = video_dur_ms
        loaded_clips = []
        for clip_path, timestamp in clips:
            segment = AudioSegment.from_wav(clip_path)
            # Apply slight volume boost to narration if needed
            segment = segment + 2.0  # +2dB boost
            clip_dur = len(segment)
            loaded_clips.append((segment, timestamp))
            
            end_time = timestamp + clip_dur
            if end_time > max_audio_end:
                max_audio_end = end_time

        print(f"Master audio track duration: {max_audio_end / 1000.0}s")

        # 3. Create silent master track and overlay segments
        master_audio = AudioSegment.silent(duration=max_audio_end)
        for segment, timestamp in loaded_clips:
            master_audio = master_audio.overlay(segment, position=timestamp)

        temp_master_audio = os.path.join(base_dir, "temp_master_audio.wav")
        master_audio.export(temp_master_audio, format="wav")
        print("Master narration track exported.")

        # 4. Merge visual webm and audio wav using FFmpeg
        print("Merging video and audio via FFmpeg...")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Merge command
        merge_cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", temp_master_audio,
            "-map", "0:v",
            "-map", "1:a",
            "-c:v", "copy",
            "-c:a", "libopus",  # high-quality audio codec for WebM
            "-b:a", "128k",
            output_path
        ]
        
        res = subprocess.run(merge_cmd, capture_output=True, text=True)
        if res.returncode == 0:
            print(f"Walkthrough video successfully created with audio: {output_path}")
        else:
            print("Error: FFmpeg merge failed.")
            print("STDOUT:")
            print(res.stdout)
            print("STDERR:")
            print(res.stderr)
            sys.exit(1)

    finally:
        # 5. Clean up temporary files
        print("Cleaning up temporary synthesis clips...")
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        temp_master_audio = os.path.join(base_dir, "temp_master_audio.wav")
        if os.path.exists(temp_master_audio):
            os.remove(temp_master_audio)
        print("Cleanup complete.")

if __name__ == "__main__":
    main()
