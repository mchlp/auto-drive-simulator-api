import React from 'react';
import Map from './Map';

export default function MapBuilder() {
    const mapData = {
        id: 'map_0',
        locations: { location_0: { id: 'location_0', coord: [-500, 500] } },
        intersections: {
            intersection_0: { id: 'intersection_0', coord: [0, 0] },
            intersection_1: { id: 'intersection_1', coord: [1000, 1000] },
            intersection_2: { id: 'intersection_2', coord: [2500, 1000] },
            intersection_3: { id: 'intersection_3', coord: [-1500, 1000] },
            intersection_4: { id: 'intersection_4', coord: [-1500, -1500] },
            intersection_5: { id: 'intersection_5', coord: [-2500, 1500] },
            intersection_6: { id: 'intersection_6', coord: [2500, -2000] },
            intersection_7: { id: 'intersection_7', coord: [-2500, -2250] },
            intersection_8: { id: 'intersection_8', coord: [-2500, 2250] },
            intersection_9: { id: 'intersection_9', coord: [1000, 2250] },
        },
        vehicles: {},
        roads: {
            road_0: {
                id: 'road_0',
                type: 'MAJOR',
                start: 'intersection_0',
                end: 'intersection_1',
            },
            road_1: {
                id: 'road_1',
                type: 'MAJOR',
                start: 'location_0',
                end: 'intersection_0',
            },
            road_2: {
                id: 'road_2',
                type: 'MINOR',
                start: 'intersection_1',
                end: 'intersection_2',
            },
            road_3: {
                id: 'road_3',
                type: 'MINOR',
                start: 'intersection_1',
                end: 'intersection_3',
            },
            road_4: {
                id: 'road_4',
                type: 'MINOR',
                start: 'intersection_3',
                end: 'intersection_4',
            },
            road_5: {
                id: 'road_5',
                type: 'LOCAL',
                start: 'intersection_0',
                end: 'intersection_4',
            },
            road_6: {
                id: 'road_6',
                type: 'LOCAL',
                start: 'intersection_3',
                end: 'intersection_5',
            },
            road_7: {
                id: 'road_7',
                type: 'LOCAL',
                start: 'intersection_2',
                end: 'intersection_6',
            },
            road_8: {
                id: 'road_8',
                type: 'MAJOR',
                start: 'intersection_5',
                end: 'intersection_7',
            },
            road_9: {
                id: 'road_9',
                type: 'LOCAL',
                start: 'intersection_4',
                end: 'intersection_7',
            },
            road_10: {
                id: 'road_10',
                type: 'MINOR',
                start: 'intersection_8',
                end: 'intersection_5',
            },
            road_11: {
                id: 'road_11',
                type: 'MAJOR',
                start: 'intersection_8',
                end: 'intersection_9',
            },
            road_12: {
                id: 'road_12',
                type: 'MAJOR',
                start: 'intersection_0',
                end: 'intersection_6',
            },
            road_13: {
                id: 'road_13',
                type: 'LOCAL',
                start: 'intersection_1',
                end: 'intersection_9',
            },
            road_14: {
                id: 'road_14',
                type: 'LOCAL',
                start: 'intersection_7',
                end: 'intersection_6',
            },
        },
    };

    return (
        <div>
            <Map mapData={mapData} />
        </div>
    );
}
