
module.exports = function(event, cb) {



	var username = (event._POST.username || '').toLowerCase()
	var password = (event._POST.password || '').trim()

	var session_id = 'xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxy'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); })
	var new_user_id = 'user-xxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); })

	var user;

	async.waterfall([

		( cb ) => {
			DynamoDB
				.table('users')
				.index('username-index')
				.where('username').eq( username )
				.query()
				.then(( users ) => {
					if (!users.length )
						return cb({success: false, errorCode: 'USER_NOT_FOUND',})

					user = users[0]

					cb()
				})
				.catch((err) => {
					cb({success: false, errorCode: 'TMP_ERR',})
				})
		},


		( cb ) => {
			try {
				if (!bcrypt.compareSync( password , user.password || '')) {
					return cb({success: false, errorCode: 'INVALID_PASSWORD'})
				}
			} catch (e) {
				return cb({success: false, errorCode: 'TMP_ERR', })
			}

			// fine
			cb()
		}

		// create the session
		( cb ) => {
			DynamoDB
				.table('sessions')
				.insert_or_replace({
					session_id:  session_id,
					user_id: user.user_id,
					created_at: new Date().getTime(),
				})
				.then(() => {
					cb()
				})
				.catch((err) => {
					cb({ success:false, errorCode: 'TMP_ERR', errorMessages: 'Failed creating session'})
				})
		}


	], (err) => {
		if (err)
			return cb({ body: JSON.stringify( err, null, "\t") })

		cb({
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				user_id: new_user_id,
				session_id,
			}, null, "\t")
		})
	})
}