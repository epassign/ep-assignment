
const event_types = {
	"aws:s3": 's3',
	"aws:dynamodb": 'dynamodb',
}

AWS      = require("aws-sdk")
async = require("async")
crypto = require('crypto')
dynamodb_util = require('@awspilot/dynamodb-util')
DynamoDB = require('@awspilot/dynamodb')()

var Pusher = require('pusher')
pusher = new Pusher({
	appId: process.env.pusher_appId,
	key: process.env.pusher_key,
	secret: process.env.pusher_secret,
	cluster: process.env.pusher_cluster,
	encrypted: true
})

// used to generate an ecryption channel name that can not be guessed
REALTIME_HASH = '2557806818'
_realtime_get_channel = function( subject ) {
	return crypto.createHash('md5').update( REALTIME_HASH + '/'+ subject ).digest("hex")
}
// random channel id to broadcast btc rate changes
global_realtime_channel = '367544a50c6f7d9b454fbc14114833d7'

exports.handler = function( event, context, cb ) {
	async.each(event.Records, function(record, cb) {

		console.log("record=", JSON.stringify(record, null, "\t") )

		var event_type = event_types[record.eventSource]
		var event_target;
		var event_operation;
		var event_record;

		switch (event_type) {
			case 's3':
				event_target    = record.s3.bucket.name;
				event_operation = record.eventName.split(':').join('')
				event_record    = record.s3.object
				break;
			case 'dynamodb':
				event_target    = ((record.eventSourceARN || '').split(':')[5] || '').split('/')[1] || false
				event_operation = record.eventName.toLowerCase()
				event_record    = record.dynamodb;
				break;
		}

		var evurl = "./" + event_type + "/"+ event_target +"/" + event_operation +'.js'
		try {
			//console.log(evurl, JSON.stringify(record, null, "\t") )
			console.log("--- BEGIN stream ", evurl ," ---")
			require(evurl)( event_record, cb, context )
		} catch(e) {
			console.log("failed loading", evurl, "err=", e )
			cb()
		}
	}, function(err) {
		if (err)
			return context.fail(err);

		//setTimeout(function() {
			cb()
		//}, 150) // cool down
	})
}
