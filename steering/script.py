import socket
import serial

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

            throttle_str = str(throttle_value) + '\n'
            serial_port.write(throttle_str.encode())

if __name__ == '__main__':
    main()
