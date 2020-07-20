class Vehicle {
    constructor(coord) {
        this.id = Vehicle.getNextId();
        this.coord = coord;
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'vehicle_' + Vehicle.idCount;
        Vehicle.idCount++;
        return nextId;
    }
}

module.exports = Vehicle;
