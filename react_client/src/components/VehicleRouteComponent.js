import React, { Component, createRef } from 'react'
import 'leaflet/dist/leaflet.css';
import '../map.css';
import L from 'leaflet';
import { Map, TileLayer, Marker, Tooltip } from 'react-leaflet';
import axios from 'axios';
import { SERVERURL } from '../config';


const iconPerson = new L.Icon({
    iconUrl: require('../img/policeCarImg.png'),
    iconRetinaUrl: require('../img/policeCarImg.png'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon'
});



class VehicleRouteComponent extends Component {

    constructor(props) {
        super(props);


        this.state = {

            center: {
                lat: 26.7,
                lng: 82.0,
            },
            marker: {
                lat: 26.79,
                lng: 82.19,
            },
            zoom: 9
        }
    }






    updatePosition = () => {
        const marker = this.refmarker.current
        const config = {
            headers: { Authorization: `bearer ${this.props.token}` }
        };
        console.log(this.props.token);
        if (marker != null) {
            axios({
                method: 'put',
                url: SERVERURL + `vehicles/${marker.props.id}`,
                data: marker.leafletElement.getLatLng(),
                headers: { Authorization: `bearer ${this.props.token}` }
            })
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    this.setState({
                        marker: marker.leafletElement.getLatLng(),
                    })
                })
        }
    }





    render() {
        const position = [this.state.center.lat, this.state.center.lng]
        const markerPosition = [this.state.marker.lat, this.state.marker.lng]


        return (
            <div className="container">
                <div className="row">
                    <div className='col-12'>
                        <Map className='map' center={position} zoom={this.state.zoom}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                        </Map>
                    </div>
                </div>
            </div>
        )
    }
}

export default VehicleRouteComponent;