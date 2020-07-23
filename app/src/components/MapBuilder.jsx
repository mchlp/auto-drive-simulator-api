import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Input, Card, CardBody, Alert } from 'reactstrap';
import MapViewer from './MapViewer';
import constants from '../constants';
import Utils from '../Utils';
import rawMapData from './test.json';

const POINTER_TYPE = {
    INTERSECTION: 'intersection',
    LOCATION: 'location',
    NONE: 'none',
    ROAD: 'road',
    SAVE_MAP: 'save_map',
};

export default function MapBuilder() {
    const prevSavedMapData = useRef(rawMapData);
    const curPointerComponentId = useRef(null);
    const [roadStartWaypointId, setRoadStartWaypointId] = useState(null);
    const [roadType, setRoadType] = useState(null);
    const [curHoverComponent, setCurHoverComponent] = useState(null);
    const [curSelectComponent, setCurSelectComponent] = useState(null);
    const [mapData, setMapData] = useState(rawMapData);
    const [curPointerType, setCurPointerType] = useState(POINTER_TYPE.NONE);
    const [saveMapData, setSaveMapData] = useState('');

    const keyDownHandler = (event) => {
        if (event.key === 'Escape') {
            setCurPointerType(POINTER_TYPE.NONE);
            curPointerComponentId.current = null;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
        };
    }, []);

    const mouseMoveHandler = (mapCoordinates) => {
        if (curPointerType === POINTER_TYPE.INTERSECTION) {
            setMapData((prevMapData) => {
                let nextIntersectionId = curPointerComponentId.current;
                if (
                    !nextIntersectionId ||
                    !nextIntersectionId.includes('intersection')
                ) {
                    nextIntersectionId = `intersection_${Utils.generateShortUuid()}`;
                }
                curPointerComponentId.current = nextIntersectionId;
                return {
                    ...prevMapData,
                    intersections: {
                        ...prevMapData.intersections,
                        [nextIntersectionId]: {
                            id: nextIntersectionId,
                            coord: mapCoordinates,
                        },
                    },
                };
            });
        } else if (curPointerType === POINTER_TYPE.LOCATION) {
            setMapData((prevMapData) => {
                let nextLocationId = curPointerComponentId.current;
                if (!nextLocationId || !nextLocationId.includes('location')) {
                    nextLocationId = `location_${Utils.generateShortUuid()}`;
                }
                curPointerComponentId.current = nextLocationId;

                return {
                    ...prevMapData,
                    locations: {
                        ...prevMapData.locations,
                        [nextLocationId]: {
                            id: nextLocationId,
                            coord: mapCoordinates,
                        },
                    },
                };
            });
        } else {
            setMapData(prevSavedMapData.current);
            curPointerComponentId.current = null;
        }
    };

    const mouseDownHandler = (mapCoordinates) => {
        if (
            curPointerType === POINTER_TYPE.INTERSECTION ||
            curPointerType === POINTER_TYPE.LOCATION
        ) {
            if (!curHoverComponent) {
                prevSavedMapData.current = mapData;
                curPointerComponentId.current = null;
            }
        } else if (curPointerType === POINTER_TYPE.ROAD) {
            if (curHoverComponent) {
                if (!roadStartWaypointId) {
                    // road start point
                    setRoadStartWaypointId(curHoverComponent.id);
                } else {
                    // road end point
                    const nextRoadId = `road_${Utils.generateShortUuid()}`;

                    console.log(`start ${roadStartWaypointId}`);
                    console.log(`end ${curHoverComponent.id}`);
                    const newMapData = {
                        ...prevSavedMapData.current,
                        roads: {
                            ...prevSavedMapData.current.roads,
                            [nextRoadId]: {
                                id: nextRoadId,
                                type: roadType,
                                start: roadStartWaypointId,
                                end: curHoverComponent.id,
                            },
                        },
                    };
                    prevSavedMapData.current = newMapData;
                    setMapData(newMapData);
                    setRoadStartWaypointId(null);
                }
            }
        }
    };

    const serializeMap = () => {
        const serializedMap = {
            id: `map_${Utils.generateShortUuid()}`,
            locations: mapData.locations,
            intersections: mapData.intersections,
            vehicles: {},
            roads: mapData.roads,
        };
        setCurPointerType(POINTER_TYPE.SAVE_MAP);
        setSaveMapData(JSON.stringify(serializedMap));
    };

    const hoverComponentChangeHandler = (newHoverComponent) => {
        setCurHoverComponent(newHoverComponent);
    };

    const selectComponentChangeHandler = (newSelectComponent) => {
        setCurSelectComponent(newSelectComponent);
    };

    const deleteSelectedComponent = () => {
        if (curSelectComponent && curSelectComponent.id) {
            const newMapData = JSON.parse(
                JSON.stringify(prevSavedMapData.current)
            );

            if (newMapData.intersections[curSelectComponent.id]) {
                delete newMapData.intersections[curSelectComponent.id];
            }

            if (newMapData.locations[curSelectComponent.id]) {
                delete newMapData.locations[curSelectComponent.id];
            }

            for (const roadId of Object.keys(prevSavedMapData.current.roads)) {
                if (
                    prevSavedMapData.current.roads[roadId].start ===
                        curSelectComponent.id ||
                    prevSavedMapData.current.roads[roadId].end ===
                        curSelectComponent.id
                ) {
                    delete newMapData.roads[roadId];
                }
            }

            prevSavedMapData.current = newMapData;
            setCurPointerType(POINTER_TYPE.NONE);
            curPointerComponentId.current = null;
            setMapData(newMapData);
        }
    };

    let curPointerRadius = 0;
    if (curPointerType === POINTER_TYPE.LOCATION) {
        curPointerRadius = constants.DISPLAY.LOCATION_RADIUS;
    } else if (curPointerType === POINTER_TYPE.INTERSECTION) {
        curPointerRadius = constants.DISPLAY.INTERSECTION_RADIUS;
    }

    let cursorStyle = null;
    if (curPointerType === POINTER_TYPE.ROAD && roadStartWaypointId) {
        cursorStyle = 'crosshair';
    }

    return (
        <div className="mt-1 mr-3 ml-3 mb-5">
            <div>
                <Button
                    color="primary"
                    className="m-1"
                    onClick={() => {
                        setMapData(prevSavedMapData.current);
                        setCurPointerType(POINTER_TYPE.LOCATION);
                        curPointerComponentId.current = null;
                    }}
                >
                    Add Location
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        setMapData(prevSavedMapData.current);
                        setCurPointerType(POINTER_TYPE.INTERSECTION);
                        curPointerComponentId.current = null;
                    }}
                    className="m-1"
                >
                    Add Intersection
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        setMapData(prevSavedMapData.current);
                        setCurPointerType(POINTER_TYPE.ROAD);
                        setRoadType(constants.ROAD_TYPES.TYPES.MAJOR);
                    }}
                    className="m-1"
                >
                    Build Major Road
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        setMapData(prevSavedMapData.current);
                        setCurPointerType(POINTER_TYPE.ROAD);
                        setRoadType(constants.ROAD_TYPES.TYPES.MINOR);
                    }}
                    className="m-1"
                >
                    Build Minor Road
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        setMapData(prevSavedMapData.current);
                        setCurPointerType(POINTER_TYPE.ROAD);
                        setRoadType(constants.ROAD_TYPES.TYPES.LOCAL);
                    }}
                    className="m-1"
                >
                    Build Local Road
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        setMapData(prevSavedMapData.current);
                        setCurPointerType(POINTER_TYPE.NONE);
                        curPointerComponentId.current = null;
                        deleteSelectedComponent();
                    }}
                    className="m-1"
                >
                    Delete Selected Component
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        setRoadStartWaypointId(null);
                        setMapData(prevSavedMapData.current);
                        setCurPointerType(POINTER_TYPE.NONE);
                        curPointerComponentId.current = null;
                    }}
                    className="m-1"
                >
                    Reset Pointer
                </Button>
                <Button color="success" onClick={serializeMap} className="m-1">
                    Save Map
                </Button>
            </div>
            {curPointerType === POINTER_TYPE.SAVE_MAP && (
                <Alert className="mt-2">
                    <div className="mb-2">
                        Copy the map data below to your clipboard.
                    </div>
                    <Input type="text" value={saveMapData} readOnly={true} />
                </Alert>
            )}
            <div>
                <MapViewer
                    mapData={mapData}
                    onMouseMove={mouseMoveHandler}
                    onMouseDown={mouseDownHandler}
                    onHoverComponentChanged={hoverComponentChangeHandler}
                    onSelectComponentChange={selectComponentChangeHandler}
                    curPointerRadius={curPointerRadius}
                    curPointerComponentId={curPointerComponentId.current}
                    cursorStyle={cursorStyle}
                />
            </div>
        </div>
    );
}
