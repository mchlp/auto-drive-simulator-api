import express from 'express';
import socketIO from 'socket.io';
import constants from './constants';
import * as models from './models';
import Navigator from './engine/Navigator';
import { mapData } from './defaults';
import { Route } from './types';
import fs from 'fs';

const rawMap = JSON.parse(fs.readFileSync('./maps/Map2.json').toString());

const app = express();

const port = 3001;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const io = socketIO(server);

io.on('connect', (socket: any) => {});

const map = new models.Map(constants.ROAD_DRIVING_SIDE.RIGHT, 50);

for (const locationRaw of Object.values(rawMap.locations)) {
    const location = locationRaw as Record<string, any>;
    map.addLocation(new models.Location(location.id, location.coord));
}

for (const intersectionRaw of Object.values(rawMap.intersections)) {
    const intersection = intersectionRaw as Record<string, any>;
    map.addIntersection(
        new models.Intersection(intersection.id, intersection.coord)
    );
}

for (const roadRaw of Object.values(rawMap.roads)) {
    const road = roadRaw as Record<string, any>;
    let startWaypoint;
    if (road.start.includes('intersection')) {
        startWaypoint = map.intersections[road.start];
    } else {
        startWaypoint = map.locations[road.start];
    }

    let endWaypoint;
    if (road.end.includes('intersection')) {
        endWaypoint = map.intersections[road.end];
    } else {
        endWaypoint = map.locations[road.end];
    }
    map.addRoad(
        new models.Road(road.id, road.type, startWaypoint, endWaypoint)
    );
}

const ADD_VEHICLE_TIMEOUT = 1000;
let lastAddVehicleTime = 0;
const simulateLoop = () => {
    const nowTime = Date.now();
    if (
        nowTime - lastAddVehicleTime > ADD_VEHICLE_TIMEOUT &&
        Object.keys(map.vehicles).length < 100
    ) {
        for (let i = 0; i < 10; ++i) {
            const newOrigin = map.getRandomWaypoint();
            const newDest = map.getRandomWaypoint();
            const newVehicle = new models.Vehicle(newOrigin, newDest, map);
            map.addVehicle(newVehicle);
            newVehicle.calculateRoute();
            newVehicle.startDriving();
            lastAddVehicleTime = nowTime;

            console.log(`origin: ${newOrigin.id} | dest: ${newDest.id}`);
        }
    }
    map.update();
    io.emit('update-map-data', map.serialize());
};

setInterval(simulateLoop, 1000 / 30);
