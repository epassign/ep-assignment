
module.exports = function(event, cb) {

console.log("guess", event )
	var session;
	var user;
	var new_guess_id = ((new Date().getTime()* 1000) + Math.round(Math.random() * 1000)).toString(16);

	async.waterfall([

		// validate post
		( cb ) => {
			if (['up','down'].indexOf( event._POST.next ) === -1 )
				return cb({ success: false, errorMessage: 'Invalid prediction, should be up or down' })

			cb()
		},


		// get session
		( cb ) => {

			if (!event._COOKIES.sid)
				return cb({ success: false, errorMessage: 'You must be logged in' })

			DynamoDB
				.table('sessions')
				.where('session_id').eq( event._COOKIES.sid )
				.get()
				.then(( data ) => {
					if (!Object.keys(data).length)
						return cb({ success: false, errorMessage: 'You must be logged in' })

					session=data;
					cb()
				})
				.catch(( err ) => {
					cb({ success: false, errorCode: 'TMP_ERR', errorMessage: 'Failed getting your session', debug: err })
				})
		},


		// get user
		( cb ) => {
			DynamoDB
				.table('users')
				.where('user_id').eq( session.user_id )
				.get()
				.then(( data ) => {
					if (!Object.keys(data).length)
						return cb({success: false, errorCode: 'USER_NOT_FOUND', errorMessage: 'Failed getting your session' })


					if (user.hasOwnProperty('guess_id') )
						return cb({success: false, errorCode: 'USER_NOT_FOUND', errorMessage: 'Another guess in progress' })

					user = data

					cb()
				})
				.catch((err) => {
					cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'Failed getting your session' })
				})
		},


		// get the most recent BTC rate and make sure it is not outdated
		( cb ) => {
			DynamoDB
				.table('btc_history')
				.where('all').eq( 1 )
				.desc()
				.limit(1)
				.query()
				.then(( data ) => {
					if (!data.length)
						return cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'No BTC data yet'})

					if (data[0].usd !== event._POST.rate )
						return cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'Guess failed, BTC rate changed in the meantime'})

					cb()
				})
				.catch((err) => {
					cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'Error getting the most recent BTC rate'})
				})
		},


		// save the guess
		( cb ) => {
			DynamoDB
				.transact()
					.table('users')
						.where('user_id').eq( user.user_id )
						.if('guess_id').not_exists()
						.update({guess_id: new_guess_id})
					.table('guess')
						.insert( { 
							user_id: user.user_id,
							guess_id: new_guess_id,
							created_at: new Date().getTime(),
							next: this._POST.next,
							currency: 'USD',
							initial_rate: event._POST.rate,
							final_rate: null,
						} )
				.write()
				.then(( data ) => {
					cb()
				})
				.catch((err) => {
					cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'Failed creating new guess'})
				})
		},


	], (err) => {
		if (err)
			return cb({ body: JSON.stringify( err, null, "\t") })

		cb({
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				guess_id: new_guess_id,
			}, null, "\t")
		})
	})
}