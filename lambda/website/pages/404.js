
module.exports = function( event, cb ) {
	cb({
		statusCode: 404,
		body: `
			<div style="text-align: center;margin-top: 100px;">
				<h1>404 - NOT FOUND</h1>

				<pre style="width: 500px;height: 400px;font-size: 12px;text-align: left;margin: 0 auto;border: 1px solid #ccc;padding: 10px;overflow: auto;">` 
					+ JSON.stringify( event, null, "\t") 
				+ `
				</pre>
			</div>
		`,
	})
}