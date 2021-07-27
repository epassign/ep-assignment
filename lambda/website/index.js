exports.handler = function( event, context, cb ) {
	cb(null, {
		statusCode: 404,
		headers: {'contentType': 'text/html',},
		body: '[' + event._PATH + '] Not Found!' + JSON.stringify( event, null, "\t"),
	})
}