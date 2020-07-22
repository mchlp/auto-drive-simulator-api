import Utils from '../Utils';
import constants from '../constants';

const ComponetFinder = {};

const intersectionFinder = (mapCoordinates, mapData) => {
    for (const intersectionEntry of Object.entries(mapData.intersections)) {
        const intersectionData = intersectionEntry[1];
        const distance = Utils.getDistanceBetweenArrayCoords(
            intersectionData.coord,
            mapCoordinates
        );

        if (distance < constants.DISPLAY.INTERSECTION_RADIUS) {
            return {
                type: 'intersection',
                id: intersectionEntry[0],
                data: intersectionEntry[1],
            };
        }
    }
    return null;
};

const locationFinder = (mapCoordinates, mapData) => {
    for (const locationEntry of Object.entries(mapData.locations)) {
        const locationData = locationEntry[1];
        const distance = Utils.getDistanceBetweenArrayCoords(
            locationData.coord,
            mapCoordinates
        );

        if (distance < constants.DISPLAY.LOCATION_RADIUS) {
            return {
                type: 'location',
                id: locationEntry[0],
                data: locationEntry[1],
            };
        }
    }
    return null;
};

ComponetFinder.findComponent = (mapCoordinates, mapData) => {
    const finderFuncs = [intersectionFinder, locationFinder];
    for (const func of finderFuncs) {
        const component = func(mapCoordinates, mapData);
        if (component) {
            return component;
        }
    }
};

export default ComponetFinder;
