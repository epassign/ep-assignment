

module.exports = function(event, cb) {
	cb({
		statusCode: 200,
		body: JSON.stringify({
			success: true,
		}, null, "\t")
	})
}