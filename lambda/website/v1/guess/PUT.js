
var AWS      = require("aws-sdk")
var stepfunctions = new AWS.StepFunctions()

module.exports = function(event, cb) {


	var session;
	var user;
	var new_guess_id = ((new Date().getTime()* 1000) + Math.round(Math.random() * 1000)).toString(16);
	var guess;

	async.waterfall([

		// validate post
		( cb ) => {
			if (['up','down'].indexOf( event._POST.next ) === -1 )
				return cb({ success: false, errorMessage: 'Invalid prediction, should be up or down' })

			cb()
		},


		// get session
		( cb ) => {

			if (!event._COOKIES.sid)
				return cb({ success: false, errorMessage: 'You must be logged in' })

			DynamoDB
				.table('sessions')
				.where('session_id').eq( event._COOKIES.sid )
				.get()
				.then(( data ) => {
					if (!Object.keys(data).length)
						return cb({ success: false, errorMessage: 'You must be logged in' })

					session=data;
					cb()
				})
				.catch(( err ) => {
					console.log( err )
					cb({ success: false, errorCode: 'TMP_ERR', errorMessage: 'Failed getting your session', debug: err })
				})
		},


		// get user
		( cb ) => {

			DynamoDB
				.table('users')
				.where('user_id').eq( session.user_id )
				.get()
				.then(( data ) => {
					if (!Object.keys(data).length)
						return cb({success: false, errorCode: 'USER_NOT_FOUND', errorMessage: 'Failed getting your session' })


					if (data.hasOwnProperty('guess_id') )
						return cb({success: false, errorCode: 'USER_NOT_FOUND', errorMessage: 'Another guess in progress' })

					user = data

					cb()
				})
				.catch((err) => {
					console.log( err )
					cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'Failed getting your session', debug: err })
				})
		},


		// get the most recent BTC rate and make sure it is not outdated
		( cb ) => {
			DynamoDB
				.table('btc_history')
				.where('all').eq( 1 )
				.desc()
				.limit(1)
				.query()
				.then(( data ) => {
					if (!data.length)
						return cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'No BTC data yet'})

					if (data[0].usd !== event._POST.rate )
						return cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'Guess failed, BTC rate changed in the meantime'})

					cb()
				})
				.catch((err) => {
					console.log( err )
					cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'Error getting the most recent BTC rate'})
				})
		},


		// save the guess
		( cb ) => {

			guess = { 
				user_id: user.user_id,
				guess_id: new_guess_id,
				created_at: new Date().getTime(),
				next: event._POST.next,
				currency: 'USD',
				initial_rate: event._POST.rate,
				final_rate: null,
			}

			DynamoDB
				.transact()
					.table('users')
						.where('user_id').eq( user.user_id )
						.if('guess_id').not().exists()
						.update({guess_id: new_guess_id})
					.table('guess')
						.insert( guess )
				.write()
				.then(( data ) => {
					cb()
				})
				.catch((err) => {
					console.log( err )
					cb({success: false, errorCode: 'TMP_ERR', errorMessage: 'Failed creating new guess', debug: err })
				})
		},



		// start process
		( cb ) => {

			var params = {
				stateMachineArn: "arn:aws:states:" + process.env.AWS_DEFAULT_REGION + ":" + process.env.AWS_ACCOUNT_ID + ":stateMachine:GuessResolverStepFunction",
				input: JSON.stringify({
					'_POST': {
						guess: guess
					}
				}),
				name: new_guess_id + '@1',
			}

			stepfunctions.startExecution(params, function(err, data) {
				console.log('stepfunction:StepDomainCertificate', err, data )
				cb()
			});
		}

	], (err) => {
		if (err)
			return cb({ body: JSON.stringify( err, null, "\t") })

		cb({
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				guess_id: new_guess_id,
			}, null, "\t")
		})
	})
}