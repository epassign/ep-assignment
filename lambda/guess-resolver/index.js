


AWS = require('aws-sdk')
DynamoDB = require('@awspilot/dynamodb')()
async = require('async')


exports.handler = function( event, context ) {

	console.log("event=", JSON.stringify(event, null, "\t"))

	var default_sleep = 60; // 1 minute

	var current_usd_rate;

	async.waterfall([


		// get the most recent BTC rate
		( cb ) => {
			DynamoDB
				.table('btc_history')
				.where('all').eq( 1 )
				.desc()
				.limit(1)
				.query()
				.then(( data ) => {
					if (!data.length)
						return cb({
							_POST: event._POST,
							sleep: 60*60*24,
							end: true, // exit if failed
						})

					console.log( data[0] )
					current_usd_rate = data[0].usd

					cb()
				})
				.catch((err) => {
					return cb({
						_POST: event._POST,
						sleep: 60*60*24,
						end: true, // exit if failed
					})
				})
		},



		
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
