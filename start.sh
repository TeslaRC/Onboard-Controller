#!/bin/bash

cleanup() {
    echo "Cleaning up and killing processes..."
    sudo killall node
    killall node
    exit 0
}

# Start ESC controller
sudo node steering/index.js &

trap cleanup EXIT

# Wait for user to press Enter key
read -p "Press Enter to stop the processes..."

# Clean up and kill processes when Enter key is pressed
cleanup
