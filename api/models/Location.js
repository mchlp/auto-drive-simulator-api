class Location {
    constructor(coord) {
        this.id = Location.getNextId();
        this.coord = coord;
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'location_' + Location.idCount;
        Location.idCount++;
        return nextId;
    }
}

module.exports = Location;
