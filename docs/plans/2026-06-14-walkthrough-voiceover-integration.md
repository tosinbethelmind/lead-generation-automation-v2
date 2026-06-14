# Walkthrough Voiced Video Audio Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable audio track generation and merge it with the Playwright walkthrough video, resolving the missing voiceover audio in the demo.

**Architecture:** Playwright's `recordVideo` option only captures the visual canvas and ignores speech synthesis. We will log the start time of the test and record relative timestamps for each speech invocation. After the test finishes, a Python script will read the log, generate matching narration WAV files using `pyttsx3` (which uses the native Windows Speech API), overlay them onto a master audio track at their exact timestamps using `pydub`, and merge the master audio track with the visual WebM video using `static-ffmpeg`.

**Tech Stack:** Python 3.14, pyttsx3, pydub, audioop-lts, static-ffmpeg, Playwright, Next.js.

---

## Proposed Changes

### Configuration & Scripts

#### [MODIFY] [playwright.config.ts](file:///c:/Users/HomePC/Desktop/website%20Projects/lead%20generation%20automation/playwright.config.ts)
- Update `baseURL` from `http://localhost:3000` to `http://localhost:3005` to match the active local server port.

#### [NEW] [merge_audio.py](file:///c:/Users/HomePC/Desktop/website%20Projects/lead%20generation%20automation/scripts/merge_audio.py)
- Create a Python script that:
  - Automatically loads the `static-ffmpeg` binary paths.
  - Locates the latest `.webm` video in `test-results/`.
  - Reads `test-results/speech-log.json` to extract narration text and timestamps.
  - Uses `pyttsx3` to synthesize each text segment to a temporary WAV clip.
  - Uses `pydub` to mix and position clips at their respective elapsed times onto a silent audio track of the same duration.
  - Merges the visual WebM video and the compiled audio track using FFmpeg.
  - Overwrites the final video file at `public/assets/apexreach-demo.webm`.
  - Cleans up all temporary audio files.

#### [MODIFY] [run-demo.bat](file:///c:/Users/HomePC/Desktop/website%20Projects/lead%20generation%20automation/scripts/run-demo.bat)
- Explicitly launch Next.js on port `3005` (`npm run dev -- -p 3005`).
- Install Python requirements (`pyttsx3`, `pydub`, `static-ffmpeg`, `audioop-lts`).
- Execute `pywin32` post-installation script to register `pywintypes`.
- Run the Playwright walkthrough test.
- Execute the Python script `python scripts/merge_audio.py` to compile and merge the voiceover with the visual video.

---

### E2E Test Suite

#### [MODIFY] [demo_recorder.spec.ts](file:///c:/Users/HomePC/Desktop/website%20Projects/lead%20generation%20automation/tests/e2e/demo_recorder.spec.ts)
- Import Node's `fs` and `path` modules.
- Initialize `speech-log.json` at the start of the test.
- Update `speak()` to calculate the elapsed millisecond duration since test start and write the narration text and timestamp to `test-results/speech-log.json`.

---

## Verification Plan

### Automated Verification
1. Run `scripts/run-demo.bat` to execute the full dev server startup, headed Playwright walkthrough, offline audio synthesis, and FFmpeg merging.
2. Confirm the final merged file is saved to `public/assets/apexreach-demo.webm`.
3. Use Python or ffprobe to verify the video file has both a video stream and an audio stream with active voice tracks.

### Manual Verification
- Open the webapp dashboard on `http://localhost:3005` in the browser, play the video player, and confirm the voice narration audio matches the visual actions on the screen.
