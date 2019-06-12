function getJSON(config) {
	const type =
		typeof config.type != "undefined" && typeof config.type != undefined
			? config.type
			: "get";
	const url =
		typeof window.baseURL != "undefined" && typeof window.baseURL != undefined
			? window.baseURL + config.url
			: config.url;
	const headers = {};
	if (
		typeof config.headers != "undefined" &&
		typeof config.headers != undefined
	) {
		for (const key in config.headers) {
			if (config.headers.hasOwnProperty(key)) {
				headers[key] = config.headers[key];
			}
		}
    }
    const data={};
    if (
		typeof config.data != "undefined" &&
		typeof config.data != undefined
	) {
		for (const key in config.data) {
			if (config.data.hasOwnProperty(key)) {
				data[key] = config.data[key];
			}
		}
    }

	const dataType = "json";
	
	const	async=(
			typeof config.async != "undefined" &&
			typeof config.async != undefined
		)?config.async:true;

	return new Promise(function(resolve, reject) {
		$.ajax({
			type: type,
			url: url,
			headers: headers,
			data: data,
			async:async,
			dataType:dataType,
			success: function(res) {
                    resolve(res);
            }
		});
	});
}

if ($.cookie("u_token") == undefined) {
	var token=randomChar(10);
	var gettoken=getJSON({
		url:"/api/unimportance/createuser",
		headers:{
			token:token
		},
		type:"post",
		async:false
	})
	gettoken.then(res=>{
		$.cookie("u_token",token,0);
	})
}
function randomChar(l) {
	var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
	var tmp = "";
	var timestamp = new Date().getTime();
	for (var i = 0; i < l; i++) {
		tmp += x.charAt(Math.ceil(Math.random() * 3600) % x.length);
	}
	return tmp;
}