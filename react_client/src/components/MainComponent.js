import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import VehicleRouteComponent from './VehicleRouteComponent';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import { SERVERURL } from '../config';
import history from './history';
import https from 'https';


class Main extends Component {

  constructor(props) {
    super(props);

    this.setToken = this.setToken.bind(this);
    this.setVehicles = this.setVehicles.bind(this);
    this.setVehiclesZoom = this.setVehiclesZoom.bind(this);
    this.setSingleVehicle = this.setSingleVehicle.bind(this);
    this.setPenalty = this.setPenalty.bind(this);

    this.state = {
      token: '',
      user: null,
      vehicles: [],
      vehiclesZoom: [],
      crimes: [],
      crimesForHeatmap: [],
      zone: null
    };
  }


  handleLogout = () => {
    this.setState({
      token: '',
      user: null,
      vehicles: [],
      vehiclesZoom: [],
      crimes: [],
      crimesForHeatmap: [],
      zone: null
    });
  }


  setZoom = (zoom, vehicleId) => {
    let vehiclesZoom = this.state.vehiclesZoom
    for (var i in vehiclesZoom) {
      if (vehiclesZoom[i]._id == vehicleId) {
        vehiclesZoom[i].zoom = zoom;
        break; //Stop this loop, we found it!
      }
    }
    this.setState({
      vehiclesZoom: vehiclesZoom
    })
  }

  setCenter = (latlng, vehicleId) => {
    let vehiclesZoom = this.state.vehiclesZoom
    for (var i in vehiclesZoom) {
      if (vehiclesZoom[i]._id == vehicleId) {
        vehiclesZoom[i].center = latlng;
        break; //Stop this loop, we found it!
      }
    }
    this.setState({
      vehiclesZoom: vehiclesZoom
    })
  }

  setToken(token, user) {
    this.setState({
      token: token,
      user: user
    })
    axios({
      method: 'get',
      url: SERVERURL + `zones/`,
      params: { zone: user.zone },
      headers: { Authorization: `bearer ${this.state.token}` }
    })
      .then(res => {
        console.log("zone");
        console.log(res.data[0].zone);
        this.setState({
          zone: res.data[0]
        })
        axios({
          method: 'get',
          url: SERVERURL + `vehicles/`,
          params: { zone: user.zone },
          headers: { Authorization: `bearer ${this.state.token}` }
        })
          .then(res => {
            this.setVehicles(res.data);
            this.setVehiclesZoom(res.data);
            axios({
              method: 'get',
              url: SERVERURL + `crimes/`,
              params: {
                zone: user.zone,
                latlte: this.state.zone.leftLat,
                latgte: this.state.zone.rightLat,
                lnggte: this.state.zone.leftLng,
                lnglte: this.state.zone.rightLng
              },
              headers: { Authorization: `bearer ${this.state.token}` }
            })
              .then(res => {
                console.log(res);
                let crimesForHeatmap = res.data.map((crime) => {
                  return [crime.lat, crime.lng, "400"];
                })
                this.setState({
                  crimes: res.data,
                  crimesForHeatmap: crimesForHeatmap
                })
                //console.log(this.state.crimes)
              })
          })

      })

  }

  setVehicles(vehicles) {
    this.setState({
      vehicles: vehicles
    })
  }

  setVehiclesZoom(vehicles) {
    let vehiclesCopy = [...vehicles]
    vehiclesCopy = vehiclesCopy.map(vehicle => {
      return {
        _id: vehicle._id,
        zoom: 11,
        center: {
          lat: vehicle.locations[0].lat,
          lng: vehicle.locations[0].lng,
        },
        penalty: 0,
        loc: vehicle.locations
      }
    })
    this.setState({
      vehiclesZoom: vehiclesCopy
    })
  }


  setPenalty(penalty,vehicleId){
    let vehiclesZoom = this.state.vehiclesZoom
    for (var i in vehiclesZoom) {
      if (vehiclesZoom[i]._id == vehicleId) {
        let temp = this.state.vehicles[i].locations;
        if(penalty === 2){
          temp = this.state.vehicles[i].locations1;
        }else if(penalty === 3){
          temp = this.state.vehicles[i].locations2;
        }else if(penalty === 4){
          temp = this.state.vehicles[i].locations3;
        }else if(penalty === 5){
          temp = this.state.vehicles[i].locations4;
        }
        
        vehiclesZoom[i].center = {
          lat: temp[0].lat,
          lng: temp[0].lng,
        }

        vehiclesZoom[i].loc = temp;
        vehiclesZoom[i].penalty = penalty;
        break; //Stop this loop, we found it!
      }
    }


    this.setState({
      vehiclesZoom: vehiclesZoom
    })
  }

  setSingleVehicle(vehicle) {
    let vehicles = this.state.vehicles
    let vehiclesZoom = this.state.vehiclesZoom
    for (var i in vehicles) {
      if (vehicles[i]._id == vehicle._id) {
        vehicles[i] = vehicle;
        break; //Stop this loop, we found it!
      }
    }
    for (var i in vehiclesZoom) {
      if (vehiclesZoom[i]._id == vehicle._id) {
        let temp = vehicle.locations;
        if(vehiclesZoom[i].penalty == 2){
            temp = vehicle.locations1;
        }else if(vehiclesZoom[i].penalty == 3){
            temp = vehicle.locations2;
        }else if(vehiclesZoom[i].penalty == 4){
            temp = vehicle.locations3;
        }else if(vehiclesZoom[i].penalty == 5){
            temp = vehicle.locations4;
        }
        console.log("vehicle");
        console.log(vehicle);
        vehiclesZoom[i].loc = temp;
        break; //Stop this loop, we found it!
      }
    }
    this.setState({
      vehicles: vehicles,
      vehiclesZoom: vehiclesZoom
    })
  }



  render() {

    const HomePage = () => {
      return (
        <Home
          token={this.state.token}
          vehicles={this.state.vehicles}
          crimesForHeatmap={this.state.crimesForHeatmap}
        />
      );
    }

    const VehicleWithId = ({ match }) => {
      return (
        <VehicleRouteComponent
          token={this.state.token}
          zone = {this.state.zone.zone}
          vehicle={this.state.vehicles.filter((vehicle) => vehicle._id === (match.params.vehicleId))[0]}
          vehiclesZoom={this.state.vehiclesZoom.filter((vehicle) => vehicle._id === (match.params.vehicleId))[0]}
          setSingleVehicle={this.setSingleVehicle}
          setPenalty={this.setPenalty}
          setZoom={this.setZoom}
          setCenter={this.setCenter}
        />
      )
    }

    //This is an example of Route
    //<Route path="/menu/:dishId" component={DishWithId} />
    //const DishWithId = ({ match }) => {
    //  return (
    //    <Dishdetail dish={this.state.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
    //      comments={this.state.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
    //    />
    //  );
    //}

    return (
      <div>
        <Header setToken={this.setToken}
          token={this.token}
          setVehicles={this.setVehicles}
          handleLogout = {this.handleLogout}
        />
        <Router history={history}>
          <Switch>
            <Route path="/home" component={HomePage} />
            <Route path="/route/:vehicleId" component={VehicleWithId} />
            <Redirect to="/home" />
          </Switch>
        </Router>
        <Footer />
      </div>
    );
  }
}


export default Main;
