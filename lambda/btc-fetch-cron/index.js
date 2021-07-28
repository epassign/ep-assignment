AWS           = require('aws-sdk');
//cloudwatch    = new AWS.CloudWatch();
const request = require('request');
async         = require('async');
DynamoDB = require('@awspilot/dynamodb')()

exports.handler = function( event, context , cb ) {


	var rate = {
		eur: 0,
		usd: 0,
	};


	async.waterfall([

		// get the rate from external api
		( cb ) => {
			var url = "https://blockchain.info/ticker";

			request(url, function (err, response, body) {
				console.log(err ? '☐' : '☑', "request ", url, err )
				if (err)
					return cb()

				if ( response.statusCode !== 200 )
					return console.log("response.statusCode", response.statusCode ) || cb()

				//console.log("ticker=", typeof body, body )

				if ( typeof body !== "string")
					return cb()

				var result;
				try {
					result = JSON.parse(body)
					rate.eur = result.EUR.last
					rate.usd = result.USD.last

					console.log( "USD", rate.usd )
					console.log( "EUR", rate.eur  )

				} catch (err) {
					console.log("parse",err)
				}


				cb()
			});
		},


		// fallback to a second solution
		( cb ) => {

			if ( rate.usd )
				return cb() // skip it...

			var url = "https://api.coindesk.com/v1/bpi/currentprice.json"; 

			request(url, function (err, response, body) {
				console.log(err ? '☐' : '☑', "request ", url, err )
				if (err)
					return cb()

				if ( response.statusCode !== 200 )
					return console.log("response.statusCode", response.statusCode ) || cb()


				if ( typeof body !== "string")
					return cb()

				var result;
				try {
					result = JSON.parse(body)

					rate.eur = (result.bpi.EUR.rate_float ).toFixed(2)
					rate.usd = (result.bpi.USD.rate_float ).toFixed(2)

					console.log( "USD", rate.usd )
					console.log( "EUR", rate.eur )

				} catch (err) {
					console.log("parse",err)
				}


				cb()
			});
		},
		



		// save the rate in our db
		( cb ) => {
			DynamoDB
				.table('btc_history')
				.insert_or_update({
					all: 1,
					minute: new Date().toISOString().split('T').join(' ').slice(0,16),

					eur: rate.eur,
					usd: rate.usd,
				})
				.then(cb)
				.catch((err) => {
					console.log(err)
					cb()
				})
		}

	], function( err ) {

		console.log('done')

		cb()
	})





}