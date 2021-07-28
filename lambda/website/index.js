// globals
fs    = require('fs')
bcrypt = require('bcryptjs');
async = require('async');
DynamoDB = require('@awspilot/dynamodb')()


const payloader = require('./payload');

const aliases = {
	'/': '/index',
	'/account': '/index',
}

exports.handler = function( event, context, cb ) {

	event = payloader(event);

	if (aliases[event._PATH])
		event._PATH = aliases[event._PATH]

	// pages
	if ( event._METHOD === 'GET' && fs.existsSync('./pages' + event._PATH + '.js' ) ) {
		require( './pages' + event._PATH  )( event, function( ret ) {
			cb(null,{
				statusCode: ret.statusCode || 503,
				headers: {
					"Content-Type": ret.ContentType || 'text/html',
					Location: ret.location || undefined,
				},
				body: ret.body,
			})
		})
		return;
	}

	// rest apis
	if ( event._PATH.indexOf('/v1/') === 0 ) {
		if ( fs.existsSync('.' + event._PATH + '/' + event._METHOD + '.js') ) {
				require( '.' + event._PATH + "/" + event._METHOD + '.js' )( event, function( ret ) {
					cb(null,{
						statusCode: ret.statusCode || 503,
						headers: {
							"Content-Type": ret.ContentType || 'application/json',
							"Content-Disposition": ret.ContentDisposition,
							Location: ret.location || undefined,
						},
						body: ret.body,
					})
				})
				return;
		}

		return cb(null, {
			statusCode: 200,
			headers: { 'contentType': 'application/json', },
			body: JSON.stringify( event, null, "\t" )
		})
	}


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