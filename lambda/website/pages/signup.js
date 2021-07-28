module.exports = function( event, cb ) {
	cb({
		statusCode: 200,
		body: `<!DOCTYPE html>
<html>
	<head>
		<title>Signup</title>
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
}