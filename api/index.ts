import express from 'express';
import socketIO from 'socket.io';
import constants from './constants';
import * as models from './models';
import Navigator from './engine/Navigator';
import { mapData } from './defaults';
import { Route } from './types';

const app = express();

const port = 3001;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const io = socketIO(server);

io.on('connect', (socket: any) => {});

let test;

const map = new models.Map(constants.ROAD_DRIVING_SIDE.RIGHT, 50);

const locations: models.Location[] = [];
locations.push(new models.Location([-500, 500]));
locations.map((location) => {
    map.addLocation(location);
});

const intersections = [];
intersections.push(new models.Intersection([0, 0]));
intersections.push(new models.Intersection([1000, 1000]));
intersections.push(new models.Intersection([2500, 1000]));
intersections.push(new models.Intersection([-1500, 1000]));
intersections.push(new models.Intersection([-1500, -1500]));
intersections.push(new models.Intersection([-2500, 1500]));
intersections.push(new models.Intersection([2500, -2000]));
intersections.push(new models.Intersection([-2500, -2250]));
intersections.push(new models.Intersection([-2500, 2250]));
intersections.push(new models.Intersection([1000, 2250]));
intersections.map((intersection) => {
    map.addIntersection(intersection);
});

const roads: models.Road[] = [];
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.MAJOR,
        intersections[0],
        intersections[1]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.MAJOR,
        locations[0],
        intersections[0]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.MINOR,
        intersections[1],
        intersections[2]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.MINOR,
        intersections[1],
        intersections[3]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.MINOR,
        intersections[3],
        intersections[4]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.LOCAL,
        intersections[0],
        intersections[4]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.LOCAL,
        intersections[3],
        intersections[5]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.LOCAL,
        intersections[2],
        intersections[6]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.MAJOR,
        intersections[5],
        intersections[7]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.LOCAL,
        intersections[4],
        intersections[7]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.MINOR,
        intersections[8],
        intersections[5]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.MAJOR,
        intersections[8],
        intersections[9]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.MAJOR,
        intersections[0],
        intersections[6]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.LOCAL,
        intersections[1],
        intersections[9]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.LOCAL,
        intersections[7],
        intersections[6]
    )
);

roads.map((road) => {
    map.addRoad(road);
});

const vehicles: models.Vehicle[] = [];
vehicles.push(new models.Vehicle(intersections[6], intersections[8], map));
vehicles.push(new models.Vehicle(intersections[3], intersections[5], map));
vehicles.push(new models.Vehicle(intersections[0], intersections[1], map));
vehicles.push(new models.Vehicle(intersections[0], intersections[8], map));
// vehicles.map((vehicle) => {
//     vehicle.calculateRoute();
//     vehicle.startDriving();
//     map.addVehicle(vehicle);
// });

const ADD_VEHICLE_TIMEOUT = 1000;
let lastAddVehicleTime = 0;
const simulateLoop = () => {
    const nowTime = Date.now();
    if (
        nowTime - lastAddVehicleTime > ADD_VEHICLE_TIMEOUT &&
        Object.keys(map.vehicles).length < 200
    ) {
        const newOrigin = map.getRandomWaypoint();
        const newDest = map.getRandomWaypoint();
        const newVehicle = new models.Vehicle(newOrigin, newDest, map);
        map.addVehicle(newVehicle);
        newVehicle.calculateRoute();
        newVehicle.startDriving();
        lastAddVehicleTime = nowTime;

        console.log(`origin: ${newOrigin.id} | dest: ${newDest.id}`);
    }
    map.update();
    io.emit('update-map-data', map.serialize());
};

setInterval(simulateLoop, 1000 / 30);
