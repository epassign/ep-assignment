
module.exports = function( event, cb ) {
	cb({
		statusCode: 404,
		body: `
			<div style="text-align: center;">
				<h1>404 - NOT FOUND</h1>

				<pre style="width: 500px;height: 400px;font-size: 12px;text-align: left;overflow: auto;">
					` + JSON.stringify( event, null, "\t") + `
				</pre>
			</div>
		`,
	})
}