var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
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
var jsonParser = bodyParser.json();

app.post('/users/new', jsonParser, function (req, res) {
	console.log("/users/new requested");
	var userID = req.body.id;
	var userEmail = req.body.email;
	console.log(userID + " / " + userEmail);
});

app.post('/users', jsonParser, function (req, res) {
	console.log("/users requested");
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
