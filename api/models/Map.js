class Map {
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

    addVehicle(newVehicle) {
        this.vehicles[newVehicle.id] = newVehicle;
    }

    addRoad(newRoad) {
        this.roads[newRoad.id] = newRoad;
    }

    addLocation(newLocation) {
        this.locations[newLocation.id] = newLocation;
    }

    addIntersection(newIntersection) {
        this.intersections[newIntersection.id] = newIntersection;
    }
}

module.exports = Map;
