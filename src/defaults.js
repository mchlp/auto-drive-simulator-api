const defaults = {};

defaults.mapData = {
    locations: {
        location_0: {
            coord: [-500, -500],
        },
    },
    intersections: {
        intersect_0: { coord: [0, 0] },
        intersect_1: { coord: [1000, 1000] },
        intersect_2: { coord: [2500, 1000] },
        intersect_3: { coord: [-1500, 1000] },
        intersect_4: { coord: [-1500, -1500] },
        intersect_5: { coord: [-2500, 1500] },
        intersect_6: { coord: [2500, -2000] },
        intersect_7: { coord: [-2500, -2250] },
        intersect_8: { coord: [-2500, 2250] },
        intersect_9: { coord: [1000, 2250] },
    },
    vehicles: {
        vehicle_1: {
            coord: [0, 0],
        },
        vehicle_2: {
            coord: [100, 100],
        },
        vehicle_3: {
            coord: [200, 200],
        },
        vehicle_4: {
            coord: [-300, 300],
        },
        vehicle_5: {
            coord: [500, 500],
        },
        vehicle_6: {
            coord: [1200, 1200],
        },
    },
    roads: {
        road_0: {
            width: [1, 1],
            start: 'intersect_0',
            end: 'intersect_1',
        },
        road_2: {
            width: [1, 1],
            start: 'location_0',
            end: 'intersect_0',
        },
        road_3: {
            width: [1, 1],
            start: 'intersect_1',
            end: 'intersect_2',
        },
        road_4: {
            width: [1, 1],
            start: 'intersect_1',
            end: 'intersect_3',
        },
        road_5: {
            width: [1, 1],
            start: 'intersect_3',
            end: 'intersect_4',
        },
        road_6: {
            width: [1, 1],
            start: 'intersect_1',
            end: 'intersect_4',
        },
        road_7: {
            width: [1, 1],
            start: 'intersect_3',
            end: 'intersect_5',
        },
        road_8: {
            width: [1, 1],
            start: 'intersect_2',
            end: 'intersect_6',
        },
        road_9: {
            width: [1, 1],
            start: 'intersect_5',
            end: 'intersect_7',
        },
        road_10: {
            width: [1, 1],
            start: 'intersect_4',
            end: 'intersect_7',
        },
        road_11: {
            width: [1, 1],
            start: 'intersect_8',
            end: 'intersect_5',
        },
        road_12: {
            width: [1, 1],
            start: 'intersect_8',
            end: 'intersect_9',
        },
        road_13: {
            width: [1, 1],
            start: 'intersect_0',
            end: 'intersect_6',
        },
        road_14: {
            width: [1, 1],
            start: 'intersect_1',
            end: 'intersect_9',
        },
        road_15: {
            width: [1, 1],
            start: 'intersect_7',
            end: 'intersect_6',
        },
    },
};

module.exports = defaults;
