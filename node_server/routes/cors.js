const express = require('express');
const cors = require('cors');

const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443','http://localhost:3001','http://localhost:5001','https://localhost:5002','http://localhost:5003','http://srivalab-compute.cse.iitk.ac.in:3002'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    
    if (whitelist.indexOf(req.header('Origin')) != -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);    