<template>
	<view class="gobang">
		<view class="main">
			<view class="bg">
				<view class="row" v-for="(item, index) in size - 1" :key="index">
					<view class="col" v-for="(cItem, cIndex) in size - 1" :key="cIndex"></view>
				</view>
			</view>
			<view class="checkerboard">
				<view class="row" v-for="(item, index) in size" :key="index">
					<view class="col" v-for="(cItem, cIndex) in size"
						:class="{ed: isEd(cItem, item), isMe: itemIsMe(cItem, item), last: lastx == cItem && lasty == item}" 
						@click="clk(cItem, item)"
						:key="cIndex"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			isEd: function() {
				return function(x, y) {
					let key = x + '-' + y;
					return this.clkEd.has(key);
				}
			},
			itemIsMe: function() {
				return function(x, y) {
					let key = x + '-' + y;
					return this.clkEd.has(key) && this.clkEd.get(key).isMe;
				}
			}
		},
		data() {
			return {
				size: 15,
				isMe: false,
				clkEd: new Map(), // 已经下过的坐标
				winsData: [
					[],
					[],
					[],
					[]
				], // 存储四条线的位置
				lastx: '',
				lasty: ''
			};
		},
		methods: {
			clk(x, y) {
				this.addItem(x, y, false);
			},
			// 添加已选中棋子
			addItem(x, y, isAuto) {
				// console.log({x,y});
				let key = x + '-' + y;
				if (!this.clkEd.has(key)) {
					this.isMe = !this.isMe;
					let item = {
						x,
						y,
						isMe: isAuto
					};
					this.clkEd.set(key, item);
					if(!isAuto){
						this.autoAdd(x, y);
					}
					this.lastx = x;
					this.lasty = y;
					setTimeout(() => {
						this.isWins(x, y);
					})
				}
			},
			// 判断输赢
			isWins(x, y) {
				// 以 当前位置新建 四条线 -- | / \
				// 横向
				let {
					size
				} = this;
				for (let i = 0; i <= size; i++) {
					let key = i + '-' + y;
					let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
					this.winsData[0][i - 1] = item;
				}
				// 竖向
				for (let i = 0; i <= size; i++) {
					let key = x + '-' + i;
					let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
					this.winsData[1][i - 1] = item;
				}
				// / 向 左边的
				for (let i = 0; i <= x; i++) {
					let key = x - i + '-' + (y + i);
					let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
					this.winsData[2][x - i] = item;
				}
				// /向 右边的
				for (let i = 0; i < size - x; i++) {
					let key = x + i + '-' + (y - i);
					let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
					this.winsData[2][x + i] = item;
				}
			 // \向
				for (let i = 0; i <= y; i++) {
					let key = x - i + '-' + (y - i);
					let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
					this.winsData[3][x - i - 1] = item;
				}
				// \向 右边的
				for (let i = 0; i < size - y; i++) {
					let key = x + i + '-' + (y + i);
					let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
					this.winsData[3][x + i - 1] = item;
				}
				// 判断是否有连续5个相同的
				this.winsData.map((v) => {
					let str = '';
					v.map((v2) => {
						let t;
						if (v2 == true) {
							t = 1;
						} else if (v2 == false) {
							t = 0;
						} else {
							t = 'null';
						}
						str += t;
					});
					if (str.indexOf('00000') >= 0) {
						uni.showToast({
							title: 'red wins!',
							icon: 'none'
						});
						return;
					}
					if (str.indexOf('11111') >= 0) {
						uni.showToast({
							title: 'black wins!',
							icon: 'none'
						});
						return;
					}
				})
			},
			// 自动下棋
			// 查看附件2格内是否有下过棋子
			autoAdd(x, y){
				let xleft0  = x,
					xleft1  = x - 1,
					xleft2  = x - 2,
					xright1 = x + 1,
					xright2 = x + 2;
				// 以 当前点为准x y 各自上下左右扩散 2个坐标 即 以当前点画一个 5*5 的大格子 
				// 按自定义顺序 优先下棋
				let maps = [
					[x - 1, y], 
					[x ,y - 1],
					[x + 1, y], 
					[x, y + 1],
					[x - 2, y],
					[x - 1, y - 1],
					[x, y - 2],
					[x + 1, y - 1],
					[x + 2, y],
					[x + 1, y + 1],
					[x, y + 2],
					[x - 1, y + 1],
					[x - 2, y - 1],
					[x - 1, y - 2],
					[x + 1, y - 2],
					[x + 2, y - 1],
					[x + 2, y + 1],
					[x + 1, y + 2],
					[x - 1, y + 2],
					[x - 2, y + 1],
					[x - 2, y + 2],
					[x - 2, y - 2],
					[x + 2, y - 2],
					[x + 2, y + 2]
				]
				
				let isClick = false;
				maps.map(item => {
					let [keyx, keyy] = item;
					let key = keyx + '-' + keyy;
					if(!this.clkEd.has(key) && keyx >= 0 && keyy >= 0 && !isClick){
						this.addItem(keyx, keyy, true);
						isClick = true;
					}
				});	
				
				let { clkEd } = this;
				
				console.log({clkEd})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gobang {
		padding-top: 50rpx;
		.main {
			width: 600rpx;
			height: 600rpx;
			position: relative;
			margin: 0 auto;
			.bg {
				display: flex;
				flex-direction: column;
				position: absolute;
				left: 20rpx;
				top: 20rpx;
				width: 560rpx;
				height: 560rpx;
				border-left: #999 solid 1px;
				border-bottom: #999 solid 1px;

				.col {
					border: #999 solid 1px;
					border-left: none;
					border-bottom: none;
				}
			}

			.checkerboard {
				display: flex;
				flex-direction: column;
				position: relative;
				width: 100%;
				height: 100%;
				border-left: rgba(0, 0, 0, 0) solid 1px;
				border-bottom: rgba(0, 0, 0, 0) solid 1px;
				.col {
					border: rgba(0, 0, 0, 0) solid 1px;
					border-left: none;
					border-bottom: none;
					&.ed {
						&:after {
							content: '';
							position: absolute;
							left: 50%;
							top: 50%;
							width: 60%;
							height: 60%;
							border-radius: 50%;
							background: red;
							transform: translate(-50%, -50%);
						}

						&.isMe {
							&:after {
								background: #000;
							}
						}
						&.last{
							&:after {
								animation: ani 1s linear infinite;
							}
						}
					}
				}
			}

			.row {
				flex: 1;
				display: flex;

				.col {
					width: 40rpx;
					height: 40rpx;
					box-sizing: border-box;
					position: relative;
				}
			}
		}
	}
	@keyframes ani{
		0%,100%{
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		50%{
			opacity: 0.5;
			transform: translate(-50%, -50%) scale(0.9);
		}
	}
</style>
