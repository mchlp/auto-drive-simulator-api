const constants = {};

constants.ROAD_DRIVING_SIDE = {
    LEFT: 'left',
    RIGHT: 'right',
};

constants.VEHICLE_STATE = {
    SPAWNED: 'spawned',
    DEPARTURE_READY: 'departure_ready',
    EN_ROUTE: 'en_route',
    ARRIVED: 'arrived'
};

constants.ROAD_TYPES = {
    TYPES: {
        LOCAL: 'LOCAL',
        MINOR: 'MINOR',
        MAJOR: 'MAJOR',
    },
    WIDTH: {
        LOCAL: 50,
        MINOR: 60,
        MAJOR: 100,
    },
};

constants.VEHICLE_DIRECTION = {
    TOWARDS_START: 'towards_start',
    TOWARDS_END: 'towards_end',
};

constants.DISPLAY = {
    INTERSECTION_RADIUS: 45,
    LOCATION_RADIUS: 30
}

export default constants;
