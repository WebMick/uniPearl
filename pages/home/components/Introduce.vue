<template>
	<view class="introduce">
		<view class="top">
			<view class="left">
				<image src="../../../static/images/tabbar/home-active.png" class="img" mode=""></image>
			</view>
			<view class="right">
				<view class="title">Pearl</view>
				<view class="subTitle">珍珠的狗窝....</view>
			</view>
		</view>
		<view class="text">您好啊，这里是珍珠的狗窝。有好多珍珠的小玩具，贼好玩哦...</view>
	</view>
</template>
 
<script>
	export default {
		name: '',
		data(){
			return {
				
			}
		},
		methods:{
			
		}
	}
</script>
 
<style lang="scss" scoped>
	.introduce{
		background: #fff;
		padding:0 32rpx 20rpx 32rpx;
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