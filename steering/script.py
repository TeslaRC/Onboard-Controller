import socket
import serial
import subprocess
import os

# Define the resolutions and their corresponding GStreamer pipelines
resolutions = {
    0: "gst-launch-1.0 v4l2src device=/dev/video0 ! image/jpeg, width=1024, height=768, framerate=30/1 ! jpegdec ! videoconvert ! videoscale ! video/x-raw, width=430, height=254 ! jpegenc quality=40 ! rtpjpegpay ! udpsink host=172.26.24.83 port=5000",
    1: "gst-launch-1.0 v4l2src device=/dev/video0 ! image/jpeg, width=1024, height=768, framerate=30/1 ! jpegdec ! videoconvert ! videoscale ! video/x-raw, width=537, height=315 ! jpegenc quality=40 ! rtpjpegpay ! udpsink host=172.26.24.83 port=5000",
    2: "gst-launch-1.0 v4l2src device=/dev/video0 ! image/jpeg, width=1024, height=768, framerate=30/1 ! jpegdec ! videoconvert ! videoscale ! video/x-raw, width=645, height=378 ! jpegenc quality=40 ! rtpjpegpay ! udpsink host=172.26.24.83 port=5000",
    3: "gst-launch-1.0 v4l2src device=/dev/video0 ! image/jpeg, width=1024, height=768, framerate=30/1 ! jpegdec ! videoconvert ! videoscale ! video/x-raw, width=753, height=441 ! jpegenc quality=40 ! rtpjpegpay ! udpsink host=172.26.24.83 port=5000",
    4: "gst-launch-1.0 v4l2src device=/dev/video0 ! image/jpeg, width=1024, height=768, framerate=30/1 ! jpegdec ! videoconvert ! videoscale ! video/x-raw, width=861, height=504 ! jpegenc quality=40 ! rtpjpegpay ! udpsink host=172.26.24.83 port=5000",
    5: "gst-launch-1.0 v4l2src device=/dev/video0 ! image/jpeg, width=1024, height=768, framerate=30/1 ! jpegdec ! videoconvert ! videoscale ! video/x-raw, width=969, height=567 ! jpegenc quality=40 ! rtpjpegpay ! udpsink host=172.26.24.83 port=5000",
    6: "gst-launch-1.0 v4l2src device=/dev/video0 ! image/jpeg, width=1024, height=768, framerate=30/1 ! jpegdec ! videoconvert ! videoscale ! video/x-raw, width=1024, height=598 ! jpegenc quality=40 ! rtpjpegpay ! udpsink host=172.26.24.83 port=5000"
}

def update_gstreamer_pipeline(resolution_index):
    os.system("pkill gst-launch-1.0")

    pipeline = resolutions.get(resolution_index)
    if pipeline:
        subprocess.Popen(pipeline, shell=True)

def main():
    ip_address = '0.0.0.0'
    port = 12345

    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as udp_socket:
        udp_socket.bind((ip_address, port))
        print(f"Listening for data on {ip_address}:{port}")

        serial_port = serial.Serial('/dev/serial/by-id/usb-Raspberry_Pi_Pico_E6614C311B6FA835-if00', baudrate=9600)

        while True:
            data, addr = udp_socket.recvfrom(1024)
            throttle_value = int.from_bytes(data, byteorder='big')
            print(f"Received Throttle Value: {throttle_value}")

            if received_value in resolutions:
                update_gstreamer_pipeline(received_value)
            else:
                throttle_str = str(received_value) + '\n'
                serial_port.write(throttle_str.encode())


if __name__ == '__main__':
    main()
