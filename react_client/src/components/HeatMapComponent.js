import React, { Component, createRef } from 'react';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

class HeatMapComponent extends React.Component {


    constructor(props) {
        super(props);

    }

    shouldComponentUpdate() {
        console.log('Greeting - shouldComponentUpdate lifecycle');

        return false;
    }

    render() {
        return <HeatmapLayer
            points={this.props.crimesForHeatmap}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => parseFloat(m[2])} />;
    }
}

export default HeatMapComponent;