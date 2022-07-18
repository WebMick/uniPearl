<template>
	<view class="pie" :style="{height: height[0] + 'rpx'}">
		<canvas
			class="canvas"
			type='2d'
		    :id="canvasId[0]"
		    disable-scroll="true"
			/>
	</view>
</template>
 
<script>
	import { Mixins } from './Mixins.js';
	export default {
		name: '',
		mixins: [Mixins],
		props: {
			// canvas 的id 顺序对应 高度的顺序
			canvasId: {
				type: Array,
				default: () => ['pie']
			},
			// 高度
			height: {
				default: () => [],
				type: Array
			},
			// 数据
			chartData: {
				default: () => [],
				type: Array
			}
		},
		data(){
			return {
				
			}
		},
		mounted() {
			this.init();
		},
		methods:{
			async init(){
				let { canvasId, pixelRatio } = this;
				let canvasDom = await this.getCanvasDom(canvasId[0]);
				let {width, height, node} = canvasDom;
				const canvas = node;
				const ctx = canvas.getContext('2d');
				width = width * pixelRatio;
				height = height * pixelRatio;
				canvas.width  = width;
				canvas.height = height;
				this.canvasWidth = width;
				this.canvasHeight = height;
				this.arcx = width / 2;
				this.arcy = height / 2;
				this.arcw = 20 * pixelRatio;
				this.arcRadius = (height - this.arcw * 2) / 2;
				this.draw(ctx);
			},
			draw(ctx){
				let { chartData } = this;
				let start = 1.5 * Math.PI;
				let colorList = ['#FF8300', '#1988F4', '#0A447D', '#909399']
				chartData.map((item, index) => {
					let { income_ratio } = item;
					let color = colorList[index];
					let end = start + income_ratio / 100 * 2 * Math.PI;
					this.drawArc({ctx, start, end, color})
					start = end;
				});
				// console.log({chartData})
			},
			drawArc({ctx, start, end, color}){
				ctx.beginPath();
				ctx.strokeStyle = color;
				ctx.lineWidth = this.arcw;
				ctx.arc(this.arcx, this.arcy, this.arcRadius, start, end);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}
</script>
 
<style lang="scss" scoped>
	.pie{
		position: relative;
		.canvas{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
