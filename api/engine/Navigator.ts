import { Map, Road } from '../models';
import { Waypoint, WaypointId, RouteSegment, Route } from '../types';
import constants from '../constants';

interface AdjacencyListEntry {
    roadId: Road['id'];
    weight: number;
}

interface ParentListEntry {
    parentId: WaypointId | null;
    roadId: Road['id'] | null;
}

export default class Navigator {
    static generateAdjacencyList(map: Map) {
        const adjacencyList: Record<
            string,
            Record<string, AdjacencyListEntry>
        > = {};
        Object.entries(map.roads).forEach((roadEntry) => {
            const roadId = roadEntry[0];
            const roadData = roadEntry[1];
            let roadWeight = 10;
            switch (roadData.type) {
                case constants.ROAD_TYPES.TYPES.MAJOR:
                    roadWeight = 1;
                    break;
                case constants.ROAD_TYPES.TYPES.MINOR:
                    roadWeight = 3;
                    break;
                case constants.ROAD_TYPES.TYPES.LOCAL:
                    roadWeight = 5;
                    break;
            }

            const addEntry = (startId: WaypointId, endId: WaypointId) => {
                if (!adjacencyList[startId]) {
                    adjacencyList[startId] = {};
                }
                if (!adjacencyList[startId][endId]) {
                    adjacencyList[startId][endId] = {
                        roadId,
                        weight: roadWeight,
                    };
                } else {
                    if (roadWeight < adjacencyList[startId][endId].weight) {
                        adjacencyList[startId][endId] = {
                            roadId,
                            weight: roadWeight,
                        };
                    }
                }
            };

            addEntry(roadData.start.id, roadData.end.id);
            addEntry(roadData.end.id, roadData.start.id);
        });

        return adjacencyList;
    }

    static getRoute(origin: Waypoint, destination: Waypoint, map: Map): Route {
        const adjacencyList = this.generateAdjacencyList(map);

        const parentList: Record<string, ParentListEntry> = {};

        const queue = [origin.id];
        parentList[origin.id] = {
            parentId: null,
            roadId: null,
        };

        while (queue.length > 0) {
            const curWaypointId = queue.shift();
            if (curWaypointId && adjacencyList[curWaypointId]) {
                for (const adjacentWaypointEntry of Object.entries(
                    adjacencyList[curWaypointId]
                )) {
                    const adjacentWaypointId = adjacentWaypointEntry[0];
                    const adjacentWaypointData = adjacentWaypointEntry[1];

                    if (!parentList[adjacentWaypointId]) {
                        parentList[adjacentWaypointId] = {
                            parentId: curWaypointId,
                            roadId: adjacentWaypointData.roadId,
                        };

                        if (adjacentWaypointId === destination.id) {
                            break;
                        }

                        queue.push(adjacentWaypointId);
                    }
                }
            }
        }

        const route: Route = [];
        let curReverseTraverseWaypointId: string = destination.id;
        while (curReverseTraverseWaypointId !== origin.id) {
            if (parentList[curReverseTraverseWaypointId].parentId) {
                route.unshift({
                    roadId: parentList[curReverseTraverseWaypointId]
                        .roadId as Road['id'],
                    entryPointId: parentList[curReverseTraverseWaypointId]
                        .parentId as WaypointId,
                    exitPointId: curReverseTraverseWaypointId,
                });
                curReverseTraverseWaypointId = parentList[
                    curReverseTraverseWaypointId
                ].parentId as string;
            } else {
                return [];
            }
        }

        return route;
    }
}
