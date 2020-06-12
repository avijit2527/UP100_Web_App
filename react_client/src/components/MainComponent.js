import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import VehicleRouteComponent from './VehicleRouteComponent';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import { SERVERURL } from '../config';
import history from './history';


class Main extends Component {

  constructor(props) {
    super(props);

    this.setToken = this.setToken.bind(this);
    this.setVehicles = this.setVehicles.bind(this);

    this.state = {
      token: '',
      vehicles: []
    };
  }


  setToken(token) {
    this.setState({
      token: token
    })
    axios({
      method: 'get',
      url: SERVERURL + `vehicles/`,
      headers: { Authorization: `bearer ${this.state.token}` }
    })
      .then(res => {
        console.log("Map Component Did Mount");
        console.log(res.data);
        this.setVehicles(res.data);
      })
  }

  setVehicles(vehicles) {
    this.setState({
      vehicles: vehicles
    })
  }



  render() {

    const HomePage = () => {
      return (
        <Home
          token={this.state.token}
          vehicles={this.state.vehicles}
        />
      );
    }

    const VehicleWithId = ({ match }) => {
      return (
        <VehicleRouteComponent />
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
          setVehicles={this.setVehicles}
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
