let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let MongoClient = require('mongodb').MongoClient;

let app = express();
const port = 8080;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const mongoConnection = {
    url: "mongodb://admin:1234567890ooo@ds251223.mlab.com:51223/noisemapdb",
    dbname: "noisemapdb"
};

var db_object = {};
MongoClient.connect(mongoConnection.url, function (err, client) {
	if (err) throw err

	db_object = client.db(mongoConnection.dbname);
	console.log(db_object);
});




app.use('/', (req, res) => {
	return res.render('index', {
		title: 'NoiseMap'
	});
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	return res.render('error');
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	return res.render('error');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))