
const api_get = function(url, cb) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

		if (this.status !== 200) {
			return cb(this.responseText)
		}
		var ret;
		try {
			ret = JSON.parse(this.responseText);
		} catch (e) {
			return cb(this.responseText)
		}

		if (ret.success !== true)
			return cb(ret)

		cb(null,ret)
	};
	xhr.open("GET", url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();
}

const api_post = function(url, params ,cb) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

		if (this.status !== 200) {
			return cb(this.responseText)
		}
		var data = JSON.parse(this.responseText);
		if (data.success !== true)
			return cb(data)

		cb(null,data)
	};
	xhr.open("POST", url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(params));
}

const api_put = function(url, params ,cb) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

		var data;
		try {
			data = JSON.parse(this.responseText);
		} catch (e) {
			data = this.responseText
		}

		if (this.status !== 200) {
			return cb(data)
		}

		if (data.success !== true)
			return cb(data)

		cb(null,data)
	};
	xhr.open("PUT", url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(params));
}

const api_delete = function(url, cb) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

		if (this.status !== 200) {
			return cb(this.responseText)
		}
		var ret;
		try {
			ret = JSON.parse(this.responseText);
		} catch (e) {
			return cb(this.responseText)
		}

		if (ret.success !== true)
			return cb(ret)

		cb(null,ret)
	};
	xhr.open("DELETE", url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();
}

export {
	api_get,
	api_post,
	api_put,
	api_delete,
}
