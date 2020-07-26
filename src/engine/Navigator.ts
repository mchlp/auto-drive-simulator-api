import { Map, Road, Vehicle } from '../models';
import { Waypoint, WaypointId, RouteSegment, Route } from '../types';
import constants from '../constants';
import PriorityQueue from '../util/PriorityQueue';

interface AdjacencyListEntry {
    roadId: Road['id'];
    weight: number;
}

interface ParentListEntry {
    parentId: WaypointId | null;
    roadId: Road['id'] | null;
    totalWeight: number;
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

            const addEntry = (
                startId: WaypointId,
                endId: WaypointId,
                weight: number
            ) => {
                if (!adjacencyList[startId]) {
                    adjacencyList[startId] = {};
                }
                if (!adjacencyList[startId][endId]) {
                    adjacencyList[startId][endId] = {
                        roadId,
                        weight,
                    };
                } else {
                    if (roadWeight < adjacencyList[startId][endId].weight) {
                        adjacencyList[startId][endId] = {
                            roadId,
                            weight,
                        };
                    }
                }
            };

            const roadLength = roadData.getLength();
            const getDensityWeightAdder = (
                roadDirectionvehicleMap: Record<string, Vehicle>
            ) => {
                let densityWeight = 0;
                const numberVehicles = Object.keys(roadDirectionvehicleMap)
                    .length;
                if (numberVehicles > 0) {
                    const spacePerVehicle = roadLength / numberVehicles;
                    if (spacePerVehicle < map.safeFollowingDistance * 2) {
                        densityWeight +=
                            500 * (spacePerVehicle / map.safeFollowingDistance);
                    }
                }
                return densityWeight;
            };

            let startToEndWeight = roadWeight;
            startToEndWeight += getDensityWeightAdder(
                roadData.curVehicles.towards_end
            );

            addEntry(roadData.start.id, roadData.end.id, startToEndWeight);

            let endToStartWeight = roadWeight;
            endToStartWeight += getDensityWeightAdder(
                roadData.curVehicles.towards_start
            );
            addEntry(roadData.end.id, roadData.start.id, endToStartWeight);
        });

        return adjacencyList;
    }

    static getRoute(origin: Waypoint, destination: Waypoint, map: Map): Route {
        const adjacencyList = this.generateAdjacencyList(map);
        const parentList: Record<string, ParentListEntry> = {};

        const priorityQueue = new PriorityQueue<WaypointId>();        
        priorityQueue.enqueue(origin.id, 0);
        parentList[origin.id] = {
            parentId: null,
            roadId: null,
            totalWeight: 0,
        };

        while (!priorityQueue.isEmpty()) {
            const curWaypointId = priorityQueue.dequeue();
            if (curWaypointId && adjacencyList[curWaypointId]) {
                const curWeight = parentList[curWaypointId].totalWeight;
                for (const adjacentWaypointEntry of Object.entries(
                    adjacencyList[curWaypointId]
                )) {
                    const adjacentWaypointId = adjacentWaypointEntry[0];
                    const adjacentWaypointData = adjacentWaypointEntry[1];
                    const newWeight = curWeight + adjacentWaypointData.weight;

                    if (
                        !parentList[adjacentWaypointId] ||
                        parentList[adjacentWaypointId].totalWeight > newWeight
                    ) {
                        parentList[adjacentWaypointId] = {
                            parentId: curWaypointId,
                            roadId: adjacentWaypointData.roadId,
                            totalWeight: newWeight,
                        };
                        if (adjacentWaypointId === destination.id) {
                            break;
                        }
                        priorityQueue.enqueue(adjacentWaypointId, newWeight);
                    }
                }
            }
        }

        // console.log(`route weight: ${parentList[destination.id].totalWeight}`);
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
