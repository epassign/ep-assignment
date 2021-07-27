

const payloader = require('./payload');

exports.handler = function( event, context, cb ) {

	event = payloader(event);

	cb(null, {
		statusCode: 404,
		headers: {'contentType': 'text/html',},
		body: '[' + event._PATH + '] Not Found! <br> ' + JSON.stringify( event, null, "\t"),
	})

}