module.exports = function( event, cb ) {

	var session;
	async.waterfall([

		// check session, redirect if not logged in
		( cb ) => {
			DynamoDB
				.table('sessions')
				.where('id').eq( event._COOKIES.sid )
				.get()
				.then(( data ) => {
					if (!Object.keys(data).length)
						return cb({
							statusCode: 302,
							contentType: 'text/html',
							location: err.location || '/login',
							body: "<a href='/login'>Continue to Login</a>",
						})

					session=data;
					cb()
				})
				.catch(( err ) => {
					cb({success: false, errorCode: 'TMP_ERR', })
				})
		},

	], (err) => {
		if (err)
			return (err)

		cb({
			statusCode: 200,
			body: `<!DOCTYPE html>
<html>
	<head>
		<title>Index</title>
		<meta charset="UTF-8">
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
		<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
		<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
		<script src="https://${process.env.cdn_master}/ep-assignment.min.js"></script>
	</head>
	<body>

	</body>
</html>
	
			`,
		})
	})



}