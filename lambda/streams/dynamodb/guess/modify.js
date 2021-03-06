


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

			pusher.trigger( global_realtime_channel, 'guess', {})

			cb()
		},

	], function(err) {
		cb(err)
	})
}