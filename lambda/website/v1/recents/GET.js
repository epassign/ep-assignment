
module.exports = function(event, cb) {

	var recents = []

	async.waterfall([

		( cb ) => {
			DynamoDB
				.table('guess')
				.index('recents-index')
				.where('all').eq( 1 )
				.desc()
				.limit(10)
				.query()
				.then(( data ) => {

					recents = data;

					cb()
				})
				.catch((err) => {
					cb({success: false, errorCode: 'TMP_ERR',})
				})
		},


		// enrich each user
		function( cb ) {

			var db = DynamoDB.batch().table('users')

			recents.map(function(r) {
				db.get({user_id: r.user_id })
			})

			db.read(( err, data ) => {
				if (err)
					cb({success: false, errorCode: 'TMP_ERR',})

				recents = recents.map(function(r) {

				// 	data.users.map(function( user ) {
				// 		if (r.user_id === user.user_id)
				// 			r.user = {
				// 				user_id: user.user_id,
				// 				name: user.name,
				// 				username: user.username,
				// 				coins: user.coins,
				// 			};
				// 	})

					return r;
				})
				cb()

			})
		},

	], (err) => {
		if (err)
			return cb({ body: JSON.stringify( err, null, "\t") })

		cb({
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				recents,
			}, null, "\t")
		})
	})
}