import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent'
import Footer from './FooterComponent'
import { Switch, Route, Redirect } from 'react-router-dom';


class Main extends Component {

  constructor(props) {
    super(props);

    this.setToken = this.setToken.bind(this);

    this.state = {
      token: ''
    };
  }


  setToken(token) {
    this.setState({
      token: token
    })
  }


  render() {

    const HomePage = () => {
      return (
        <Home
          token={this.state.token}
        />
      );
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
        <Header setToken={this.setToken} />
        <Switch>
          <Route path="/home" component={HomePage} />
          <Redirect to="/home" />
        </Switch>
        <Footer />
      </div>
    );
  }
}


export default Main;
