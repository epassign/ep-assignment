
module.exports = function(record, cb ) {
	var rec = {}
	try {
		rec = dynamodb_util.normalizeItem(record.NewImage)
	} catch (e) {console.log("failed unserialize", err )}

	var old_rec = {}
	try {
		old_rec = dynamodb_util.normalizeItem(record.OldImage)
	} catch (e) {console.log("failed unserialize old", err )}

	console.log("rec=", rec )
	console.log("old_rec=", old_rec )

	async.waterfall([


		(cb) => {
			if ( rec.coins === old_rec.coins )
				return cb() // skip

			console.log("Pusher user_id=", rec.user_id, " channel=", _realtime_get_channel( rec.user_id )  )

			pusher.trigger(_realtime_get_channel( rec.user_id ) , 'coins', {
				coins: rec.coins
			})

			cb()
		},

		(cb) => {
			if ( rec.guess_id === old_rec.guess_id )
				return cb() // skip

			console.log("Pusher user_id=", rec.user_id, " channel=", _realtime_get_channel( rec.user_id )  )

			pusher.trigger(_realtime_get_channel( rec.user_id ) , 'guess', {
				guess_id: rec.guess_id
			})

			cb()
		},

	], function(err) {
		cb(err)
	})
}