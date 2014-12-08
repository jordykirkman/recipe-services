var request = require('request');

// get all books or get by query string
exports.getAll = function (req, res) {

	var headers = {
		"X-Parse-Application-Id": req.get("X-Parse-Application-Id"),
		"X-Parse-REST-API-Key": req.get("X-Parse-REST-API-Key"),
		"X-Parse-Session-Token": req.get("X-Parse-Session-Token"),
		"Content-Type": "application/json",
	}

	// if a list of ids is in the query string, fetch them all
	if(req.query.ids){

		var objects = [];
		req.query.ids.forEach(function(id){
			objects.push('{"objectId":"' + id + '"}');
		});
		var params = encodeURIComponent('where={"$or":[' + objects.toString() + ']}');

		var options = {
			url: 'https://api.parse.com/1/users?' + params,
			method: 'GET',
			headers: headers
		}

		request(options, function (error, response, body) {
			var formattedResponse = {};
			formattedResponse['users'] = [];

		  	JSON.parse(body).results.forEach(function(item){
		  		item.id = item.objectId;
		  		formattedResponse['users'].push(item);
		  	});
		    res.send(formattedResponse);

		})

	} else {

		// do nothing, we do not allow someone to fetch all users
		// if the app is trying to do this, it shouldnt
	}
}

// get user by id
exports.getById = function (req, res) {
	var id = req.params.id;

	var headers = {
		"X-Parse-Application-Id": req.get("X-Parse-Application-Id"),
		"X-Parse-REST-API-Key": req.get("X-Parse-REST-API-Key"),
		"X-Parse-Session-Token": req.get("X-Parse-Session-Token"),
		"Content-Type": "application/json",
	}

	var options = {
		url: 'https://api.parse.com/1/users/' + id,
		method: 'GET',
		headers: headers
	}

	request(options, function (error, response, body) {

	  	var finalResponse = JSON.parse(body);
	  	finalResponse.id = finalResponse.objectId;
	    res.send(finalResponse);

	})
}

// create a new user
exports.post = function (req, res) {
	var data = req.body;

	var headers = {
		"X-Parse-Application-Id": req.get("X-Parse-Application-Id"),
		"X-Parse-REST-API-Key": req.get("X-Parse-REST-API-Key"),
		"X-Parse-Session-Token": req.get("X-Parse-Session-Token"),
		"Content-Type": "application/json",
	}

	var options = {
		url: 'https://api.parse.com/1/classes/Book/',
		headers: headers,
		body: data,
		method: 'post'
	}

	request.post(options, function (error, response, body) {
		  	var finalResponse = JSON.parse(body);
		  	finalResponse.id = finalResponse.objectId;
		    res.send(finalResponse);
	    }
	);
}

// update user by id
exports.update = function (req, res) {
	var id = req.params.id;
	var data = req.body;

	var headers = {
		"X-Parse-Application-Id": req.get("X-Parse-Application-Id"),
		"X-Parse-REST-API-Key": req.get("X-Parse-REST-API-Key"),
		"X-Parse-Session-Token": req.get("X-Parse-Session-Token"),
		"Content-Type": "application/json",
	}

	var options = {
		url: 'https://api.parse.com/1/classes/Book/' + id,
		headers: headers,
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

// login with user creds
exports.login = function (req, res) {
	var u = req.params.username;
	var p = req.params.password;
	var returnObj = {};

	var options = {
		url: 'https://api.parse.com/1/login?username=/' + u + '&password=' + p,
		method: 'GET',
	}

	request(options, function (error, response, body) {
		  	user = JSON.parse(body);
		  	user.id = user.objectId;
		  	returnObj['user'] = user;

		  	var params = encodeURIComponent('where={"users":"' + user.objectId + '"}');
			var subOptions = {
				url: 'https://api.parse.com/1/classes/Book?' + params,
				method: 'GET',
			}
			request(options, function (error, response, body) {
			    	returnObj['books'] = body;
				  	returnObj.books.forEach(function(book){
				  		book.id = book.objectId;
				  		user.books.push(book.objectId);
				  	});
				  	res.send(returnObj);
			    }
			);

	    }
	);
}