
module.exports = function(event, cb) {

	var top = []

	async.waterfall([

		( cb ) => {
			DynamoDB
				.table('users')
				.index('top-index')
				.where('status').eq( 'ACTIVE' )
				.desc()
				.limit(10)
				.query()
				.then(( data ) => {

					top = data.map(( user) => {
						// filter out password
						return {
							user_id: user.user_id,
							username:    user.username,
							name: user.name,
							coins: user.coins,
						}
					}) ;

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
				top,
			}, null, "\t")
		})
	})
}