module.exports = function( event, cb ) {
	cb({
		statusCode: 200,
		body: `<!DOCTYPE html>
<html>
	<head>
		<title>Index</title>
	</head>
	<body>
		<h1>index</h1>

		<a href="/login">Login</a>
		<a href="/signup">Signup</a>
	</body>
</html>

		`,
	})
}