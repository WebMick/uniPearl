import { request } from "./request.js";

// 配置
const sendCode = (data) => {
	return request({
		url: '/send_activation_code/v2/?aid=24&account_sdk_source=sso&language=zh',
		data
	});
};

// 登录
const login = (data) => {
	return request({
		url: '/quick_login/v2/?aid=24&account_sdk_source=sso&language=zh',
		data
	});
}
// 评论
const comment = (data) => {
	return request({
		url: '/browser/2/data/v5/post_message/',
		data
	});
}

export {
	sendCode,
	login,
	comment
}
