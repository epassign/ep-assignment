
module.exports = function(event, cb) {



	var username = (event._POST.username || '').toLowerCase()
	var session_id = 'xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxy'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); })
	var new_user_id = 'user-xxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); })


	async.waterfall([

		( cb ) => {

			if ( !username )
				return cb({ success: false, errorCode: 'INVALID_USERNAME'})

			if ( ! username.match(/^[a-z0-9]+$/u) )
				return cb({ success: false, errorCode: 'INVALID_USERNAME', errorMessage: 'Username can only contain letts and numbers'})

			DynamoDB
				.table('users')
				.index('username-index')
				.where('username').eq( username )
				.query()
				.then(( users ) => {
					if (users.length )
						return cb({success: false, errorCode: 'USER_EXISTS',})

					cb()
				})
				.catch((err) => {
					cb({success: false, errorCode: 'TMP_USER_ERR',})
				})
		},

		// validations
		( cb ) => {
			if ( typeof event._POST.password !== 'string' )
				return cb({ success: false, errorCode: 'INVALID_PASSWORD'})
			
			if ( event._POST.password.length < 3 )
				return cb({ success: false, errorCode: 'PASSWORD_SHORT'})

			if ( typeof event._POST.name !== 'string' )
				return cb({ success: false, errorCode: 'INVALID_NAME'})

			if ( ! event._POST.name.match(/^[a-zA-Z àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u) )
				return cb({ success: false, errorCode: 'INVALID_NAME'})

			cb()
		},



		// create user
		( cb ) => {

			var payload = {
				user_id: new_user_id,
				username: username,
				password: bcrypt.hashSync( event._POST.password ),
				name: event._POST.name,

				created_at: new Date().getTime(),
				status: 'ACTIVE', // no verification this time

				guess_id: null,
				coins: 0,

			}

			DynamoDB
				.table('users')
				.insert_or_replace( payload )
				.then(() => {
					session_id = 'xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxy'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); })
					cb()
				})
				.catch((err) => {
					cb({success: false, errorCode: 'SIGNUP_FAILED', errorMessages: 'Signup failed' })
				})
		},

		// create the session
		( cb ) => {
			DynamoDB
				.table('sessions')
				.insert_or_replace({
					session_id: session_id,
					user_id: new_user_id,
					created_at: new Date().getTime(),
				})
				.then(() => {
					cb()
				})
				.catch((err) => {
					cb({ success:false, errorCode: 'TMP_SESSION_ERR', errorMessages: 'Failed creating session'})
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