import React, { useEffect, useState, useRef } from 'react';
import Map from './components/Map';
import MapBuilder from './components/MapBuilder';
import io from 'socket.io-client';
import MapViewer from './components/MapViewer';
import constants from './constants';

const socket = io('http://localhost:3001');

function App() {
    const [mapData, setMapData] = useState(null);
    const [curState, setCurState] = useState(constants.APP_STATE_LIST.VIEW_MAP);

    const lastUpdateTimeElapsedList = useRef([]);
    const lastUpdateTime = useRef(null);

    useEffect(() => {
        const updateMapDataListener = (data) => {
            const now = Date.now();
            let lastUpdateTimeElapsed = 0;
            if (lastUpdateTime.current) {
                lastUpdateTimeElapsed = now - lastUpdateTime.current;
            }
            lastUpdateTime.current = now;
            lastUpdateTimeElapsedList.current.push(lastUpdateTimeElapsed);
            if (lastUpdateTimeElapsedList.current.length > 100) {
                lastUpdateTimeElapsedList.current.shift();
            }
            setMapData(data);
        };
        socket.on('update-map-data', updateMapDataListener);
        return () => {
            socket.off('update-map-data', updateMapDataListener);
        };
    }, []);

    const averageUpdateTimeElapsed =
        lastUpdateTimeElapsedList.current.reduce((a, b) => a + b, 0) /
        lastUpdateTimeElapsedList.current.length;
    let averageUpdatesPerSecond = 1000 / averageUpdateTimeElapsed;
    if (lastUpdateTimeElapsedList.current.length < 100) {
        averageUpdatesPerSecond = Number.POSITIVE_INFINITY;
    }

    let Content;
    if (curState === constants.APP_STATE_LIST.VIEW_MAP) {
        if (mapData) {
            Content = (
                <MapViewer
                    mapData={mapData}
                    averageDataUpdatesPerSecond={averageUpdatesPerSecond}
                    curState={curState}
                    setCurState={setCurState}
                />
            );
        } else {
            Content = <div>Loading map data...</div>;
        }
    } else if (curState === constants.APP_STATE_LIST.CREATE_MAP) {
        Content = <MapBuilder curState={curState} setCurState={setCurState} />;
    }

    return <div className="App">{Content}</div>;
}

export default App;
