import React, { Component, createRef } from 'react'
import 'leaflet/dist/leaflet.css';
import '../map.css';
import L from 'leaflet';
import { Map, TileLayer, Marker, Tooltip, Polyline } from 'react-leaflet';
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
                lat: this.props.vehicle.locations[0].lat,
                lng: this.props.vehicle.locations[0].lng,
            },
            zoom: 11
        }
    }




    refmarker = createRef()


    updatePosition = () => {
        const marker = this.refmarker.current
        console.log(this.props.vehicle._id)
        console.log(marker.props.id)
        console.log(marker)
        const config = {
            headers: { Authorization: `bearer ${this.props.token}` }
        };
        //console.log(this.props.token);
        if (marker != null) {
            axios({
                method: 'put',
                url: SERVERURL + `vehicles/${this.props.vehicle._id}/locations/${marker.props.id}`,
                data: marker.leafletElement.getLatLng(),
                headers: { Authorization: `bearer ${this.props.token}` }
            })
                .then(res => {
                    this.props.setSingleVehicle(res.data)
                })
        }
    }




    render() {
        const position = [this.state.center.lat, this.state.center.lng]
        const polyline = this.props.vehicle.locations.map((location) => {
            return [location.lat, location.lng];
        })

        const allVehicles = this.props.vehicle.locations.map((location) => {
            return (
                <div
                    key={location._id}
                    onClick={this.handleClick}>
                    <Marker
                        id={location._id}
                        draggable={true}
                        onDragend={this.updatePosition}
                        onclick={this.handleMarkerClick}
                        icon={iconPerson}
                        position={[location.lat, location.lng]}
                        ref={this.refmarker}>
                        <Tooltip>
                            <span>
                                <b>Timeslot: </b>{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(location.timeSlot)))}
                            </span>
                        </Tooltip>
                    </Marker>

                    <Polyline color="lime" positions={polyline} />
                </div>
            );
        });


        return (
            <div className="container">
                <div className="row">
                    <div className='col-12 d-flex justify-content-center bg-success text-white mx-auto'>
                        <span className="h4">Vehicle Id: {this.props.vehicle.vehicleId}</span>
                    </div>
                </div>
                <div className="row">
                    <div className='col-12'>
                        <Map className='map' center={position} zoom={this.state.zoom}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {allVehicles}
                        </Map>
                    </div>
                </div>
            </div>
        )
    }
}

export default VehicleRouteComponent;