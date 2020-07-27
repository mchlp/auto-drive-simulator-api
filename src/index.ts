import express from 'express';
import socketIO from 'socket.io';
import constants from './constants';
import * as models from './models';
import fs from 'fs';

const rawMap = JSON.parse(fs.readFileSync('./maps/Map2.json').toString());

const app = express();

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const map = new models.Map(constants.ROAD_DRIVING_SIDE.RIGHT, 50);
map.importFromObject(rawMap);

const io = socketIO(server);
io.on('connect', (socket: any) => {
    socket.on('start-trip', (tripData: any) => {
        const vehicle = map.startTrip(tripData);
        if (vehicle) {
            socket.emit('start-trip-res', vehicle.serialize());
        }
    });
});

const ADD_VEHICLE_TIMEOUT = 10000;
let lastAddVehicleTime = 0;

const lastUpdateTimeElapsedList: number[] = [];
let lastUpdateTime: number | null = null;

const PRINT_UPDATES_PER_SEC_TIMEOUT = 500;
let lastPrintUpdatesPerSecTime = 0;

const simulateLoop = () => {
    const nowTime = Date.now();

    // track updates per second
    let lastUpdateTimeElapsed = 0;
    if (lastUpdateTime) {
        lastUpdateTimeElapsed = nowTime - lastUpdateTime;
    }
    lastUpdateTime = nowTime;
    lastUpdateTimeElapsedList.push(lastUpdateTimeElapsed);
    if (lastUpdateTimeElapsedList.length > 100) {
        lastUpdateTimeElapsedList.shift();
    }

    // print updates per second
    if (process.env.NODE_ENV === 'development') {
        if (
            nowTime - lastPrintUpdatesPerSecTime >
            PRINT_UPDATES_PER_SEC_TIMEOUT
        ) {
            const averageUpdateTimeElapsed =
                lastUpdateTimeElapsedList.reduce((a, b) => a + b, 0) /
                lastUpdateTimeElapsedList.length;
            const averageUpdatesPerSecond = 1000 / averageUpdateTimeElapsed;
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(
                `Avg Updates/Sec: ${averageUpdatesPerSecond.toFixed(3)}`
            );
            // console.log();
            lastPrintUpdatesPerSecTime = nowTime;
        }
    }

    // add vehicles
    if (
        nowTime - lastAddVehicleTime > ADD_VEHICLE_TIMEOUT &&
        Object.keys(map.vehicles).length < 400
    ) {
        for (let i = 0; i < 10; ++i) {
            const newOrigin = map.getRandomWaypoint();
            const newDest = map.getRandomWaypoint();
            const newVehicle = new models.Vehicle(newOrigin, newDest, map);
            map.addVehicle(newVehicle);
            newVehicle.calculateRoute();
            newVehicle.startDriving();
            lastAddVehicleTime = nowTime;

            // console.log(`origin: ${newOrigin.id} | dest: ${newDest.id}`);
        }
    }
    map.update();
    io.volatile.emit('update-map-data', map.serialize());
};

setInterval(simulateLoop, 1000 / 30);
