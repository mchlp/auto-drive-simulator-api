class Road {
    constructor(type, start, end) {
        this.id = Road.getNextId()
        this.type = type;
        this.start = start;
        this.end = end;
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'road_' + Road.idCount;
        Road.idCount++;
        return nextId;
    }
}

module.exports = Road;
