import Intersection from './Intersection';
import Vehicle from './Vehicle';
import Road from './Road';
import Location from './Location';
import {
    uniqueNamesGenerator,
    Config,
    adjectives,
    names,
    colors,
} from 'unique-names-generator';

const locationTypesForName = [
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

const locationNameConfig: Config = {
    dictionaries: [names, colors, locationTypesForName],
    separator: '_',
    style: 'capital',
};

export default class Map {
    id: string;
    locations: Record<string, Location>;
    intersections: Record<string, Intersection>;
    vehicles: Record<string, Vehicle>;
    roads: Record<string, Road>;
    roadDrivingSide: string;
    safeFollowingDistance: number;

    constructor(roadDrivingSide: string, safeFollowingDistance: number) {
        this.id = Map.getNextId();
        this.locations = {};
        this.intersections = {};
        this.vehicles = {};
        this.roads = {};
        this.roadDrivingSide = roadDrivingSide;
        this.safeFollowingDistance = safeFollowingDistance;
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'map_' + Map.idCount;
        Map.idCount++;
        return nextId;
    }

    static getUniqueLocationName() {
        const rawLocationName = uniqueNamesGenerator(locationNameConfig);
        const locationNameArr = rawLocationName.split('_');
        locationNameArr[0] += "'s";
        return locationNameArr.join(' ');
    }

    startTrip(tripData: any) {
        const newOrigin = this.locations[tripData.originId];
        const newDest = this.locations[tripData.destinationId];
        if (newOrigin && newDest) {
            const newVehicle = new Vehicle(newOrigin, newDest, this);
            this.addVehicle(newVehicle);
            newVehicle.calculateRoute();
            newVehicle.startDriving();
            return newVehicle;
        }
        return null;
    }

    importFromObject(mapObj: any) {
        for (const locationRaw of Object.values(mapObj.locations)) {
            const location = locationRaw as Record<string, any>;
            if (!location.name) {
                location.name = Map.getUniqueLocationName();
            }
            this.addLocation(
                new Location(location.id, location.coord, location.name)
            );
        }

        for (const intersectionRaw of Object.values(mapObj.intersections)) {
            const intersection = intersectionRaw as Record<string, any>;
            this.addIntersection(
                new Intersection(intersection.id, intersection.coord)
            );
        }

        for (const roadRaw of Object.values(mapObj.roads)) {
            const road = roadRaw as Record<string, any>;
            let startWaypoint;
            if (road.start.includes('intersection')) {
                startWaypoint = this.intersections[road.start];
            } else {
                startWaypoint = this.locations[road.start];
            }

            let endWaypoint;
            if (road.end.includes('intersection')) {
                endWaypoint = this.intersections[road.end];
            } else {
                endWaypoint = this.locations[road.end];
            }
            this.addRoad(
                new Road(road.id, road.type, startWaypoint, endWaypoint)
            );
        }
    }

    addVehicle(newVehicle: Vehicle) {
        this.vehicles[newVehicle.id] = newVehicle;
    }

    removeVehicle(vehicle: Vehicle) {
        // console.log(`remove vehicle ${vehicle.id}`);
        delete this.vehicles[vehicle.id];
    }

    addRoad(newRoad: Road) {
        this.roads[newRoad.id] = newRoad;
    }

    addLocation(newLocation: Location) {
        this.locations[newLocation.id] = newLocation;
    }

    addIntersection(newIntersection: Intersection) {
        this.intersections[newIntersection.id] = newIntersection;
    }

    getRandomWaypoint() {
        const waypointList = [...Object.values(this.locations)];
        return waypointList[Math.floor(Math.random() * waypointList.length)];
    }

    update() {
        Object.values(this.vehicles).forEach((vehicle) => {
            vehicle.update();
        });
    }

    serialize() {
        const serializedMap: any = {};
        serializedMap.id = this.id;

        const serializeObject = (object: object) => {
            const serializedObject: Record<string, any> = {};
            Object.entries(object).forEach((entry) => {
                serializedObject[entry[0]] = entry[1].serialize();
            });
            return serializedObject;
        };

        serializedMap.locations = serializeObject(this.locations);
        serializedMap.intersections = serializeObject(this.intersections);
        serializedMap.vehicles = serializeObject(this.vehicles);
        serializedMap.roads = serializeObject(this.roads);

        return serializedMap;
    }
}
