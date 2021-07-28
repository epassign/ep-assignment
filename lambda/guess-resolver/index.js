


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

		// check if rate has changed
		( cb ) => {

			console.log("initial rate=", event._POST.guess.initial_rate )
			console.log("current rate=", current_usd_rate )
			
			if ( event._POST.guess.initial_rate === current_usd_rate )
				return 
					console.log("rate didnt change, sleeping") || cb({
						_POST: event._POST,
						sleep: 30, // speep 30 seconds
						end: false, // exit if failed
					})

			cb()
		},



		// rate has changed, resolve and exit
		( cb ) => {

			var points = 0;

			if (event._POST.guess.initial_rate > current_usd_rate) {
				// went down
				points = event._POST.guest.down === 'down' ? 1 : -1;
			} else {
				// went up
				points = event._POST.guest.down === 'up'   ? 1 : -1;
			}


			console.log("got ", points, " points")

			cb()
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
