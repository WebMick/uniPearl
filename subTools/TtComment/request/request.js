
const BASEURL = 'https://www.toutiao.com'

const request = ({url, data, method = 'POST'}) => {
	url = BASEURL + url;
	console.log(JSON.stringify(data))
	let header = {};
	if(method == 'POST'){
		header['content-type'] = 'application/x-www-form-urlencoded';
	};
	let tt_userInfo = uni.getStorageSync('tt_userInfo');
	let { aid, app_name, _signature, cookie, ttAntiToken, xCsrftoken } = tt_userInfo;
	url = `${url}?aid=${aid}&app_name=${app_name}&_signature=${_signature}`;
	header['tt-anti-token'] = ttAntiToken;
	header['x-csrftoken'] = xCsrftoken;
	header['cookie'] = cookie;
	header['origin'] = 'https://www.toutiao.com'
	header['referer'] = 'https://www.toutiao.com'
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			data,
			method,
			header,
			dataType: "json",
			success: (res) => {
				let { statusCode, data } = res;
				if(statusCode == 200){
					let { errno, message } = data;
					if(errno != 0)
						uni.showToast({
							title: message,
							icon: 'none'
						});
				}
				resolve(data);
			},
			fail: (err) => {
				
			},
			complete: (res) => {
				console.log({res: res.errMsg, url})
			}
		})
	});
};

export {
	request
}