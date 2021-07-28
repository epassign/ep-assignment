
module.exports = function(event, cb) {




	var history = [];

	async.waterfall([

		( cb ) => {
			DynamoDB
				.table('btc_history')
				.where('all').eq( 1 )
				.desc()
				.limit(60)
				.query()
				.then(( data ) => {

					history = data

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
				history,
			}, null, "\t")
		})
	})
}