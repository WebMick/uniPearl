<template>
	<view class="minute">
		<view class="minuteBox">
			<!-- 走势图 -->
			<view class="canvasBox" :style="{height: height[0] + 'rpx'}">
				<canvas :id="canvasId[0]" type='2d' class="canvas"></canvas>
			</view>
			<view class="volTextBox">
				<view class="title">成交量</view>
				<view class="num fontLight">{{volShowNum || volMax}}</view>
			</view>
			<!-- 成交量 -->
			<view class="canvasBox" :style="{height: height[1] + 'rpx'}">
				<canvas :id="canvasId[1]" type='2d' class="canvas"></canvas>
			</view>
			<!-- 指针 -->
			<canvas id="mark" type='2d' class="mark" @touchmove="move" @touchend="touchend"></canvas>
		</view>
	</view>
</template>
 
<script>
	import { Mixins } from './Mixins.js';
	export default {
		name: '',
		mixins: [Mixins],
		props: {
			// type minute:分时走势 fiveDay: 五日
			type: {
				type: String,
				default: 'minute'
			},
			// canvas 的id 顺序对应 高度的顺序
			canvasId: {
				type: Array,
				default: () => ['minute', 'vol'],
			},
			// 高度设置 0 =>> 走势图高度 1 =>> 成交量高度
			height: {
				default: () => [400,100],
				type: Array
			},
			// 分时数据
			chartData: {
				default: () => [],
				type: Array
			},
			// 最多显示多少个
			xAxisLen: {
				type: Number,
				default: 241
			},
			// 昨收价
			yestClose: {
				type: Number,
				default: 0
			},
			// 成交量在 xscale中的占比 宽度
			itemWidth: {
				default: 0.8,
				type: Number
			},
			// 所属 交易所
			bourse: {
				default: 1, // 1 对应上交所、深交所   2 港股
				type: Number
			},
			// 底部时间
			timeArr: {
				default: () => [],
				type: Array
			}
		},
		data(){
			return {
				volShowNum: '',
				volMax: '',
				moveShowData: []
			}
		},
		mounted() {
			this.init();
		},
		methods:{
			
			async init(){
				let { pixelRatio, xAxisLen, canvasId } = this;
				let lineRes = await this.getCanvasDom(canvasId[0]);
				let volRes  = await this.getCanvasDom(canvasId[1]);
				let markRes = await this.getCanvasDom('mark');
				// 设置走势图 大小
				let { width, height, node} = lineRes;
				const canvas = node;
				const ctx    = canvas.getContext('2d');
				width  = width  * pixelRatio;
				height = height * pixelRatio;
				canvas.width    = width;
				canvas.height   = height;
				this.chartWidth = width; // 公用的宽度
				this.lineHeight = height; // 走势图的高度
				this.xScale = width / xAxisLen; // x轴的刻度
				
				//  设置 获取 成交量 参数
				let volHeight   = volRes.height * pixelRatio;
				this.volHeight  = volHeight; // 成交量高度
				const volCanvas = volRes.node;
				const volCtx    = volCanvas.getContext('2d');
				volCanvas.width = width;
				volCanvas.height= volHeight;
				
				// 获取'move'画布信息
				this.markCanvas = markRes.node;
				this.markCtx    = markRes.node.getContext('2d');
				this.markHeight = markRes.height * pixelRatio;
				this.markWidth  = width;
				this.markCanvas.width = width;
				this.markCanvas.height= this.markHeight;
				this.draw({
					ctx,
					volCtx
				})
			},
			// 设置基础参数
			setBaseParams(data){
				if(!data || data.length <= 0) return;
				this.moveShowData = data[data.length - 1];
				let volArr  = [],
					lineArr = [];
				data.map(item => {
					if(item){
						let vol  = item[3],
							line = item[1];
						volArr   = [...volArr, vol];
						lineArr  = [...lineArr, line];
					}
				});
				let lineMax = Math.max(...lineArr),
					lineMin = Math.min(...lineArr),
					volMax  = Math.max(...volArr);
				// 设置最大最小值： 最大 - 昨收  =  昨收 - 最小
				// 最大 = 最小：最大 = 最大 * 1.1 最小 = 最小 * 0.9
				let { yestClose } = this;
				let maxDiff = lineMax - yestClose,
					minDiff = lineMin - yestClose;
				if(minDiff * minDiff > maxDiff * maxDiff){
					if(minDiff > 0){
						lineMax = yestClose + minDiff;
					}else{
						lineMax = yestClose - minDiff;
					}
				}
				else if(minDiff * minDiff == maxDiff * maxDiff){
					lineMax = lineMax * 1.1;
					lineMin = lineMin * 0.9;
				}
				else{
					if(maxDiff > 0){
						lineMin = yestClose - maxDiff;
					}else{
						lineMin = yestClose + maxDiff;
					}
				}	
				let { lineHeight } = this;
				let lineYScale  = lineHeight / (lineMax - lineMin);
				this.lineMax = lineMax;
				this.lineMin = lineMin;
				this.volMax  = volMax;
				this.lineYScale = lineYScale;
			},
			// 开始绘图
			draw({ctx, volCtx}){
				let { chartData, type } = this;
				this.setBaseParams(chartData);
				let { chartWidth, downColor, upColor, itemWidth, volYScale, volMax, lineHeight, lineYScale, lineMax, volHeight, timeHeight, pixelRatio, xScale, avgLineColor } = this;
				// 设置背景网格线
				this.drawBgLine({
					ctx: volCtx,
					width: chartWidth,
					height: volHeight - timeHeight * pixelRatio,
					lineNum: 2
				});
				this.drawBgLine({
					ctx,
					width: chartWidth,
					height: lineHeight,
					lineNum: 4
				});
				// 绘制竖线
				let lineNum = 5;
				if(type == 'fiveDay') lineNum = 6;
				for(let i = 0; i < lineNum; i++){
					let lineSclae = chartWidth / (lineNum - 1),
						startx    = lineSclae * i,
						starty    = 0,
						endx      = startx,
						endy      = lineHeight,
						volEndy   = volHeight - timeHeight * pixelRatio;
					this.drawLine({startx, starty, endx, endy, ctx});
					this.drawLine({startx, starty, endx, endy: volEndy, ctx: volCtx});
				}
				// 开始绘制
				let { length } = chartData;
				chartData.map((item, index) => {
					let price  = item[1],
						vol    = item[3],
						avg    = item[2];
					if(index > length - 2 || !item) return;
					// 下一个点的数据
					let next = chartData[index + 1],
						nextPrice = next[1],
						nextAvg   = next[2];
					// 走势线
					let startx = index * xScale,// 当前点的坐标x
						starty = (lineMax - price) * lineYScale, // 当前点的坐标y
						endx = (index + 1) * xScale, // 下一个点的坐标 x
						endy = (lineMax - nextPrice) * lineYScale; // 下一个点的坐标y
					this.drawLine({
						ctx,
						startx,
						starty,
						endx, 
						endy, 
						color: '#1988F4'
					});
					// 均线
					let avgStarty = (lineMax - avg) * lineYScale,
						avgEndy   = (lineMax - nextAvg) * lineYScale;
					this.drawLine({
						ctx,
						startx,
						starty: avgStarty,
						endx, 
						endy: avgEndy, 
						color: avgLineColor[0]
					});
					// 成交量
					let inVol     = item[4],
						outVol    = item[5],
						volx      = xScale * (index + (1 - itemWidth) / 2),
						voly      = volYScale * (volMax - vol),
						volWidth  = xScale * itemWidth,
						volHeight = volYScale * vol;
					let color = inVol < outVol ? upColor : downColor;
					this.drawRect({
						x: volx,
						y: voly,
						width: volWidth,
						height: volHeight,
						color,
						ctx: volCtx
					});
				});
				// 绘制时间
				this.drawTime(volCtx);
				this.drwaNumText(ctx);
			},
			// 绘制时间
			drawTime(ctx){
				let { type, timeArr } = this;
				let { bourse, chartWidth, volHeight, timeHeight, pixelRatio } = this;
				let time = {
					1: ['09:30', '11:30/13:00', '15:00'], //上交所、深交所的时间
					2: ['09:30', '11:00/13:00', '16:00']   // 港股的时间
				};
				time = time[bourse];
				time = timeArr && timeArr.length > 0 ? timeArr : time;
				let { length } = time;
				let tScale;
				if(type == 'minute'){
					tScale = chartWidth / (length - 1);
				}
				else if(type == 'fiveDay'){
					tScale = chartWidth / (length * 2);
				}
				time.map((item, index) => {
					let x = index * tScale,
						y = volHeight - timeHeight * pixelRatio + ((timeHeight - 10) * pixelRatio) / 2,
						textAlign = 'center';
					// 分时的 左右要靠边 
					if(type == 'minute'){
						if(index == 0){
							textAlign = 'left';
						}
						else if(index == length - 1){
							textAlign = 'right';
						};	
					}
					// 五日图的点 x 要重新计算
					else if(type == 'fiveDay'){
						x = tScale * ( 2 * index + 1);
					}
					this.drawText({
						text: item, 
						x, 
						y, 
						ctx, 
						color: '#909399',
						textAlign
					})
				});
			},
			// 绘制走势图刻度
			drwaNumText(ctx){
				let { xScale, lineYScale, lineMax, lineMin, yestClose, font, lineHeight, chartWidth } = this;
				let { upColor, downColor } = this,
					fontSize = 10;
				let color   = [upColor, '#909399', downColor],
					textArr = [lineMax, yestClose, lineMin];
				for(let i = 0; i < 3; i++){
					let text = textArr[i],
						y    = lineYScale * (lineMax - text);
					y = y == 0 ? fontSize * 1.5 : y;
					y = y >= lineHeight ? lineHeight - fontSize * 0.5 : y;
					let textIndent = fontSize / 3;
					let textBaseline = 'bottom';
					if(i == 0){
						textBaseline = 'top'
					}
					else if(i == 1){
						textBaseline = 'center'
					}
					this.drawText({
						text: this.toPlusFixed(text, 2), 
						x: textIndent, 
						y, 
						ctx, 
						color: color[i], 
						font,
						textBaseline
					});
					let percentage = this.percentage(text, yestClose);
					this.drawText({
						text: percentage, 
						x: chartWidth - textIndent, 
						y, 
						ctx, 
						color: color[i], 
						font,
						textAlign: 'right',
						textBaseline
					});
				}
			},
			// 移动
			move(e){
				let { markCtx, markHeight, markWidth, scaleTextColor, timeHeight, pixelRatio, chartData, xScale, lineYScale, lineMax, lineHeight} = this;
				markCtx.clearRect(0, 0, markWidth, markHeight);
				let {x, y} = e.changedTouches[0];
				x = x < 0 ? 0 : x * pixelRatio;
				y = y < 0 ? 0 : y * pixelRatio;
				let { length } = chartData;
				let index = x / xScale;  // 当前数据
				if(index < 0) index = 0;
				if(index > length - 1) index = length - 1;
				index = parseInt(index);
				let currentData = chartData[index];
				this.moveShowData = currentData;
				let pointHeight = markHeight - timeHeight * pixelRatio, // 十字架高度
					pointx = (index + 0.5) * xScale;
				y = y >= lineHeight ? lineHeight : y; // 横线不超过 蜡烛图高度
				// 绘制十字线
				this.drawPointer({
					ctx: markCtx, 
					x: pointx, 
					y, 
					width: markWidth, 
					height: pointHeight,
					color: scaleTextColor
				});
				let text = this.toPlusFixed(lineMax - (y / lineYScale), 2); // 左侧显示文本
				let textWidth = markCtx.measureText && markCtx.measureText(text).width; // 设置文本宽度
				textWidth = textWidth + 12; // 设置文本两边空余宽度 padding
				// 设置显示文案基础属性
				let textHeight = timeHeight * pixelRatio,
					textRadius = 6,
					texty = y - textHeight / 2,
					textx;
				if(pointx >= markWidth / 3){
					textx = 0;
				}else{
					textx = markWidth - textWidth;
				};
				texty = texty < 0 ? 0 : texty;
				this.drawTextHasBg({
					ctx: markCtx, 
					x: textx, 
					y: texty, 
					text: text, 
					color: '#1988F4', 
					fillColor: '#E8E9EC', 
					width: textWidth, 
					height: textHeight, 
					radius: textRadius
				});
				// 设置下方时间文本
				let time = currentData[0];
				if(!time) return;
				time = time.substr(0,2) + ':' + time.substr(2,4);
				let timeWidth = markCtx.measureText && markCtx.measureText(time).width; // 设置文本宽度
				timeWidth = timeWidth + 12; // 设置文本两边空余宽度 padding
				let timex = pointx - timeWidth / 2;
				timex = timex <= 0 ? 0 : timex;
				timex = timex >= markWidth - timeWidth ? markWidth - timeWidth : timex;
				this.drawTextHasBg({
					ctx: markCtx, 
					x: timex, 
					y: pointHeight, 
					text: time, 
					color: '#1988F4', 
					fillColor: '#E8E9EC', 
					width: timeWidth, 
					height: textHeight, 
					radius: textRadius
				});
				this.volShowNum = currentData[3];
			},
			touchend(){
				let timer = setTimeout(()=>{
					clearTimeout(timer);
					let { markCtx, markHeight, markWidth} = this;
					markCtx.clearRect(0, 0, markWidth, markHeight);
				}, 2000);
			}
		}
	}
</script>
 
<style lang="scss" scoped>
	.minute{
		.textBox{
			height: 40rpx;
			display: flex;
			align-items: center;
			font-size: 20rpx;
			.title{
				color: #FF8300;
			}
			.sub{
				margin-left: 24rpx;
			}
		}
		.minuteBox{
			position: relative;
			.canvasBox{
				position: relative;
				.canvas{
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
				}
			}
			.mark{
				position: absolute;
				z-index: 9;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
			.volTextBox{
				height: 40rpx;
				display: flex;
				align-items: center;
				font-size: 20rpx;
				.title{
					color: #606266;
					background: rgba(188, 190, 194, .3);
					padding: 6rpx 8rpx;
					border-radius: 4rpx;
				}
				.num{
					color: #909399;
					margin-left: 14rpx;
				}
			}
		}
	}
</style>
