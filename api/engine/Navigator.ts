import { Map, Road } from '../models';
import { Waypoint, WaypointId, RouteSegment } from '../types';

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
            const roadWeight = 1;

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

    static getRoute(origin: Waypoint, destination: Waypoint, map: Map) {
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
                            console.log('found dest!');
                            break;
                        }

                        queue.push(adjacentWaypointId);
                    }
                }
            }
        }

        const route: RouteSegment[] = [];
        let curReverseTraverseWaypointId: string = destination.id;
        while (curReverseTraverseWaypointId !== origin.id) {
            route.unshift({
                roadId: parentList[curReverseTraverseWaypointId].roadId,
                entryPointId: parentList[curReverseTraverseWaypointId].parentId,
                exitPointId: curReverseTraverseWaypointId,
            });
            curReverseTraverseWaypointId = parentList[
                curReverseTraverseWaypointId
            ].parentId as string;
        }

        console.log(route);
    }
}
