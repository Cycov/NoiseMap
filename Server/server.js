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
const mqttConnection = 
{
    adress: "mqtt://m2m.eclipse.org",
    port: 1883
};
const local = {
port: 8080,
host: '127.0.0.1'
}

var dbo; //database object
var mqttClient;

//Varaibles to be constantly sent and updated
var sensors = [];
var currentHour = 0;

function findSensorId(guid)
{
    for (let i = 0; i < sensors.length; i++) {
        const element = sensors[i];
        if (element.guid == guid)
        {
            return i;
        }
    }
    return -1;
}
function changeSensorLocation(guid, coord)
{
    var id = findSensorId(guid);
    var coordData = coord.split(';');
    if (id == -1)
    {
        sensors.push({
            'guid':guid,
            'coord' : [parseFloat(coordData[0]),parseFloat(coordData[1])],
            'value': -1
        });
        console.log("Added new sensor" + JSON.stringify(sensors[sensors.length - 1]));
    }
    else
    {
        sensors[id].coord = [parseFloat(coordData[0]),parseFloat(coordData[1])];
    }
}
function changeSensorValue(guid, value)
{
    var id = findSensorId(guid);
    if (id == -1)
    {
        sensors.push({
            'guid' : guid,
            'coord' : [45.804930, 24.156635], //Random coords
            'value' : parseInt(value)
        });
        console.log("Added new sensor" + JSON.stringify(sensors[sensors.length - 1]));
    }
    else
    {
        sensors[id].value = parseInt(value);
    }
}

MongoClient.connect(mongoConnection.url,{ useNewUrlParser: true }, function(err, db){
    if (err) throw err;
    else console.log('\x1b[32m%s\x1b[0m','Connected to database ' + mongoConnection.dbname + ' at adress ' + mongoConnection.url) 
    dbo = db.db(mongoConnection.dbname);

    //Code to be executed on system startup
    //MQTT connect
    mqttClient = mqtt.connect(mqttConnection.adress);

    //Server configuration
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    //MQTT messages
    mqttClient.on('connect', () => {
        console.log('\x1b[32m%s\x1b[0m','Connected to MQTT server at adress ' + mqttConnection.adress);
        mqttClient.subscribe('hacktmsibiu');
        mqttClient.subscribe('hacktmsibiu/#')
    });

    mqttClient.on('message', (topic, message) => {
        if (topic === 'hacktmsibiu') 
        {
            currentHour = parseInt(message.toString());
        }
        else
        {
            //console.log(topic + " " + message.toString());

            //Expected guid in position 2
            var data = topic.split('/');
            if (data[2] == "coord")
                changeSensorLocation(data[1],message.toString());
            else if (data[2] == "value")
                changeSensorValue(data[1],message.toString())
            else
                console.log("Unknown data type found: " + data[2]);
        }
    });

    //Server messages
    app.get('/', function(req, res) {
        res.sendFile('/index.html');
    });

    app.post('/',function(req,res){
        if (req.body.type == 'getValues')
        {
            res.send({'hour': currentHour, 'sensors': sensors});
        }
        else
        {
            res.send("Request unknown");
        }
    });

    app.listen(local.port,local.host,function(){
        console.log('\x1b[32m%s\x1b[0m','Listening at http://' + local.host + ':' + local.port);
    });
    
});
