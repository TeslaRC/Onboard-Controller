#!/bin/bash

cleanup() {
    echo "Cleaning up and killing processes..."
    
    # Kill the processes
    sudo killall python3
    killall python3
    exit 0
}

# Start ESC controller
sudo /usr/bin/python3 /home/ye/rc/steering/script.py &

trap cleanup EXIT

# Wait for user to press Enter key
read -p "Press Enter to stop the processes..."

# Clean up and kill processes when Enter key is pressed
cleanup

