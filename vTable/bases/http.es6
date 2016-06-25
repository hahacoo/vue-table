
export default {
	
	request: function(method, uri, data, opts = {}) {
		data = data || {};
		
		let req = new Promise((resolve, reject) => {
			$.ajax(Object.assign({
				method: method,
				url:  uri,
				data: data
			}, opts))
			.then(resolve, reject);
		});

	    return req
	    		.then(data => data,  xhr => 'network traffic anomaly' + xhr.status);
	}
};

