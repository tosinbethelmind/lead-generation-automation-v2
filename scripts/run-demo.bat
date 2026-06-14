@echo off
echo ============================================
echo  ApexReach Voiced Demo Recorder & Compiler
echo ============================================
echo.

echo Installing Python requirements...
python -m pip install pyttsx3 pydub static-ffmpeg audioop-lts
echo Running pywin32 post-installation setup...
python -c "import sys, os; os.system(f'python \"{sys.prefix}\\Scripts\\pywin32_postinstall.py\" -install')"
echo.

echo Starting Next.js dev server on port 3005...
start /B cmd /c "cd /d %~dp0.. && npm run dev -- -p 3005"
echo Waiting for server to start...
timeout /t 8 /nobreak >nul

echo.
echo Running Playwright walkthrough test...
cd /d %~dp0..
npx playwright test tests/e2e/demo_recorder.spec.ts --headed

echo.
echo Compiling and merging narration audio...
python scripts/merge_audio.py

echo.
echo ============================================
echo  Demo recording and audio compilation complete!
echo ============================================
pause
