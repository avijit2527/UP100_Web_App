import React, { Component, createRef } from 'react'
import 'leaflet/dist/leaflet.css';
import '../map.css';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
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



class MapComponent extends Component {


    constructor(props) {
        super(props);
    
    
        this.state = {
            _id: "5ed6159034a7aa228c6a5e31",
            center: {
                lat: 26.79,
                lng: 82.19,
            },
            marker: {
                lat: 26.79,
                lng: 82.19,
            },
            zoom: 13,
            draggable: true
        }
      }



    refmarker = createRef()

    toggleDraggable = () => {
        this.setState({ draggable: !this.state.draggable })
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
                url: SERVERURL + `locations/${marker.props.id}`,
                data: marker.leafletElement.getLatLng(),
                headers: { Authorization: `bearer ${this.props.token}` }
            })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
            this.setState({
                marker: marker.leafletElement.getLatLng(),
            })
        }
    }






    render() {
        const position = [this.state.center.lat, this.state.center.lng]
        const markerPosition = [this.state.marker.lat, this.state.marker.lng]

        return (
            <div className="row">
                <div className='col-12'>
                    <Map className='map' center={position} zoom={this.state.zoom}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                            id={this.state._id}
                            draggable={this.state.draggable}
                            onDragend={this.updatePosition}
                            icon={iconPerson}
                            position={markerPosition}
                            ref={this.refmarker}>
                            <Popup minWidth={90}>
                                <span onClick={this.toggleDraggable}>
                                    {this.state.draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
                                </span>
                            </Popup>
                        </Marker>
                    </Map>
                </div>
            </div>
        )
    }
}

export default MapComponent;