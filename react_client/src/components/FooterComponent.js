import React from 'react';
import { Link } from 'react-router-dom';

function Footer(props) {
    return (
        <div className="footer">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-4 offset-1 col-sm-2">
                        <h5>Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/aboutus">About</Link></li>
                            <li><Link to="/menu">Menu</Link></li>
                            <li><Link to="/contactus">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="col-7 col-sm-5">
                        <h5>Our Address</h5>
                        <address>
                            IIT Kanpur <br />
                            <i className="fa fa-phone fa-lg"></i>: +91 987 654 3210<br />
                            <i className="fa fa-fax fa-lg"></i>: +91 987 654 3210<br />
                            <i className="fa fa-envelope fa-lg"></i>: <a href="mailto:abcd@iitk.ac.in">
                                abcd@iitk.ac.in</a>
                        </address>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <p>© Copyright 2020</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;