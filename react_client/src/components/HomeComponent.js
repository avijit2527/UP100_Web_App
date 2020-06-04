import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import MapComponent from './MapComponent';


function Home(props) {
    return (
        <div className="container">
            <MapComponent token={props.token}/>
        </div>
    );
}


export default Home;