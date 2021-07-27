
fs    = require('fs')
const payloader = require('./payload');

const aliases = {
	'/': '/index',
}

exports.handler = function( event, context, cb ) {

	event = payloader(event);

	if (aliases[event._PATH])
		event._PATH = aliases[event._PATH]


	// fallback to 404, page not found 
	require( './pages/404' )( event, function( ret ) {
		cb(null,{
			statusCode: ret.statusCode || 503,
			headers: {
				"Content-Type": 'text/html',
			},
			body: ret.body,
		})
	})
}