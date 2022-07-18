<template>
	<view class="page">
		<view class="introduce">
			<view class="top">
				<view class="left" @click="open">
					<image src="https://cos765.sunwaystech.com/images/equities/product/202207181622205423.png" class="img" mode=""></image>
				</view>
				<view class="right">
					<view class="title">趣看行情</view>
					<view class="subTitle">股票行情,股票竞猜,上证指数,深证指数,量化交易,股票,赚钱,猜涨跌,现金红包</view>
				</view>
			</view>
			<view class="text">趣看行情是基于微信小程序的股票行情查看平台，用户通过竞猜股票涨跌，组合涨跌的玩法来获取对应的奖励。</view>
		</view>
		<view class="item">
			<view class="subTitle">主要职责</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			open(){
				wx.navigateToMiniProgram({
					appId: 'wx94532f949008713c'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/styles/style.scss";
	.introduce{
		background: #fff;
		padding:0 10rpx 20rpx 10rpx;
		.top{
			display: flex;
			align-items: center;
			.left{
				.img{
					display: block;
					width: 140rpx;
					height: 140rpx;
				}
			}
			.right{
				margin-left: 20rpx;
				.title{
					font-size: 36rpx;
					font-weight: bold;
				}
				.subTitle{
					font-size: 26rpx;
					color: #909193;
				}
			}
		}
		.text{
			margin-top: 10rpx;
			font-size: 26rpx;
			color: #909193;
			line-height: 1.5em;
		}
	}
</style>
