import { Road, Location, Intersection } from './models';

export type Coordinate = [number, number];
export interface CoordinateXY {
    x: number;
    y: number;
}
export type Waypoint = Intersection | Location;

export type WaypointId = Waypoint['id'];

export interface RouteSegment {
    roadId: Road['id'] | null;
    entryPointId: WaypointId | null;
    exitPointId: WaypointId | null;
}
