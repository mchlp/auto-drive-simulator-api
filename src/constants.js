import { names, colors, uniqueNamesGenerator } from 'unique-names-generator';

const constants = {};

constants.ROAD_DRIVING_SIDE = {
    LEFT: 'left',
    RIGHT: 'right',
};

constants.VEHICLE_STATE = {
    SPAWNED: 'spawned',
    DEPARTURE_READY: 'departure_ready',
    EN_ROUTE: 'en_route',
    ARRIVED: 'arrived',
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
    LOCATION_RADIUS: 30,
    VEHICLE_RADIUS: 10,
};

const LOCATION_NAME_TYPES_LIST = [
    'House',
    'Cottage',
    'Barn',
    'Townhouse',
    'Apartment',
    'Condo',
    'Bungalow',
    'Shop',
    'Mall',
    'Hotel',
    'Cinema',
    'Warehouse',
    'Office',
    'Laboratory',
    'Museum',
    'Library',
    'Gym',
];

const LOCATION_NAME_CONFIG = {
    dictionaries: [names, colors, LOCATION_NAME_TYPES_LIST],
    separator: '_',
    style: 'capital',
};

constants.getUniqueLocationName = () => {
    const rawLocationName = uniqueNamesGenerator(LOCATION_NAME_CONFIG);
    const locationNameArr = rawLocationName.split('_');
    locationNameArr[0] += "'s";
    return locationNameArr.join(' ');
};

export default constants;
