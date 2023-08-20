# Onboard Controller for FPV RC Car

This repository contains the necessary scripts and code to set up an onboard controller system for an FPV RC car. The onboard controller enables real-time control of the car's throttle and steering while receiving video feed from an onboard camera.

## Table of Contents

- [Introduction](#introduction)
- [Repository Contents](#repository-contents)
- [Getting Started](#getting-started)
  - [Compatible Boards](#compatible-boards)
  - [Hardware Setup](#hardware-setup)
  - [Setting Up ZeroTier Network](#setting-up-zerotier-network)
  - [Software Installation](#software-installation)

- [Usage](#usage)
- [License](#license)

## Introduction

The onboard controller system allows you to remotely control an FPV RC car using a TeslaRC ground station. It includes scripts to stream video from an onboard camera and control the car's throttle and steering through a wireless 4G/LTE connection maintaining latency under 120ms.

## Repository Contents

- `start.sh`: A shell script that launches the video streaming and control processes.
- `steering/script.py`: A Python script for receiving throttle values from the ground station and controlling the steering servo and ESC.
- `arduino/arduino.ino`: Arduino code to control the ESC and steering servo based on received throttle values.

## Getting Started

## Compatible Boards

This project is compatible with a variety of ARM-based boards running Ubuntu, including but not limited to:
- Jetson Nano
- Raspberry Pi (various models)
- Orange Pi

These boards was tested and can effectively encode and send video from the onboard camera, providing a seamless FPV experience for your RC car.
You can use every other board that can encode and send video.

### Hardware Setup

1. Connect the necessary components to your RC car:
   - ESC (Electronic Speed Controller)
   - Steering Servo
   - Camera Module
   - Raspberry Pi Pico or other compatible board

2. Ensure the components are wired correctly according to your hardware setup&nbsp;&nbsp;&nbsp;*for pinout check arduino.ino*.


### Setting Up ZeroTier Network

1. Install the ZeroTier application on both the onboard controller (Raspberry Pi/Jetson/compatible board) and the ground station (windows pc with TeslaRC installed).

2. Create a ZeroTier network and note down the network ID.

3. Join both the onboard controller and the ground station to the ZeroTier network using their respective network IDs.

4. Make sure the onboard controller and ground station have proper access to each other within the ZeroTier network.

### Software Installation

1. Upload the `arduino/arduino.ino` code to your Arduino-compatible board.

2. Transfer the `steering/script.py` script to your Jetson Nano/Raspberry Pi or other compatible board.

3. Modify the IP address and port in the `start.sh` script to match your configuration.

4. Use the following command to make the `start.sh` script executable: `chmod +x start.sh`


## Usage

1. Execute the `start.sh` script on your Raspberry Pi Pico or compatible board to start the video streaming and control processes.

2. Launch the ground station application to control the car's throttle and steering remotely.

3. Enjoy controlling your FPV RC car with real-time video feedback!

## License

This project is licensed under the [GNU General Public License (GPL)](LICENSE). You are free to use, modify, and distribute this software according to the terms of the license.

---
