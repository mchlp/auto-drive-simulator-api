import { Road, Location, Intersection } from './models';

export type Coordinate = [number, number];
export interface CoordinateXY {
    x: number;
    y: number;
}
export type Waypoint = Intersection | Location;

export type WaypointId = Waypoint['id'];

export interface RouteSegment {
    roadId: Road['id'];
    entryPointId: WaypointId;
    exitPointId: WaypointId;
}

export type Route = RouteSegment[];

export type RoadType = 'LOCAL' | 'MINOR' | 'MAJOR';

export type VehicleDirection = 'towards_start' | 'towards_end'
