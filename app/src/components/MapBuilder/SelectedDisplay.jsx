import React from 'react';

export default function SelectedDisplay({ componentData }) {
    let Content;
    if (componentData) {
        Content = (
            <div>
                <div>Current Component</div>
                <div>Type: {componentData.type}</div>
                <div>ID: {componentData.id}</div>
                <div>Data: {JSON.stringify(componentData, null, 4)}</div>
            </div>
        );
    } else {
        Content = <div>No component selected</div>;
    }

    return (
        <div
            style={{
                height: 100,
            }}
        >
            {Content}
        </div>
    );
}
