import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron, Button, Modal, ModalHeader, ModalBody, FormGroup, Input, Form, Label } from 'reactstrap'
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { SERVERURL } from '../config';
import https from 'https';
import '../App.css'

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false,
            isModalOpen: false,
            username: "",
            password: "",
            remember: false
        };
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleRememberChange = this.handleRememberChange.bind(this);
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        })
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    handleUsernameChange = function (e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange = function (e) {
        this.setState({ password: e.target.value });
    }

    handleRememberChange = function (e) {
        this.setState({ remember: e.target.value });
    }


    handleLogin(event) {

        this.toggleModal();
        //console.log(this.state);



        // At instance level
        const instance = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        instance.post(SERVERURL + 'users/login',
            {
                "username": this.state.username,
                "password": this.state.password
            })
            .then(res => {
                //console.log(res.data.token);
                if (res.data.token) {
                    this.props.setToken(res.data.token,res.data.user)
                }
                //console.log(res.data);
            })
            .catch(err => alert("Login Failed! Please Try Again."));
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <Navbar dark expand="md">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        <NavbarBrand className="mr-3" href="/"><img src='assets/images/Upplogo.png' height="30" width="41" alt='UPPLOGO' /></NavbarBrand>
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/aboutus'><span className="fa fa-info fa-lg"></span> About Us</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/menu'><span className="fa fa-list fa-lg"></span> Menu</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/contactus'><span className="fa fa-address-card fa-lg"></span> Contact Us</NavLink>
                                </NavItem>
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Button outline onClick={this.toggleModal}>
                                        <span className="fa fa-sign-in fa-lg"></span> Login
                                    </Button>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
                <Jumbotron>
                    <div className="container">
                        <div className="row row-header">
                            <div className="col-12 col-sm-6">
                                <h1 className='align-center'>UP 112 Control Room</h1>
                                <h4>Maintain Law and order</h4>
                            </div>
                            <div className="col-12 col-sm-6">
                                <img className='img-fluid  img-responsive up100_image' src='assets/images/UP100.png' alt='UPPLOGO' />
                            </div>
                        </div>
                    </div>
                </Jumbotron>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username" value={this.state.username}
                                    onChange={this.handleUsernameChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password" value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                />
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <input type="checkbox" name="remember" value={this.state.remember}
                                        onChange={this.handleRememberChange}
                                    />
                                    Remember me
                                </Label>
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">
                                Login
                            </Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Header;