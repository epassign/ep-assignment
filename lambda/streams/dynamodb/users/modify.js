
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

		// notify authenticated user
		(cb) => {
			if ( rec.coins === old_rec.coins )
				return cb() // skip

			console.log("Pusher user_id=", rec.user_id, " channel=", _realtime_get_channel( rec.user_id )  )

			pusher.trigger(_realtime_get_channel( rec.user_id ) , 'coins', {
				coins: rec.coins
			})

			cb()
		},

		// notify global users (to refresh the leaderboard)
		// this should be optimized to notify users to refresh only if the current user is in top 10
		(cb) => {
			if ( rec.coins === old_rec.coins )
				return cb() // skip

			pusher.trigger( global_realtime_channel , 'top', {})
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