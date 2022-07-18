
export const Mixins = {
	computed: {
		// 分辨率
		pixelRatio(){
			return 3;
		},
		// 成交量 刻度
		volYScale(){
			let { volHeight, volMax, pixelRatio, timeHeight } = this;
			let scale = (volHeight - timeHeight * pixelRatio) / volMax;
			return scale;
		},
		font(){
			let { pixelRatio } = this;
			let font = `${10 * pixelRatio}px sans-serif`;
			return font;
		}
	},
	data () {
		return {
			downColor: '#02BD85',
			upColor: '#FE5269',
			bgLineColor: '#F4F5F6', // F4F5F6
			avgLineColor: ['#FF8300', '#1988F4', '#880EF5', '#56B8FF', '#8694AA'],
			scaleTextColor: '#606266',
			chartWidth: 0,
			lineHeight: 0,
			volHeight: 0,
			timeHeight: 15
		}
	},
	mounted(){
		
	},
	methods: {
		// 获取 dom 信息
		getCanvasDom(id){
			return new Promise((resolve, reject) => {
				const query = wx.createSelectorQuery().in(this);
				query.select(`#${id}`)
					 .fields({node: true, size: true})
					 .exec((res)=>{
						if(res[0]){
							let { node } = res[0];
							if(node){
								resolve(res[0]);
							}
						}else{
							uni.showToast({
								title: 'Canvas获取失败！',
								icon: "none",
								duration: 1000
							})
						}
					 })
			});
		},
		// 四舍六入
		toPlusFixed(val, float){
			let tempNum = 0,
				s, 
				temp,
				str = val + '';
			let start = str.indexOf('.');
			if(str.substr(start + float + 1, 1) >= 5){
				tempNum = 1;
			}
			temp = Math.pow(10, float);
			s = Math.floor(val * temp) + tempNum;
			return s / temp;
		},
		// 绘制矩形
		// x: 矩形X坐标 y：矩形Y坐标 width：宽度 height：高度 ctx：画布 color 当前矩形颜色
		drawRect({x, y, width, height, ctx, color}){
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.fillRect(x, y, width, height);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		},
		// 绘制直线
		// startx 起点x坐标, starty 起点y坐标, endx 结束点x坐标, endy 结束点y坐标, color 线条颜色, ctx 画布
		drawLine({startx, starty, endx, endy, color, ctx}){
			let { pixelRatio } = this;
			let lineWidth = 1 * pixelRatio,
				lineWidthHalf = lineWidth / 2;
			startx = startx - lineWidthHalf;
			starty = starty - lineWidthHalf;
			endx = endx - lineWidthHalf;
			endy = endy - lineWidthHalf;
			startx = startx < lineWidthHalf ? lineWidthHalf : startx;
			starty = starty < lineWidthHalf ? lineWidthHalf : starty;
			endx = endx < lineWidthHalf ? lineWidthHalf : endx;
			endy = endy < lineWidthHalf ? lineWidthHalf : endy;
			
			ctx.beginPath();
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = color;
			ctx.moveTo(startx, starty);
			ctx.lineTo(endx, endy);
			ctx.stroke();
			ctx.closePath();
		},
		// 写入文本
		drawText({text, x, y, ctx, color, font, textAlign = "left", textBaseline = 'top'}){
			font = font || this.font;
			ctx.beginPath();
			ctx.font = font;
			ctx.fillStyle = color;
			ctx.textAlign = textAlign;
			ctx.textBaseline = textBaseline;
			ctx.fillText(text, x, y);
		},
		// 绘制圆角矩形
		fillRoundRect({ctx, x, y, width, height, radius, fillColor}){
			if (2 * radius > width || 2 * radius > height) { return false; }
			ctx.save();
			ctx.translate(x, y);
			//绘制圆角矩形的各个边  
			ctx.beginPath(0);
			ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
			ctx.lineTo(radius, height);
			ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
			ctx.lineTo(0, radius);
			ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
			ctx.lineTo(width - radius, 0);
			ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
			ctx.lineTo(width, height - radius);
			ctx.closePath();
			ctx.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
			ctx.fill();
			ctx.restore();
		},
		// 绘制带底色的文本框
		drawTextHasBg({ctx, x, y, text, color, fillColor, width, height, radius}){
			let textWidth = ctx.measureText(text).width;
			let padding = (width - textWidth) / 2;
			this.fillRoundRect({
				ctx,
				x,
				y,
				width,
				height,
				fillColor,
				radius
			});
			let { pixelRatio } = this;
			this.drawText({
				ctx,
				x: x + padding,
				y: y + (height - 10 * pixelRatio) / 2,
				color,
				text,
			});
		},
		// 绘制十字架指针、刻度值、时间
		drawPointer({ctx, x, y, width, height, color}){
			this.drawLine({
				startx: x, 
				starty: 0, 
				endx: x, 
				endy: height, 
				color, 
				ctx
			});
			this.drawLine({
				startx: 0, 
				starty: y, 
				endx: width, 
				endy: y, 
				color, 
				ctx
			});
		},
		// 设置背景网格线 只有横线
		// ctx：画布  width： 画布宽度  height：画布高度 lineNum：线条数量
		drawBgLine({ctx, width, height, lineNum = 2}){
			let { bgLineColor, pixelRatio } = this;
			for(let i = 0; i < lineNum; i++ ){
				let y = height * (lineNum - 1 - i) / (lineNum - 1);
				if(i < 2){
					this.drawLine({
						startx: width * i,
						starty: 0,
						endx: width * i,
						endy: height,
						color: bgLineColor, 
						ctx
					})
				}
				this.drawLine({
					startx: 0, 
					starty: y, 
					endx: width, 
					endy: y, 
					color: bgLineColor, 
					ctx
				});
			};
		},
		// 百分比
		percentage(val, yestClose){
			return (((val / yestClose) - 1) * 100).toFixed(2) + '%';
		},
	},
	beforeDestroy(){
		
	},
	onUnload(){
		
	}
}