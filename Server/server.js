const EventEmitter = require('events');
const crypto = require('crypto');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const http = require('http');
const fileSystem = require('fs');
const upperCase = require('upper-case');
const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

const app = express();
const mongoConnection = {
    url: "mongodb://admin:1234567890ooo@ds251223.mlab.com:51223/noisemapdb",
    dbname: "noisemapdb"
};
const mqttConnection = {
    adress: "mqtt://m2m.eclipse.org",
    port: 1883
};
const local = {
    port: 8080,
    host: '127.0.0.1'
}

let db_object = {}; // DB object
let mqttClient;

// Variables to be constantly sent and updated
let sensors = [];
let currentHour = 0;

let findSensorId = (guid) => {
    for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].guid == guid) {
            return i;
        }
    }
    return -1;
}
let changeSensorLocation = (guid, coord) => {
    let id = findSensorId(guid);
    let coordData = coord.split(';');
    if (id == -1) {
        sensors.push({
            'guid':guid,
            'coord' : [parseFloat(coordData[0]), parseFloat(coordData[1])],
            'value': -1
        });
        console.log("Added new sensor" + JSON.stringify(sensors[sensors.length - 1]));
        db_object.collection("sensors").insertOne({
            'guid':sensors[sensors.length - 1].guid,
            'coord':sensors[sensors.length - 1].coord,
            'value':sensors[sensors.length - 1].value,
            'timestamp': Date.now()
        });
    } else {
        sensors[id].coord = [parseFloat(coordData[0]),parseFloat(coordData[1])];
        db_object.collection("sensors").insertOne({
            'guid':sensors[id].guid,
            'coord':sensors[id].coord,
            'value':sensors[id].value,
            'timestamp': Date.now()
        });
    }
}
let changeSensorValue = (guid, value) => {
    let id = findSensorId(guid);
    if (id == -1) {
        sensors.push({
            'guid' : guid,
            'coord' : [45.804930, 24.156635], // Random coords
            'value' : parseInt(value)
        });
        console.log("Added new sensor" + JSON.stringify(sensors[sensors.length - 1]));
        db_object.collection("sensors").insertOne({
            'guid':sensors[sensors.length - 1].guid,
            'coord':sensors[sensors.length - 1].coord,
            'value':sensors[sensors.length - 1].value,
            'timestamp': Date.now()
        });
    } else {
        sensors[id].value = parseInt(value);
        db_object.collection("sensors").insertOne({
            'guid':sensors[id].guid,
            'coord':sensors[id].coord,
            'value':sensors[id].value,
            'timestamp': Date.now()
        });
    }
}

MongoClient.connect(mongoConnection.url,{ useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    else console.log('\x1b[32m%s\x1b[0m','Connected to database ' + mongoConnection.dbname + ' at adress ' + mongoConnection.url) 
    db_object = db.db(mongoConnection.dbname);

    // Code to be executed on system startup
    // MQTT connect
    mqttClient = mqtt.connect(mqttConnection.adress);

    //Server configuration
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    // MQTT messages
    mqttClient.on('connect', () => {
        console.log('\x1b[32m%s\x1b[0m','Connected to MQTT server at adress ' + mqttConnection.adress);
        mqttClient.subscribe('hacktmsibiu');
        mqttClient.subscribe('hacktmsibiu/#')
    });

    mqttClient.on('message', (topic, message) => {
        if (topic === 'hacktmsibiu') {
            currentHour = parseInt(message.toString());
        } else {
            //console.log(topic + " " + message.toString());

            // Expected guid in position 2
            let data = topic.split('/');
            if (data[2] == "coord") {
                changeSensorLocation(data[1],message.toString());
            } else if (data[2] == "value") {
                changeSensorValue(data[1],message.toString())
            } else {
                console.log("Unknown data type found: " + data[2]);
            }
        }
    });

    // Server messages
    app.get('/', (req, res) => {
        res.sendFile('/index.html');
    });

    app.post('/', (req,res) => {
        if (req.body.type == 'getValues') {
            res.send({
                'hour': currentHour, 
                'sensors': sensors
            });
        } else {
            res.send("Request unknown");
        }
    });

    app.listen(local.port, local.host, () => {
        console.log('\x1b[32m%s\x1b[0m','Listening at http://' + local.host + ':' + local.port);
    });
    
});
