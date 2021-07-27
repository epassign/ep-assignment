module.exports = function( event, cb ) {
	cb({
		statusCode: 200,
		body: `<!DOCTYPE html>
<html>
	<head>
		<title>Login</title>
	</head>
	<body>
		<h1>Login</h1>

		<a href="/">Home</a>
		<a href="/login">Login</a>
		<a href="/signup">Signup</a>
	</body>
</html>

		`,
	})
}