import { Coordinate } from '../types';
import { Vehicle } from '.';

export default class Intersection {
    id: string;
    coord: Coordinate;
    curOccupiedVehicle: Vehicle | null;

    constructor(id: string, coord: Coordinate) {
        this.id = id;
        this.coord = coord;
        this.curOccupiedVehicle = null;
    }

    static isIntersectionId(id: string) {
        return id.startsWith('intersection_');
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'intersection_' + Intersection.idCount;
        Intersection.idCount++;
        return nextId;
    }

    enterIntersection(vehicle: Vehicle) {
        if (!this.curOccupiedVehicle) {
            this.curOccupiedVehicle = vehicle;
        }
    }

    exitIntersection(vehicle: Vehicle) {
        if (this.curOccupiedVehicle === vehicle) {
            this.curOccupiedVehicle = null;
        }
    }

    getCurOccupiedVehicleId() {
        return this.curOccupiedVehicle?.id;
    }

    serialize() {
        return {
            id: this.id,
            coord: this.coord,
        };
    }
}
