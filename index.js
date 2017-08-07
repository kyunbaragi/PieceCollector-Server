var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var conn = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'kyun27801!',
	database : 'piece_collector'
});
conn.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static('users'));

var jsonParser = bodyParser.json();
app.post('/users/new', jsonParser, function (req, res) {
	console.log("/users/new requested");
	var userID = req.body.id;
	var userEmail = req.body.email;
	var sql = "INSERT INTO users (_id, email, created) VALUES ('" + userID + "', '" + userEmail + "', NOW())";
	conn.query(sql, function (error, results, fields) {
		if (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		} else {
			var dir = './users/' + userID;
			if(!fs.existsSync(dir)) {
				fs.mkdirSync(dir)
			}
		}
	})
});


var _storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'users/' + req.query.user_id + '/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

var upload = multer({ storage: _storage });
app.post('/upload', upload.single('image'), function (req, res) {
	console.log("/upload requested");
	console.log('Uploaded:' + req.file.originalname);
	
	var userID = req.query.user_id;
	var placeID = req.query.place_id;
	var imageFile = req.file.originalname;
	var sql = "INSERT INTO records (user_id, place_id, image_path, memo, created) VALUES ('"
			+ userID + "', '"
			+ placeID + "', '"
			+ "http://128.199.209.152/images/" + userID + "/"  + imageFile + "/" + "', "
			+ "NULL, "
			+ "NOW())";
	conn.query(sql, function (error, results, fields) {
		if (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		} else {
			res.status(200).send('Success');
		}
	});		
});


app.get('/places', function (req, res) {
	console.log("/places requested");
	var sql = 'SELECT * FROM places';
	conn.query(sql, function (error, results, fields) {
		if (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		} else {
			res.json(results);
		}
	}); 
});

app.get('/versions/:table', function (req, res) {
	console.log("/versions/:table requested");
	var sql = "SELECT * FROM versions WHERE versions.name='" + req.params.table +"'";
	conn.query(sql, function (error, results, fields) {
		if (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		} else {
			res.send(results[0].version);		
		}
	}); 
});

app.listen(80, function(){
	console.log('App listening on port 80');
});
