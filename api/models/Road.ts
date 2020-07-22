import { Waypoint, RoadType, VehicleDirection } from '../types';
import { Vehicle } from '.';

export default class Road {
    id: string;
    type: RoadType;
    start: Waypoint;
    end: Waypoint;
    curVehicles: {
        towards_start: Record<Vehicle['id'], Vehicle>;
        towards_end: Record<Vehicle['id'], Vehicle>;
    };

    constructor(type: string, start: Waypoint, end: Waypoint) {
        this.id = Road.getNextId();
        this.type = type as RoadType;
        this.start = start;
        this.end = end;
        this.curVehicles = {
            towards_end: {},
            towards_start: {},
        };
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'road_' + Road.idCount;
        Road.idCount++;
        return nextId;
    }

    addVehicle(vehicle: Vehicle) {
        const curVehicleDirection = vehicle.getCurDirection();
        if (curVehicleDirection) {
            this.curVehicles[curVehicleDirection][vehicle.id] = vehicle;
        }
    }

    removeVehicle(vehicle: Vehicle) {
        Object.values(this.curVehicles).forEach((directionVehicles) => {
            if (directionVehicles[vehicle.id]) {
                delete directionVehicles[vehicle.id];
            }
        });
    }

    getVehiclesInCurrentDirection(vehicle: Vehicle) {
        const curVehicleDirection = vehicle.getCurDirection();
        if (curVehicleDirection) {
            return Object.values(this.curVehicles[curVehicleDirection]);
        }
    }

    getLength() {
        return Math.sqrt(
            Math.pow(this.end.coord[0] - this.start.coord[0], 2) +
                Math.pow(this.end.coord[1] - this.start.coord[1], 2)
        );
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
