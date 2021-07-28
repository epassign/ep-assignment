
module.exports = function(event, cb) {




	//var history = [];

	var usd_history = {}
	for (let start = new Date().getTime() - (1000 * 60*60 ); start <= new Date().getTime(); start+=1000*30 ) {
		usd_history[ new Date(new Date(start).toISOString().slice(0,16) + ':00.00Z').getTime() ] = 0
	}
	var eur_history = {}
	for (let start = new Date().getTime() - (1000 * 60*60 ); start <= new Date().getTime(); start+=1000*30 ) {
		eur_history[ new Date(new Date(start).toISOString().slice(0,16) + ':00.00Z').getTime() ] = 0
	}

	async.waterfall([

		( cb ) => {
			DynamoDB
				.table('btc_history')
				.where('all').eq( 1 )
				.desc()
				.limit(60)
				.query()
				.then(( data ) => {

					//history = data
					data.map( ( d ) => {
						usd_history[ new Date( d.minute + ':00.00Z').getTime() ] = d.usd
						eur_history[ new Date( d.minute + ':00.00Z').getTime() ] = d.eur
					})

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
				history: {
					usd: usd_history,
					eur: eur_history,
				},
			}, null, "\t")
		})
	})
}