#!/bin/bash

cleanup() {
    echo "Cleaning up and killing processes..."
    
    # Kill the processes
    killall gst-launch-1.0   
    sudo killall python3
    killall python3
    exit 0
}

# Start ESC controller
sudo /usr/bin/python3 /home/ye/rc/steering/script.py &

# Start gst-launch pipeline
gst-launch-1.0 v4l2src device=/dev/video0 ! image/jpeg, width=1024, height=768, framerate=30/1 ! jpegdec ! videoconvert ! videoscale ! video/x-raw, width=430, height=254 ! jpegenc quality=40 ! rtpjpegpay ! udpsink host=172.26.24.83 port=5000

trap cleanup EXIT

# Wait for user to press Enter key
read -p "Press Enter to stop the processes..."

# Clean up and kill processes when Enter key is pressed
cleanup

