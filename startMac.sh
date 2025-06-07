#!/bin/bash

# Add check for brew and sox

if [ -d ".venv" ]; then
    echo ".venv directory found."
else
    echo ".venv directory not found. Running setup script..."
    ./script/setup  # Replace this with the actual script you want to run
fi

ip=$(ipconfig getifaddr en0)
echo "Add Wyoming Satellite integration in Home Assistant with: $ip:10700"
echo "WARNING: If this errors out, delete the .venv folder if it exists and restart this script."

script/run --name "AssistHub" --uri "tcp://0.0.0.0:10700" --mic-command "rec -q -c 1 -b 16 -e signed-integer -t raw - rate 16000" --snd-command "play -q -r 22050 -c 1 -b 16 -e signed-integer -t raw -" --event-uri "tcp://127.0.0.1:8675" --awake-wav "sounds/awake.wav" &

