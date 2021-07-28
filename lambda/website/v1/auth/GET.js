
module.exports = function(event, cb) {


	var session;
	var user;

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





	], (err) => {
		if (err)
			return cb({ body: JSON.stringify( err, null, "\t") })

		cb({
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				session,
				user,
			}, null, "\t")
		})
	})
}