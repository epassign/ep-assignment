const cookie = require('cookie');

module.exports = function convert(event) {
	var ret = { raw: event, }
	ret._HEADERS = event.headers || {}
	delete ret.raw.headers;
	ret._GET = {}
	if (ret.raw.queryStringParameters) {
		ret._GET = ret.raw.queryStringParameters;
		delete ret.raw.queryStringParameters;
		delete ret.raw.rawQueryString;
	}

	ret._METHOD = event.requestContext.http.method

	ret._PATH   = ret.raw.rawPath;
	delete ret.raw.rawPath;

	ret._COOKIES = cookie.parse( (ret.raw.cookies || []).join('; ')  )
	delete ret.raw.cookies;

	ret._POST = {}
	if (typeof ret.raw.body === 'string') {
		try {
			ret._POST = JSON.parse( ret.raw.body )
		} catch (e) {
		}
	}

	return ret;
}
