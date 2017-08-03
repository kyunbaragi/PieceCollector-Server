var express = require('express');
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

app.get('/places', function (req, res) {
	console.log("Requested!");
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

app.listen(80, function(){
	console.log('App listening on port 80');
});
