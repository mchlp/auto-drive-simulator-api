import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Map({ mapData }) {
    const canvasRef = useRef(null);

    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.9);
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.9);
    const [canvasProps, setCanvasProps] = useState({
        centerX: 0,
        centerY: 0,
        zoom: 0.5,
    });
    const [draging, setDraging] = useState(false);

    const lastDragCoord = useRef(null);

    const scaleSingleCoord = (singleCoord) => {
        return singleCoord * canvasProps.zoom;
    };

    const mapSingleCoord = (singleCoord, index) => {
        let scaledCoord = scaleSingleCoord(singleCoord);
        if (index === 0) {
            scaledCoord += canvasWidth / 2 - canvasProps.centerX;
        } else if (index === 1) {
            scaledCoord += canvasHeight / 2 - canvasProps.centerY;
        }
        return scaledCoord;
    };

    const mapArrayCoord = (arrayCoord) => {
        if (arrayCoord) {
            return arrayCoord.map(mapSingleCoord);
        }
        return null;
    };

    const getCoordFromWaypoint = (waypointName) => {
        if (waypointName.startsWith('intersect')) {
            return mapData.intersections[waypointName].coord;
        } else if (waypointName.startsWith('location')) {
            return mapData.locations[waypointName].coord;
        }
        return null;
    };

    const drawRoads = (ctx) => {
        const drawRoadLines = () => {
            Object.entries(mapData.roads).forEach((roadEntry) => {
                const roadId = roadEntry[0];
                const roadData = roadEntry[1];

                let startCoord = mapArrayCoord(
                    getCoordFromWaypoint(roadData.start)
                );
                let endCoord = mapArrayCoord(
                    getCoordFromWaypoint(roadData.end)
                );

                if (startCoord && endCoord) {
                    ctx.beginPath();
                    ctx.moveTo(...startCoord);
                    ctx.lineTo(...endCoord);
                    ctx.stroke();
                }
            });
        };

        ctx.lineWidth = scaleSingleCoord(60);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'round';
        drawRoadLines();

        ctx.lineWidth = scaleSingleCoord(1);
        ctx.strokeStyle = 'yellow';
        ctx.lineJoin = 'round';
        drawRoadLines();
    };

    const drawLocations = (ctx) => {
        Object.entries(mapData.locations).forEach((locationEntry) => {
            const locationId = locationEntry[0];
            const locationData = locationEntry[1];

            const coord = mapArrayCoord(locationData.coord);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'grey';
            ctx.fillStyle = '#ff0000';

            ctx.beginPath();
            ctx.arc(coord[0], coord[1], scaleSingleCoord(2), 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        });
    };

    const drawIntersections = (ctx) => {
        Object.entries(mapData.intersections).forEach((intersectionEntry) => {
            const intersectionId = intersectionEntry[0];
            const intersectionData = intersectionEntry[1];

            const coord = mapArrayCoord(intersectionData.coord);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'grey';
            ctx.fillStyle = '#00ff00';

            ctx.beginPath();
            ctx.arc(coord[0], coord[1], scaleSingleCoord(45), 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        });
    };

    const drawVehicles = (ctx) => {
        Object.entries(mapData.vehicles).forEach((vehicleEntry) => {
            const vehicleId = vehicleEntry[0];
            const vehicleData = vehicleEntry[1];

            const coord = mapArrayCoord(vehicleData.coord);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'grey';
            ctx.fillStyle = 'blue';

            ctx.beginPath();
            ctx.arc(coord[0], coord[1], scaleSingleCoord(20), 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        });
    };

    const draw = () => {
        if (canvasRef.current) {
            const canvasObj = canvasRef.current;
            const ctx = canvasObj.getContext('2d');
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = '#dddddd';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            const logoImage = new Image();
            logoImage.src = '/logo192.png';
            logoImage.onload = () => {
                ctx.drawImage(logoImage, 0, 0, 50, 50);
            };
            drawRoads(ctx);
            drawLocations(ctx);
            drawIntersections(ctx);
            drawVehicles(ctx);
        }
    };

    useEffect(() => {
        draw();
    }, [canvasRef, canvasProps]);

    const onDragStart = (event) => {
        setDraging(true);
        lastDragCoord.current = {
            x: event.screenX,
            y: event.screenY,
        };
    };

    const onDragEnd = (event) => {
        setDraging(false);
        lastDragCoord.current = null;
    };

    const onDragMove = (event) => {
        if (draging) {
            const lastCoord = {
                x: lastDragCoord.current.x,
                y: lastDragCoord.current.y,
            };
            const curCoord = {
                x: event.screenX,
                y: event.screenY,
            };
            console.log(canvasProps);
            setCanvasProps((prevCanvasProps) => ({
                ...prevCanvasProps,
                centerX: prevCanvasProps.centerX - (curCoord.x - lastCoord.x),
                centerY: prevCanvasProps.centerY - (curCoord.y - lastCoord.y),
            }));
            lastDragCoord.current = curCoord;
        }
    };

    const onZoom = (event) => {
        const { pageX, pageY, deltaY } = event;

        const ZOOM_FACTOR = 1.25;
        let curZoomFactor = 1;
        if (deltaY > 0) {
            // zoom out
            curZoomFactor = 1 / ZOOM_FACTOR;
        } else if (deltaY < 0) {
            // zoom in
            curZoomFactor = ZOOM_FACTOR;
        }

        setCanvasProps((prevCanvasProps) => {
            const zoomCenterInCanvasView = {
                x: pageX - canvasRef.current.offsetLeft,
                y: pageY - canvasRef.current.offsetTop,
            };

            const zoomOffsetFromViewCentre = {
                x: zoomCenterInCanvasView.x - canvasWidth / 2,
                y: zoomCenterInCanvasView.y - canvasHeight / 2,
            };

            const zoomCenterInCanvas = {
                x: zoomOffsetFromViewCentre.x + prevCanvasProps.centerX,
                y: zoomOffsetFromViewCentre.y + prevCanvasProps.centerY,
            };

            console.log(zoomCenterInCanvas);

            return {
                centerX:
                    prevCanvasProps.centerX -
                    zoomCenterInCanvas.x * (1 - curZoomFactor),
                centerY:
                    prevCanvasProps.centerY -
                    zoomCenterInCanvas.y * (1 - curZoomFactor),
                zoom: prevCanvasProps.zoom * curZoomFactor,
            };
        });
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                marginTop: 20,
            }}
        >
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={onDragStart}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                onMouseMove={onDragMove}
                onWheel={onZoom}
            />
        </div>
    );
}
