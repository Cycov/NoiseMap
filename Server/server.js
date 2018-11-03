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
        mqttClient.subscribe('')
    });

    mqttClient.on('message', (topic, message) => {
        if (topic === 'hacktmsibiu') {
            currentHour = parseInt(message.toString());
        }
        else if (topic === '')
    });

    //Server messages
    app.get('/', function(req, res) {
        res.sendFile('/index.html');
    });

    app.post('/',function(req,res){
        //req.body.pew
    });

    app.listen(local.port,local.host,function(){
        console.log('\x1b[32m%s\x1b[0m','Listening at http://' + local.host + ':' + local.port);
    });
    
});
