<template>
	<view class="page">
		<view class="item">
			<view class="title">纯CSS制作赛博朋克2077 "故障风"按钮</view>
			<view class="text">赛博朋克 2077 这个游戏，在它的网页上，有一个 Available Now 的按钮，当游标移到它之上的时候，会有一个好像故障的毛刺效果以下就是模仿并且实现这个效果的过程。</view>
		</view>
		<view class="box">
			<view class="button" @click="clk" :class="{show: show}">AVAILABLE NOW</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
			}
		},
		methods: {
			clk(){
				this.show = true;
				clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					this.show = false;
					clearTimeout(this.timer);
				},3000);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/styles/style.scss";
	$slice0: inset(50% 50% 50% 50%);
	$slice1: inset(80% -6px 0 0);
	$slice2: inset(50% -6px 30% 0);
	$slice3: inset(10% -6px 85% 0);
	$slice4: inset(40% -6px 43% 50%);
	$slice5: inset(80% -6px 5% 0);
	.box{
		display: flex;
		justify-content: center;
		align-items: center;
		margin:0 auto;
		height:300rpx;
		background-color: #F8F005;
		.button,.button::after{
			position: relative;
			width: 380rpx;
			height: 86rpx;
			font-size: 36rpx;
			background: linear-gradient(45deg, transparent 5%, #ff013c 5%);
			border: none;
			outline: none;
			box-shadow: 6rpx 0px 0px #00E6F6;
			color: #fff;
			letter-spacing: 2rpx;
			line-height: 88rpx;
			text-align: center;
		}
		.button:after{
			position: absolute;
			display: block;
			content: 'AVAILABLE NOW';
			top: 0;
			left: 0;
			bottom: 0;
			background: linear-gradient(45deg, transparent 3%, #00e6f6 3%, #00e6f6 5%, #ff013c 5%);
			text-shadow: -3px -3px 0 #f8f005, 3px 3px 0 #00e6f6;
			clip-path: inset(80% -6px 0 0);
		}
		.button.show::after{
			animation: glitch 2s steps(2, end) infinite;
		}
	}
	@keyframes glitch {
		0% {
			clip-path: $slice1;
			transform: translate(-20px, -10px);
		}
		
		10% {
			clip-path: $slice3;
			transform: translate(10px, 10px);
		}
		
		20% {
			clip-path: $slice1;
			transform: translate(-10px, 10px);
		}
		
		30% {
			clip-path: $slice3;
			transform: translate(0px, 5px);
		}
		
		40% {
			clip-path: $slice2;
			transform: translate(-5px, 0px);
		}
		
		50% {
			clip-path: $slice3;
			transform: translate(5px, 0px);
		}
		
		60% {
			clip-path: $slice4;
			transform: translate(5px, 10px);
		}
		
		70% {
			clip-path: $slice2;
			transform: translate(-10px, 10px);
		}
		
		80% {
			clip-path: $slice5;
			transform: translate(20px, -10px);
		}
		
		90% {
			clip-path: $slice1;
			transform: translate(-10px, 0px);
		}
		
		100% {
			clip-path: $slice1;
			transform: translate(0);
		}
	}

</style>
