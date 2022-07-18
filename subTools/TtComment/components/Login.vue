<template>
	<view class="form codeLogin">
		<view class="item">
			<view class="before">渠道</view>
			<input type="text" v-model="tt_userInfo.aid" class="ipt" maxlength="-1" placeholder="aid" >
		</view>
		<view class="item">
			<view class="before">昵称</view>
			<input type="text" v-model="tt_userInfo.app_name" class="ipt" maxlength="-1" placeholder="app_name" >
		</view>
		<view class="item">
			<view class="before">签名</view>
			<input type="text" v-model="tt_userInfo._signature" class="ipt" maxlength="-1" placeholder="_signature" >
		</view>
		<view class="item">
			<view class="before">token</view>
			<input type="text" v-model="tt_userInfo.ttAntiToken" class="ipt" maxlength="-1" placeholder="tt-anti-token" >
		</view>
		<view class="item">
			<view class="before">加密token</view>
			<input type="text" v-model="tt_userInfo.xCsrftoken" class="ipt" maxlength="-1" placeholder="x-csrftoken" >
		</view>
		<view class="item">
			<view class="before">cookie</view>
			<input type="text" v-model="tt_userInfo.cookie" class="ipt" maxlength="-1" placeholder="cookie" >
		</view>
		<view class="item">
			<view class="login" 
				@click="login">
				登录
			</view>
		</view>
	</view>
</template>
 
<script>
	export default {
		name: '',
		props: {
			isLogin: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				tt_userInfo: {
					aid: '',
					app_name: '',
					_signature: '',
					ttAntiToken: '',
					xCsrftoken: '',
					cookie: ''
				}
			}
		},
		methods:{
			login(){
				let { tt_userInfo } = this;
				uni.setStorageSync('tt_userInfo', tt_userInfo);
				this.$emit('update:isLogin', false)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form{
		margin: 50rpx 50rpx;
		overflow: hidden;
		.item{
			margin-bottom: 25rpx;
			display: flex;
			.before{
				margin-right: 20rpx;
				line-height: 80rpx;
			}
			.ipt{
				border: 1rpx solid #F4F5F6;
				border-radius: 10rpx;
				height: 80rpx;
				line-height: 1;
				flex: 1;
				padding: 0 20rpx;
			}
			.sendCode{
				margin-left: 20rpx;
				width: 200rpx;
				text-align: center;
				line-height: 80rpx;
				background-color: $uni-color-primary;
				color: #fff;
				border-radius: 10rpx;
				&.dis{
					background-color: #c0c4cc;
				}
			}
			.login{
				flex: 1;
				text-align: center;
				background-color: $uni-color-primary;
				color: #fff;
				line-height: 80rpx;
				border-radius: 10rpx;
				&.dis{
					background-color: #c0c4cc;
				}
			}
		}
	}
</style>