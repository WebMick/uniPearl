<template>
	<view class="kline">
		<view class="textBox">
			<view class="item color5 first">MA<text class="text fontLight">5:{{moveShowData[6]}}</text></view>
			<view class="item color10 fontLight">10:{{moveShowData[7]}}</view>
			<view class="item color20 fontLight">20:{{moveShowData[8]}}</view>
			<view class="item color30 fontLight">30:{{moveShowData[9]}}</view>
			<view class="item color60 fontLight">60:{{moveShowData[10]}}</view>
		</view>
		<view class="klineBox">
			<!-- 蜡烛图 -->
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
			<canvas id="mark" type='2d' class="mark" @touchstart="touchstart" @touchmove="move" @longpress="longpress" @touchend="touchend"></canvas>
		</view>
	</view>
</template>

<script>
	import { Mixins } from './Mixins.js';
	import { klineData } from './data.js'
	export default {
		name: 'kline',
		mixins: [Mixins],
		props: {
			// canvas 的id 顺序对应 高度的顺序
			canvasId: {
				type: Array,
				default: () => ['kline', 'vol'],
			},
			// 画布高度 [第一个画布，第二个画布...]
			height: {
				default: () => [400,100],
				type: Array
			},
			// x轴最多显示条数
			xAxisLen: {
				default: 60,
				type: Number
			},
			// 拉蜡烛图中间柱子的宽度
			itemWidth: {
				default: 0.8,
				type: Number
			}
		},
		data() {
			return {
				klineData: [], // K线数据
				volMax: 0,      // 成交量最大值
				volShowNum: 0 , // 成交右侧显示值
				klineIsLoading: true, // 数据加载中 圈圈
				moveShowData: [], // 顶部显示的数据
				startIndex: 0, // 显示区域的数据 开始下标
				isLongpress: false
			}
		},
		mounted() {
			this.equityTickerKline();
		},
		methods: {
			// 获取API数据
			equityTickerKline(){
				let { xAxisLen } = this; 
				this.klineData = klineData;
				let { length } = klineData;
				this.moveShowData =  klineData[length - 1];
				if(length <= xAxisLen){
					this.startIndex = 0;
				}else{
					this.startIndex = length - xAxisLen;
				}
				this.init();
			},
			// kline 初始化
			async init(){
				let { pixelRatio, xAxisLen, startIndex, canvasId } = this;
				let lineRes = await this.getCanvasDom(canvasId[0]);
				let volRes  = await this.getCanvasDom(canvasId[1]);
				let markRes = await this.getCanvasDom('mark');
				
				// 设置 获取 蜡烛图 参数
				let { width, height, node} = lineRes;
				const canvas = node;
				const ctx    = canvas.getContext('2d');
				width  = width  * pixelRatio;
				height = height * pixelRatio;
				canvas.width    = width;
				canvas.height   = height;
				this.chartWidth = width; // 画布宽度 一致
				this.lineHeight = height; // 蜡烛图高度
				this.xScale = width / xAxisLen;
				
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
				
				this.data = this.klineData.slice(startIndex, startIndex + xAxisLen);
				this.draw({ctx, data: this.data, volCtx})
			},
			// 设置基础参数 数据
			setBaseParams(data){
				if(!data || data.length <= 0) return;
				let volArr  = [],
					lineArr = [],
					timeArr = [];
				data.map((item, index) => {
					let vol  = item[5];
					let time = item[0];
					let line = [item[1], item[2], item[3], item[4]];
					lineArr = [...lineArr, ...line];
					volArr  = [...volArr, vol];
					timeArr =  [...timeArr, time];
				});
				let lineMax = Math.max(...lineArr),
					lineMin = Math.min(...lineArr),
					volMax  = Math.max(...volArr);
				let { lineHeight } = this;
				let lineYScale  = lineHeight / (lineMax - lineMin);
				this.lineMax = lineMax;
				this.lineMin = lineMin;
				this.volMax  = volMax;
				this.lineYScale = lineYScale;
				this.timeArr = timeArr;
			},
			// 设置蜡烛图、成交量 颜色 
			// openPrice: 开盘价格 
			// closePrice: 收盘价格
			// lastClosePrice: 上一期收盘价格
			// 返回 1 或 -1 
			setColor({openPrice, closePrice, lastClosePrice}){
				let color;
				if(closePrice == openPrice){
					color = closePrice >= lastClosePrice ? 1 : -1;
				}else{
					color = closePrice > openPrice ? 1 : -1;
				}
				return color;
			},
			// 绘图
			draw({ctx, volCtx, data}){
				// 获取画布最大/最小值
				this.setBaseParams(data);
				let { upColor, downColor, xScale, volYScale, volMax, lineMax, lineMin, lineYScale, pixelRatio, bgLineColor, scaleTextColor, timeHeight, xAxisLen } = this;
				// 绘制背景网格
				let { chartWidth, lineHeight, volHeight } = this;
				
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
					lineNum: 5
				});
				// 遍历数据 开始画图
				let lastDrawTimePos = 0,  // 最近一次画入画布的时间索引
					lastDrawTimeTxt = '', // 最近一次画入画布的时间文本
					timeSpace       = 12; // 2个时间的间距
				let avgLineIndex    = [6,7,8,9,10],
					{ avgLineColor }= this;
				data.map((item, index) => {
					let { itemWidth } = this;
					// 设置颜色
					let openPrice      = item[1],
						closePrice     = item[2],
						lastClosePrice = data[index - 1] ? data[index - 1][2] : 0;
					let color = this.setColor({openPrice, closePrice, lastClosePrice}) == 1 ? upColor : downColor;
					// 绘制时间刻度以及分割线
					let time = item[0].substr(0,7);
					let when1 = index - lastDrawTimePos > timeSpace, // 当前索引 - 上一次绘制的索引 大于 默认间距(8)
						when2 = index == timeSpace / 2,              // 当前索引最小值 默认间距的一半 4
						when3 = index < (data.length - timeSpace / 4), // 当前索引最大值 画布数据长度 - 默认间距的一半
						when4 = lastDrawTimeTxt != time;             // 当前时间没有写入过画布
					let isFirst = false;
					if((when1 && when3 && when4) || when2){
						this.isFirst = true;
						let pos = data.findIndex((pItem, pIndex) => pItem[0].indexOf(time) > -1);
						let cStartx  = (pos + 0.5) * xScale,
							cStarty  = 0,
							clEndx   = cStartx,
							tlEndy   = lineYScale * lineMax,
							volEndy  = volYScale * volMax;
						this.drawLine({
							startx: cStartx, 
							starty: cStarty, 
							endx: clEndx, 
							endy: tlEndy, 
							color: bgLineColor, 
							ctx
						});	
						this.drawLine({
							startx: cStartx, 
							starty: cStarty, 
							endx: clEndx, 
							endy: volEndy, 
							color: bgLineColor, 
							ctx: volCtx
						});
						this.drawText({
							ctx: volCtx,
							x: cStartx,
							y: volEndy + 4 * pixelRatio,
							text: time,
							color: scaleTextColor,
							textBaseline: 'top',
							textAlign: this.isFirst ? 'left' : 'center'
						});
						lastDrawTimePos = index;
						lastDrawTimeTxt = time;
					}
					
					// 绘制蜡烛图
					let cdtMin    = closePrice >= openPrice ? closePrice : openPrice,
						cdtMax    = cdtMin == closePrice ? openPrice : closePrice,
						cdtx      = xScale * (index + (1 - itemWidth) / 2),
						cdty      = lineYScale * (lineMax - cdtMax),
						cdtWidth  = xScale * itemWidth,
						cdtHeight = lineYScale * (cdtMax - cdtMin),
						cdtMiny   = lineYScale * (lineMax - item[3]),
						cdtMaxy   = lineYScale * (lineMax - item[4]);
					this.drawCandlestick({
						x: cdtx,
						y: cdty,
						width: cdtWidth,
						height: cdtHeight,
						color,
						ctx,
						maxy: cdtMaxy,
						miny: cdtMiny
					});
					// 绘制成交量
					let vol       = item[5],
						volx      = xScale * (index + (1 - itemWidth) / 2),
						voly      = volYScale * (volMax - vol),
						volWidth  = xScale * itemWidth,
						volHeight = volYScale * vol;
					this.drawRect({
						x: volx,
						y: voly,
						width: volWidth,
						height: volHeight,
						color,
						ctx: volCtx
					});
					// 绘制均线
					avgLineIndex.map((avgItem, avgIndex)=>{
						let avg       = item[avgItem],
							lineColor = avgLineColor[avgIndex],
							last      = data[index + 1];
						if(avg && last && index < data.length - 1){
							let startx = (index + 0.5) * xScale,
								starty = (lineMax - avg) * lineYScale,
								endx   = (index + 1.5) * xScale,
								endy   = (lineMax - last[avgItem]) * lineYScale;
							this.drawLine({
								ctx,
								startx,
								starty,
								endx, 
								endy, 
								color: lineColor
							});
						}else{
							
						}
					})
				});
				
				// 绘制刻度
				this.drawScaleText({
					min: lineMin,
					max: lineMax,
					height: lineHeight,
					ctx,
					number: 5
				});
			},
			// 绘制蜡烛图
			// x: 矩形X坐标 y：矩形Y坐标 width：宽度 height：高度 ctx：画布 color 当前矩形颜色 maxy: 引线最大值y坐标 miny：引线最小值y坐标
			// 引线 x 坐标： 矩形坐标 + 矩形宽度 / 2
			drawCandlestick({x, y, width, height, ctx, color, maxy, miny}){
				let { xScale, itemWidth } = this;
				let linex = x + xScale * itemWidth / 2;
				this.drawRect({x, y, width, height, ctx, color});
				this.drawLine({
					startx: linex, 
					starty: maxy, 
					endx: linex, 
					endy: miny, 
					color, 
					ctx
				})
			},
			
			// 绘制刻度文案
			// max 最大值, min 最小值, height 高度, number 显示条数
			drawScaleText({max, min, height, number = 2, ctx}){
				let { font, scaleTextColor, pixelRatio } = this;
				let float = (max < 1 || min < 1) ? 3 : 2;
				let scale = this.toPlusFixed((max - min) / (number - 1), float);
				for(let i = 0; i < number; i++){
					let text = min + scale * i;
					text = this.toPlusFixed(text, float);
					let x = 1.5 * pixelRatio,
						y = height * ((number - 1 - i) / (number - 1)) - x;
					y = y <= x ? x : y;
					let textBaseline = y > x ? 'bottom' : 'top';
					this.drawText({
						ctx,
						x,
						y,
						text,
						color: scaleTextColor,
						textBaseline
					});
				};
			},
			// 按下
			touchstart(e){
				let { x } = e.changedTouches[0];
				this.touchstartx = x;
			},
			// 移动 长按移动 轻按移动
			move(e){
				if(this.isLongpress){
					this.longpressMove(e);
				}else{
					uni.$u.debounce(this.touchmove(e), 1000)
				}
			},
			// 长按
			longpress(e){
				this.isLongpress = true;
				let { x, y } = e.detail;
				e = {
					...e,
					changedTouches: [
						{
							x,
							y
						}
					]
				};
				// 这里的 y 有问题 ，不是基于 盒子，而是全屏
				this.longpressMove(e);
			},
			// 长按之后 移动
			longpressMove(e){
				let { markCtx, markHeight, markWidth, scaleTextColor, timeHeight, pixelRatio, data, xScale, lineYScale, lineMax, lineHeight} = this;
				let { length } = data;
				markCtx.clearRect(0, 0, markWidth, markHeight);
				let {x, y} = e.changedTouches[0];
				x = x < 0 ? 0 : x * pixelRatio;
				y = y < 0 ? 0 : y * pixelRatio;
				let index = x / xScale;  // 当前数据
				if(index < 0) index = 0;
				if(index > length - 1) index = length - 1;
				index = parseInt(index);
				let currentData = data[index];
				this.volShowNum = currentData[5]; // 当前显示的成交量
				this.moveShowData = currentData; // 当前显示的内容
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
				// 设置左侧文本
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
				let timeWidth = markCtx.measureText && markCtx.measureText(time).width; // 设置文本宽度
				timeWidth = timeWidth + 12; // 设置文本两边空余宽度 padding
				let timex = x - timeWidth / 2;
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
			},
			// 轻按拖动
			touchmove(e){
				let { touchstartx, xScale, startIndex, klineData: { length }, xAxisLen, lastMovex = 0} = this;
				let { x = 0 } = e.changedTouches[0];
				let movex = touchstartx - x;
				// 方向相反时，要重新设置 touchstartx 的值
				if(lastMovex * lastMovex > movex * movex ){
					this.touchstartx = x;
				}
				let moveNumber = this.toPlusFixed((movex / xScale), 0); // 移动的距离 除以 x的刻度 等于 移动的数量
				startIndex = startIndex + moveNumber;
				startIndex = startIndex > length - xAxisLen ? length - xAxisLen : startIndex;
				startIndex = startIndex <= 0 ? 0 : startIndex;
				this.startIndex = startIndex;
				this.init();
				// 记录上次移动的距离
				this.lastMovex = movex;
				
			},
			// 松开
			touchend(e){
				this.isLongpress = false;
				this.touchstartx = 0;
				let { markCtx, markHeight, markWidth} = this;
				markCtx.clearRect(0, 0, markWidth, markHeight);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.kline{
		$padding: 24rpx;
		.textBox{
			height: 40rpx;
			display: flex;
			align-items: center;
			font-size: 20rpx;
			.item{
				margin-right: 10rpx;
				&.first{
					margin-top: -1rpx;
				}
				&.color5{
					color: #FF8300;
				}
				&.color10{
					color: #1988F4;
				}
				&.color20{
					color: #880EF5;
				}
				&.color30{
					color: #56B8FF;
				}
				&.color60{
					color: #8694AA;
				}
			}
		}
		.klineBox{
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
				font-size: 22rpx;
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
