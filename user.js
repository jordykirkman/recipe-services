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
			url: 'https://api.parse.com/1/users?' + params,
			method: 'GET',
			headers: req.headers
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

		// send back nothing, we do not allow someone to fetch all users
		var formattedResponse = {};
		formattedResponse['users'] = [];
		res.send(formattedResponse);
	}
}

// get user by id
exports.getById = function (req, res) {
	var id = req.params.id;

	var options = {
		url: 'https://api.parse.com/1/users/' + id,
		method: 'GET',
		headers: req.headers
	}

	request(options, function (error, response, body) {
		var user = JSON.parse(body);

	  	// if theres an error
	  	if(user.error){
	  		res.send(user);
	  	} else {
		  	// otherwise we need the user's books

		  	// lets format the first part of our response
			returnObj = {};
		  	returnObj['user'] = user;
		  	returnObj['user']['id'] = user.objectId;

		  	// lets get the user's books
			var subHeaders = req.headers;
			subHeaders["X-Parse-Session-Token"] = user.sessionToken;

		  	// this is the object parse needs to search books by user id
		  	var params = encodeURIComponent('where={"users":"' + user.objectId + '"}');
			var subOptions = {
				url: 'https://api.parse.com/1/classes/Book?' + params,
				headers: subHeaders,
				method: 'GET',
			}

			// put the books into the users books array, ember likes it this way
			request(subOptions, function (error, response, body) {
				var books = JSON.parse(body).results;
		    	returnObj['books'] = books;
			  	books.forEach(function(book){
			  		book.id = book.objectId;
			  		returnObj['user']['books'] = [];
			  		returnObj['user']['books'].push(book.objectId);
			  	});
			  	res.send(returnObj);
		    });
		}
	})
}

// create a new user
exports.post = function (req, res) {
	var data = req.body;

	var options = {
		url: 'https://api.parse.com/1/classes/Book/',
		headers: req.headers,
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

	var options = {
		url: 'https://api.parse.com/1/classes/Book/' + id,
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

// login with user creds
exports.login = function (req, res) {
	var u = req.query.username;
	var p = req.query.password;

	var returnObj = {};

	var options = {
		url: 'https://api.parse.com/1/login?username=' + u + '&password=' + p,
		method: 'GET',
		headers: req.headers
	}

	request(options, function (error, response, body) {
	  	var user = JSON.parse(body);

	  	// if theres an error
	  	if(user.error){
	  		res.send(user);
	  	} else {
		  	// otherwise we need the user's books
		  	user.id = user.objectId;

			var subHeaders = req.headers;
			subHeaders["X-Parse-Session-Token"] = user.sessionToken;

		  	returnObj['user'] = user;

		  	// this is the object parse needs to search books by user id
		  	var params = encodeURIComponent('where={"users":"' + user.objectId + '"}');
			var subOptions = {
				url: 'https://api.parse.com/1/classes/Book?' + params,
				headers: subHeaders,
				method: 'GET',
			}

			// put the books into the users books array, ember likes it this way
			request(subOptions, function (error, response, body) {
				var books = JSON.parse(body).results;
		    	returnObj['books'] = books;
			  	books.forEach(function(book){
			  		book.id = book.objectId;
			  		returnObj['user']['books'] = [];
			  		returnObj['user']['books'].push(book.objectId);
			  	});
			  	res.send(returnObj);
		    });
		}
    });
}