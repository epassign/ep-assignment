AWS           = require('aws-sdk');
//cloudwatch    = new AWS.CloudWatch();
const request = require('request');
async         = require('async');

exports.handler = function( event, context , cb ) {


	var rate = {
		eur: 0,
		usd: 0,
	};


	async.waterfall([

		( cb ) => {
			var url = "https://blockchain.info/ticker";

			request(url, function (err, response, body) {

				if (err) {
					console.log("ticker", err)
					return cb()
				}

				if ( response.statusCode !== 200 )
					return cb()

				//console.log("ticker=", typeof body, body )

				if ( typeof body !== "string")
					return cb()

				var result;
				try {
					result = JSON.parse(body)
					rate.eur = result.EUR.last
					rate.usd = result.USD.last

					console.log( "USD", result.USD.last )
					console.log( "EUR", result.EUR.last )

				} catch (err) {
					console.log("parse",err)
				}


				cb()
			});
		},


	], function() {

		console.log('done')

		cb()
	})





}