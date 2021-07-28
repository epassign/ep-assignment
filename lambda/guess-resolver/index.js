


AWS = require('aws-sdk')
DynamoDB = require('@awspilot/dynamodb')()
async = require('async')


exports.handler = function( event, context ) {

	console.log("event=", JSON.stringify(event, null, "\t"))

	var default_sleep = 60; // 1 minute


	async.waterfall([


	], function(err) {
		if (err) {
			if (err.end === true )
				console.log("END", err.reason )

			return context.done(null,err)
		}

		console.log('End. sleeping ', Math.floor(default_sleep/60), ' minutes' )
		context.done(null,{
			_POST: event._POST,
			sleep: default_sleep,
			end: false,
		})

	})
}
