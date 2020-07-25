import React from 'react';
import Map from './Map';
import { useRef, useState } from 'react';
import Utils from '../Utils';
import SelectedDisplay from './SelectedDisplay';
import constants from '../constants';
import ComponentFinder from '../builder/ComponentFinder';
import MapStats from './MapStats';
import { FormGroup, Label, Input, Form } from 'reactstrap';

export default function MapViewer({
    mapData,
    onSelectComponentChange,
    onHoverComponentChanged,
    onMouseMove,
    onMouseDown,
    curPointerRadius,
    curPointerComponentId,
    cursorStyle,
    averageDataUpdatesPerSecond,
    canvasHeightPercentage,
    buildingMap = false,
}) {
    const containerRef = useRef(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [hoveredComponent, setHoveredComponent] = useState(null);
    const [showLabels, setShowLabels] = useState(true);

    const getMapCoordinatesFromMouseEvent = (event) => {
        const { pageX, pageY } = event;
        const canvasCoordinates = [
            pageX - Utils.canvasOffsetLeft,
            pageY - Utils.canvasOffsetTop,
        ];
        return Utils.unmapArrayCoord(canvasCoordinates);
    };

    const mouseMoveHandler = (event) => {
        if (containerRef && containerRef.current && Utils.ready) {
            const mapCoordinates = getMapCoordinatesFromMouseEvent(event);
            if (onMouseMove) {
                onMouseMove(mapCoordinates);
            }
            const curHoveredComponent = ComponentFinder.findComponent(
                mapCoordinates,
                mapData,
                curPointerRadius,
                [curPointerComponentId]
            );
            if (
                (hoveredComponent ? hoveredComponent.id : hoveredComponent) !==
                (curHoveredComponent
                    ? curHoveredComponent.id
                    : curHoveredComponent)
            ) {
                setHoveredComponent(curHoveredComponent);
                if (onHoverComponentChanged) {
                    onHoverComponentChanged(curHoveredComponent);
                }
            }
        }
    };

    const mouseDownHandler = (event) => {
        if (containerRef && containerRef.current && Utils.ready) {
            const mapCoordinates = getMapCoordinatesFromMouseEvent(event);

            if (onMouseDown) {
                onMouseDown(mapCoordinates);
            }

            if (hoveredComponent && selectedComponent !== hoveredComponent) {
                setSelectedComponent(hoveredComponent);
                if (onSelectComponentChange) {
                    onSelectComponentChange(hoveredComponent);
                }
            }
        }
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                <div className="mx-2 my-1">
                    <SelectedDisplay
                        componentData={hoveredComponent || selectedComponent}
                    />
                </div>
                <div className="mx-2 my-1">
                    <MapStats
                        mapData={mapData}
                        averageDataUpdatesPerSecond={
                            averageDataUpdatesPerSecond
                        }
                    />
                </div>
            </div>
            <div
                className="mx-2"
                style={{
                    fontSize: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    alignContent: 'center',
                }}
            >
                <input
                    type="checkbox"
                    id="show-lables-chkbox"
                    className="mr-1"
                    checked={showLabels}
                    onChange={(event) => {
                        setShowLabels(event.target.checked);
                    }}
                />
                <label
                    htmlFor="show-labels-chkbox"
                    className="m-0"
                    onClick={(e) => {
                        setShowLabels((prevShowLabels) => !prevShowLabels);
                    }}
                    style={{
                        userSelect: 'none',
                    }}
                >
                    Toggle Labels
                </label>
            </div>
            <div
                onMouseMove={mouseMoveHandler}
                onMouseDown={mouseDownHandler}
                ref={containerRef}
                style={{
                    cursor: cursorStyle
                        ? cursorStyle
                        : hoveredComponent
                        ? 'pointer'
                        : 'move',
                }}
            >
                <Map
                    mapData={mapData}
                    canvasHeightPercentage={canvasHeightPercentage || 0.85}
                    showLabels={showLabels}
                    buildingMap={buildingMap}
                />
            </div>
        </div>
    );
}
