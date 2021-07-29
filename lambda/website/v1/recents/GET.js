
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