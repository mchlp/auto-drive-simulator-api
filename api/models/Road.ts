import { Waypoint } from '../types';

export default class Road {
    id: string;
    type: string;
    start: Waypoint;
    end: Waypoint;

    constructor(type: string, start: Waypoint, end: Waypoint) {
        this.id = Road.getNextId();
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

    serialize() {
        return {
            id: this.id,
            type: this.type,
            start: this.start.id,
            end: this.end.id,
        };
    }
}
