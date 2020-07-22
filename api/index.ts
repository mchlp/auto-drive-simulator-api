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

const map = new models.Map();

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
        intersections[1],
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
        constants.ROAD_TYPES.TYPES.LOCAL,
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
        constants.ROAD_TYPES.TYPES.LOCAL,
        intersections[8],
        intersections[5]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.LOCAL,
        intersections[8],
        intersections[9]
    )
);
roads.push(
    new models.Road(
        constants.ROAD_TYPES.TYPES.LOCAL,
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

const routes: Route[] = [];
routes.push(Navigator.getRoute(intersections[6], intersections[8], map));
routes.push(Navigator.getRoute(intersections[3], intersections[5], map));
routes.push(Navigator.getRoute(intersections[0], intersections[1], map));
routes.push(Navigator.getRoute(intersections[0], intersections[8], map));

const vehicles: models.Vehicle[] = [];
vehicles.push(new models.Vehicle(routes[0], map));
vehicles.push(new models.Vehicle(routes[1], map));
vehicles.push(new models.Vehicle(routes[2], map));
vehicles.push(new models.Vehicle(routes[3], map));
vehicles.map((vehicle) => {
    map.addVehicle(vehicle);
});

const simulateLoop = () => {
    vehicles.forEach((vehicle) => {
        vehicle.update();
    });
    io.emit('update-map-data', map.serialize());
};

setInterval(simulateLoop, 1000 / 30);
