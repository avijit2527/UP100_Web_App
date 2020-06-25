import React, { Component, createRef } from 'react'
import 'leaflet/dist/leaflet.css';
import '../map.css';
import L from 'leaflet';
import { Map, TileLayer, Marker, Tooltip } from 'react-leaflet';
import axios from 'axios';
import { SERVERURL } from '../config';
import history from './history';


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



class MapComponent extends Component {


    constructor(props) {
        super(props);


        this.state = {

            center: {
                lat: 26.7,
                lng: 82.0,
            },
            zoom: 9
        }
    }





    handleMarkerClick = event => {
        //console.log(event.target.options.id);
        history.push(`/route/${event.target.options.id}`);
    }


    updatePosition = () => {
        const marker = this.refmarker.current
        const config = {
            headers: { Authorization: `bearer ${this.props.token}` }
        };
        //console.log(this.props.token);
        if (marker != null) {
            axios({
                method: 'put',
                url: SERVERURL + `vehicles/${marker.props.id}`,
                data: marker.leafletElement.getLatLng(),
                headers: { Authorization: `bearer ${this.props.token}` }
            })
                .then(res => {
                    //console.log(res);
                    //console.log(res.data);
                    this.setState({
                        marker: marker.leafletElement.getLatLng(),
                    })
                })
        }
    }





    render() {
        const position = [this.state.center.lat, this.state.center.lng]
        const allVehicles = this.props.vehicles.map((vehicle) => {
            //console.log(vehicle);
            return (
                <div 
                onClick={this.handleClick}>
                    <Marker
                        id={vehicle._id}
                        draggable={false}
                        onDragend={this.updatePosition}
                        onclick= {this.handleMarkerClick}
                        icon={iconPerson}
                        position={[vehicle.lat, vehicle.lng]}
                    >
                       <Tooltip> 
                           <span>
                               <b>Vehicle Id:</b> {vehicle.vehicleId} <br />
                               <b>Timeslot: </b>{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(vehicle.timeSlot)))}
                           </span>
                       </Tooltip>
                    </Marker>
                </div>
            );
        });

        return (
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
        )
    }
}

export default MapComponent;