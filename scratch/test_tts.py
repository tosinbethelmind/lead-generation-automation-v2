import pyttsx3
import os
import time

print("Initializing engine...")
engine = pyttsx3.init()
engine.setProperty('rate', 145)

print("Queueing synthesis requests...")
for i in range(5):
    engine.save_to_file(f"This is clip number {i}.", f"clip_{i}.wav")

print("Running event loop (runAndWait)...")
engine.runAndWait()

print("Verifying file sizes...")
for i in range(5):
    path = f"clip_{i}.wav"
    if os.path.exists(path):
        print(f"{path}: size={os.path.getsize(path)} bytes")
    else:
        print(f"{path}: DOES NOT EXIST")

# Clean up
print("Removing files...")
for i in range(5):
    path = f"clip_{i}.wav"
    if os.path.exists(path):
        os.remove(path)
print("Done!")
