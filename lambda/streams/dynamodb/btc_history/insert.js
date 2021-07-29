
module.exports = function(record, cb ) {
	var rec = {}
	try {
		rec = dynamodb_util.normalizeItem(record.NewImage)
	} catch (e) {console.log("failed unserialize", err )}

	console.log("rec=", rec )

	async.waterfall([


		(cb) => {
			pusher.trigger( global_realtime_channel , 'btc', {})
			cb()
		},

	], function(err) {
		cb(err)
	})
}