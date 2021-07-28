
module.exports = function(event, cb) {


	var session;
	var user;
	var guess;

	async.waterfall([

		// step1, get session
		( cb ) => {

			if (!event._COOKIES.sid)
				return cb({ success: false, })

			DynamoDB
				.table('sessions')
				.where('session_id').eq( event._COOKIES.sid )
				.get()
				.then(( data ) => {
					if (!Object.keys(data).length)
						return cb({ success: false, })

					session=data;
					cb()
				})
				.catch(( err ) => {
					return cb({ success: false, errorCode: 'TMP_ERR'})
				})
		},


		( cb ) => {
			DynamoDB
				.table('users')
				.where('user_id').eq( session.user_id )
				.get()
				.then(( data ) => {
					if (!Object.keys(data).length)
						return cb({success: false, errorCode: 'USER_NOT_FOUND',})

					user = data

					cb()
				})
				.catch((err) => {
					cb({success: false, errorCode: 'TMP_ERR',})
				})
		},


		// get user's current guess
		( cb ) => {

			if ( !user.guess_id ) 
				return cb()

			DynamoDB
				.table('guess')
				.where('user_id').eq( session.user_id )
				.where('guess_id').eq( user.guess_id )
				.get()
				.then(( data ) => {
					if (!Object.keys(data).length)
						return cb({success: false, errorCode: 'NOT_FOUND',}) // guess not found but linked to the user, maybe delete it from user

					guess = data

					cb()
				})
				.catch((err) => {
					cb({success: false, errorCode: 'TMP_ERR',})
				})
		},


	], (err) => {
		if (err)
			return cb({ body: JSON.stringify( err, null, "\t") })

		cb({
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				session,
				user: {
					user_id: user.user_id,
					username: user.username,
					name: user.name,
					avatar: 'https://i.imgur.com/C4egmYM.jpg',
				},
				guess,
			}, null, "\t")
		})
	})
}