const express = require('express');
const socketIO = require('socket.io');
const defaults = require('./defaults');
const models = require('./models');
const constants = require('./constants');

const app = express();

const port = 3001;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const io = socketIO(server);

io.on('connect', (socket) => {
    socket.emit('update-map-data', defaults.mapData);
});

const map = new models.Map();
map.addLocation(new models.Location([-500, 500]));
map.addIntersection(new models.Intersection([0, 0]));
map.addIntersection(new models.Intersection([1000, 1000]));
map.addIntersection(new models.Intersection([2500, 1000]));
map.addIntersection(new models.Intersection([-1500, 1000]));
map.addIntersection(new models.Intersection([-1500, -1500]));
map.addIntersection(new models.Intersection([-2500, 1500]));
map.addIntersection(new models.Intersection([2500, -2000]));
map.addIntersection(new models.Intersection([-2500, -2250]));
map.addIntersection(new models.Intersection([-2500, 2250]));
map.addIntersection(new models.Intersection([1000, 2250]));
map.addVehicle(new models.Vehicle([0, 0]));
const v1 = new models.Vehicle([100, 100]);
map.addVehicle(v1);
map.addVehicle(new models.Vehicle([200, 200]));
map.addVehicle(new models.Vehicle([-300, 300]));
map.addVehicle(new models.Vehicle([500, 500]));
map.addVehicle(new models.Vehicle([1200, 1200]));
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.MAJOR,
        'intersection_0',
        'intersection_1'
    )
);
map.addRoad(
    new models.Road(constants.ROAD_TYPES.MAJOR, 'location_0', 'intersection_0')
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.MINOR,
        'intersection_1',
        'intersection_2'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.MINOR,
        'intersection_1',
        'intersection_3'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.MINOR,
        'intersection_3',
        'intersection_4'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_1',
        'intersection_4'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_3',
        'intersection_5'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_2',
        'intersection_6'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_5',
        'intersection_7'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_4',
        'intersection_7'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_8',
        'intersection_5'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_8',
        'intersection_9'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_0',
        'intersection_6'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_1',
        'intersection_9'
    )
);
map.addRoad(
    new models.Road(
        constants.ROAD_TYPES.LOCAL,
        'intersection_7',
        'intersection_6'
    )
);

console.log(map);

const simulateLoop = () => {
    v1.coord[0]++;
    v1.coord[1]++;
    io.emit('update-map-data', map);
};

setInterval(simulateLoop, 5000);
