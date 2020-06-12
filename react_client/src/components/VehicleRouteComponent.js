import React, { Component, createRef } from 'react'
import 'leaflet/dist/leaflet.css';
import '../map.css';
import L from 'leaflet';
import { Map, TileLayer, Marker, Tooltip } from 'react-leaflet';
import axios from 'axios';
import { SERVERURL } from '../config';


class VehicleRouteComponent extends Component {
    render() {
        return (
            <div>VehicleRouteComponent</div>
        )
    }
}

export default VehicleRouteComponent;