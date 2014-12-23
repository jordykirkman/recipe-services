var express = require('express');
var app = express();
var router = express.Router();
var http = require('http');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

module.exports = app;

router.use(function(req, res, next){

	var appid = process.env.appid;
	var apikey = process.env.apikey;

	req.header("X-Parse-Application-Id", appid);
	req.header("X-Parse-REST-API-Key", apikey);
	req.header("Content-Type", "application/json");
	if(req.get("X-Parse-Session-Token")){
		req.header("X-Parse-Session-Token", req.get("X-Parse-Session-Token"));
	}
	
	next();
});

// user routes
var user = require('./user');
router.get('/users/:id', user.getById);
router.post('/users', user.post);
router.get('/login', user.login);
router.put('/users/:id', user.update);


// book routes
var book = require('./book');
router.get('/books', book.getAll);
router.get('/books/:id', book.getById);
router.post('/books', book.post);
router.put('/books/:id', book.update);


// book routes
var recipe = require('./recipe');
router.get('/recipes', recipe.getAll);
router.get('/recipes/:id', recipe.getById);
router.post('/recipes', recipe.post);
router.put('/recipes/:id', recipe.update);

app.use('/', router);