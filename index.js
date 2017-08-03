var express = require('express');
var app = express();

app.get('/places', function(req, res) {
	console.log("Requested");
	res.send("HAHA");
});

app.listen(80, function(){
	console.log('App listening on port 80');
});
