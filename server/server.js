/**
 * Created by Yigit Yesilpinar on 29.04.2017.
 *
 * Game of Three Server, Express.js and socket.io Web Socket implementation with MongoDB and Mongoose
 *
 */

/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import compression from 'compression';

import favicon from "serve-favicon";

import  bodyParser from 'body-parser';
import apiRouteConfig from "./configurations/apiRoutesConfig";

import io from 'socket.io';
import {registerEvents} from './socket/events';

// process.argv[2] is the argument passed from command, node server.js --development
let isDevelopment = (process.argv[2] != undefined && process.argv[2] === "--development");

const host = "127.0.0.1";
const port = process.env.PORT || 4444;
const app = express();

app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use(favicon(path.resolve(__dirname + '/favicon.ico')));

express.static.mime.define({"text/css": ["css"]});
express.static.mime.define({"application/x-font-woff": ["woff"]});
express.static.mime.define({"application/x-font-ttf": ["ttf"]});
express.static.mime.define({"application/vnd.ms-fontobject": ["eot"]});
express.static.mime.define({"font/opentype": ["otf"]});

// Allowed api routes but Sockets implemented instead
apiRouteConfig(app);

// All other request are not allowed
app.get('*', function(req, res) {
    res.status(404).send('NOT FOUND');
});

const server = app.listen(port, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log(`Express server listening at http://${host}:${port}`);
    }
});

// Create a Socket.IO instance, passing it our server
let socket = io.listen(server);
registerEvents(socket);

export default app;
