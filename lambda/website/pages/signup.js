module.exports = function( event, cb ) {
	cb({
		statusCode: 200,
		body: `<!DOCTYPE html>
<html>
	<head>
		<title>Signup</title>
	</head>
	<body>
		<h1>Signup</h1>

		<a href="/">Home</a>
		<a href="/login">Login</a>
		<a href="/signup">Signup</a>
	</body>
</html>

		`,
	})
}