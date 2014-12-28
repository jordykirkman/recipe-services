var request = require('request');

// get all books or get by query string
exports.getAll = function (req, res) {

	// if a list of ids is in the query string, fetch them all
	if(req.query.ids){

		var objects = [];
		req.query.ids.forEach(function(id){
			objects.push('{"objectId":"' + id + '"}');
		});
		var params = encodeURIComponent('where={"$or":[' + objects.toString() + ']}');

		var options = {
			url: 'https://api.parse.com/1/classes/Book?' + params,
			method: 'GET',
			headers: req.headers
		}

		request(options, function (error, response, body) {
			var formattedResponse = {};
			formattedResponse['books'] = [];

		  	JSON.parse(body).results.forEach(function(item){
		  		item.id = item.objectId;
		  		formattedResponse['books'].push(item);
		  	});
		    res.send(formattedResponse);

		})

	} else {

		// otherwise get them all
		var options = {
			url: 'https://api.parse.com/1/classes/Book/',
			method: 'GET',
			headers: req.headers
		}

		request(options, function (error, response, body) {

		  	var finalResponse = JSON.parse(body);
		  	finalResponse.id = finalResponse.objectId;
		    res.send(finalResponse);

		})
	}
}

// get user by id
exports.getById = function (req, res) {

	var id = req.params.id;

	var options = {
		url: 'https://api.parse.com/1/classes/Book/' + id,
		method: 'GET',
		headers: req.headers
	}

	request(options, function (error, response, body) {

	  	var finalResponse = JSON.parse(body);
	  	finalResponse.id = finalResponse.objectId;
	    res.send(finalResponse);

	})
}

// create a new book
exports.post = function (req, res) {
	var data = req.body;

	var options = {
		url: 'https://api.parse.com/1/classes/Book/',
		headers: req.headers,
		body: data,
		method: 'post'
	}

	request(options, function (error, response, body) {
		  	var finalResponse = JSON.parse(body);
		  	finalResponse.id = finalResponse.objectId;
		    res.send(finalResponse);
	    }
	);
}

// update book by id
exports.update = function (req, res) {
	var id = req.params.id;
	var data = req.body;

	var options = {
		url: 'https://api.parse.com/1/classes/Book/',
		headers: req.headers,
		body: data,
		method: 'put'
	}

	request(options, function (error, response, body) {
		  	var finalResponse = JSON.parse(body);
		  	finalResponse.id = finalResponse.objectId;
		    res.send(finalResponse);
	    }
	);
}