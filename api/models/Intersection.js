class Intersection {
    constructor(coord) {
        this.id = Intersection.getNextId()
        this.coord = coord;        
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'intersection_' + Intersection.idCount;
        Intersection.idCount++;
        return nextId;
    }
}

module.exports = Intersection;
