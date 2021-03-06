
var crypto = require('crypto')

var REALTIME_HASH = '2557806818'
var _realtime_get_channel = function( subject ) {
	return crypto.createHash('md5').update( REALTIME_HASH + '/'+ subject ).digest("hex")
}

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
					return cb({ success: false, errorCode: 'TMP_SESSION_ERR', debug: err, })
				})
		},

		// step 2, get user
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
					cb({success: false, errorCode: 'TMP_USER_ERR', debug: err,})
				})
		},


		// get user's current guess
		( cb ) => {

			if ( user.guess_id === null ) 
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
					cb({success: false, errorCode: 'TMP_GUESS_ERR', debug: err,})
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
					coins: user.coins,
					avatar: 'https://i.imgur.com/C4egmYM.jpg',

					realtime: _realtime_get_channel( user.user_id ),
				},
				guess,
			}, null, "\t")
		})
	})
}