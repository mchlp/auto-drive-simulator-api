import Intersection from './Intersection';
import Vehicle from './Vehicle';
import Road from './Road';
import Location from './Location';

export default class Map {
    id: string;
    locations: Record<string, Location>;
    intersections: Record<string, Intersection>;
    vehicles: Record<string, Vehicle>;
    roads: Record<string, Road>;

    constructor() {
        this.id = Map.getNextId();
        this.locations = {};
        this.intersections = {};
        this.vehicles = {};
        this.roads = {};
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'map_' + Map.idCount;
        Map.idCount++;
        return nextId;
    }

    addVehicle(newVehicle: Vehicle) {
        this.vehicles[newVehicle.id] = newVehicle;
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
