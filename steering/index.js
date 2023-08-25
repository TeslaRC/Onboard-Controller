const { execSync, exec, spawn, kill } = require('child_process');
const { SerialPort } = require('serialport');
const soundplayer = require("sound-player");
const socketio = require('socket.io');
const osUtils = require('os-utils');
const express = require('express');
const http = require('http');
const fs = require('fs');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var cpuUsage = 0;

const resolutions = {
    0: "430x254",
    1: "537x315",
    2: "645x378",
    3: "753x441",
    4: "861x504",
    5: "969x567",
    6: "1024x598"
};

function updateCpuUsage() {
    osUtils.cpuUsage(function(v) {
        cpuUsage = v;
    });
}

setInterval(updateCpuUsage, 1000);

function usageInfo() {
    var cpu = (cpuUsage * 100).toFixed(2);
    var ram = ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2);
    var cputemp = execSync("cat /sys/devices/virtual/thermal/thermal_zone*/temp | awk 'NR==4'").toString().trim();

    return `${cpu}|${ram}|${cputemp}`;
}

const serialPort = new SerialPort({
    path: '/dev/serial/by-id/usb-Raspberry_Pi_Pico_E6614C311B6FA835-if00',
    baudRate: 9600,
})

var audio = null;

io.on("connection", function (socket) {
    console.log('Ground station connected!');

    socket.on('throttle', (data) => {
        console.log(`Received Throttle Value: ${data}`);
        serialPort.write(`${data}\n`);
    });

    socket.on('steering', (data) => {
        console.log(`Received Steering Value: ${data}`);
        let finaldata = '';
        if (data + 2001 === 2091) {
            finaldata = `${data + 2004}\n`;
        } else {
            finaldata = `${data + 2001}\n`;
        }
        serialPort.write(finaldata);
    });

    socket.on('videodata', (data) => {
        const res = data.split('|')[0];
        const qual = parseInt(data.split('|')[1]) * 10;
        let fps = parseInt(data.split('|')[2]);
        const ip = data.split('|')[3];
        if (fps === 0) {
            fps = 10;
        } else if (fps === 1) {
            fps = 20;
        } else if (fps === 2) {
            fps = 30;
        }

        console.log(`Received Video Resolution Value: ${res}`);
        console.log(`Received Video Quality Value: ${qual}`);
        console.log(`Received Video Framerate Value: ${fps}`);
        console.log(`Received Video Station IP Value: ${ip}`);
        updateGStreamerPipeline(res, qual, fps, ip);
    });

    socket.on("listsounds", () => {
        const sounds = fs.readdirSync("/home/car/rc/sound");
        const soundsString = sounds.join("|");

        socket.emit("listsounds", soundsString);
    })

    socket.on("playsound", (data) => {
        try {
            data = JSON.parse(data);
            var volume = data.volume || 100;

            audio = spawn(`ffplay`, [`-nodisp`, `-autoexit`, `-volume`, `${parseInt(volume)}`, `-nostats`, `-hide_banner`, `/home/car/rc/sound/${data.name}`]);
        } catch (e) {
            console.log(e);
        }
    })

    socket.on("stopsound", () => {
        try {
            process.kill(audio.pid);
        } catch (e) {
            console.log(e);
        }
    })

    socket.on("usage", () => {
        socket.emit("usage", usageInfo());
    });

    socket.on("disconnect", () => {
        console.log("Ground station disconnected!");
        serialPort.write(1500 + "\n");
        serialPort.write(2001 + "\n");
    });
});

function generateGStreamerPipeline(resolution, quality, framerate, ip) {
    let resw = resolution.split('x')[0];
    let resh = resolution.split('x')[1];

    console.log(`Resolution ${resolution}, quality ${quality}, framerate ${framerate}, ip ${ip}`);

    pipeline = `gst-launch-1.0 v4l2src device=/dev/video0 ! image/jpeg, width=1024, height=768, framerate=${framerate}/1 ! jpegdec ! videoconvert ! videoscale ! video/x-raw, width=${resw}, height=${resh} ! jpegenc quality=${quality} ! rtpjpegpay ! udpsink host=${ip} port=5000`

    return pipeline;
}

function updateGStreamerPipeline(resolutionIndex, quality, framerate, ip) {
    const resolution = resolutions[resolutionIndex];
    const pipeline = generateGStreamerPipeline(resolution, quality, framerate, ip);

    try {
        exec('killall gst-launch-1.0');
    } catch (e) {}

    exec(`${pipeline}`);
}

server.listen(3001, () => {
    console.log(`Server running on port 3001`);
});
