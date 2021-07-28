


AWS = require('aws-sdk')
DynamoDB = require('@awspilot/dynamodb')()
DynamoDB.schema({ TableName: 'users', KeySchema: [ {AttributeName: 'user_id' } ] })
DynamoDB.schema({ TableName: 'guess', KeySchema: [ {AttributeName: 'user_id' }, {AttributeName: 'guess_id' } ] })

async = require('async')


exports.handler = function( event, context ) {

	console.log("event=", JSON.stringify(event, null, "\t"))

	var default_sleep = 60; // 1 minute

	var current_usd_rate;
	var user;

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
			
			if ( event._POST.guess.initial_rate !== current_usd_rate )
				return cb()

			console.log("rate didnt change, sleeping")
			
			cb({
				_POST: event._POST,
				sleep: 30, // speep 30 seconds
				end: false, // exit if failed
			})

		},


		// get the user
		( cb ) => {
			DynamoDB
				.table('users')
				.where('user_id').eq( event._POST.guess.user_id )
				.get()
				.then(( data ) => {
					if (!Object.keys(data).length)
						return cb({
							_POST: event._POST,
							sleep: 60*60*24,
							end: true, // exit if failed
						})

					user = data;
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

		// rate has changed, resolve and exit
		( cb ) => {

			var coins = 0;

			if (event._POST.guess.initial_rate > current_usd_rate) {
				// went down
				coins = event._POST.guess.next === 'down' ? 1 : -1;
			} else {
				// went up
				coins = event._POST.guess.next === 'up'   ? 1 : -1;
			}


			console.log("got ", coins, " points")
			DynamoDB
				.transact()
					.table('users')
						.where('user_id').eq( event._POST.guess.user_id )
						.if('guess_id').eq(event._POST.guess.guess_id)
						.update({ 
							guess_id: null,
							coins: (user.coins || 0) + coins,
						})
					.table('guess')
						.where('user_id').eq( event._POST.guess.user_id )
						.where('guess_id').eq(event._POST.guess.guess_id)
						.update( {
							final_rate: current_usd_rate,
							coins,
						})
				.write()
				.then(( data ) => {
					cb({
						_POST: event._POST,
						sleep: 30, // speep 30 seconds
						end: true, // exit if failed
					})
				})
				.catch((err) => {
					console.log( err )
					cb({
						_POST: event._POST,
						sleep: 30, // speep 30 seconds
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
