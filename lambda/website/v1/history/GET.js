
module.exports = function(event, cb) {

	var usd_history = {}
	var eur_history = {}
	var current = {
		usd: null,
		eur: null,
	}

	var raw;
	async.waterfall([

		( cb ) => {
			DynamoDB
				.table('btc_history')
				.where('all').eq( 1 )
				.desc()
				.limit(60)
				.query()
				.then(( data ) => {

					raw = data;

					if (data.length) {
						current.usd = data[0].usd
						current.eur = data[0].eur
					}

					for (let start = new Date().getTime() - (1000 * 60*60 ); start <= new Date( data[0].minute + ':00.00Z' ).getTime(); start+=1000*30 ) {
						usd_history[ new Date(new Date(start).toISOString().slice(0,16) + ':00.00Z').getTime() ] = 0
					}

					for (let start = new Date().getTime() - (1000 * 60*60 ); start <= new Date( data[0].minute + ':00.00Z' ).getTime(); start+=1000*30 ) {
						eur_history[ new Date(new Date(start).toISOString().slice(0,16) + ':00.00Z').getTime() ] = 0
					}

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
					usd: 
						Object.keys(usd_history).map((k) => {
							return [
								parseInt(k),
								usd_history[k]
							]
						}),
					eur:
						Object.keys( eur_history).map((k) => {
							return [
								parseInt(k),
								eur_history[k]
							]
						}),
				},
				current,
				raw,
			}, null, "\t")
		})
	})
}