<template>
	<view class="gobang">
		<view class="main">
			<view class="bg">
				<view class="row" v-for="(item, index) in checkerboardSize - 1" :key="index">
					<view class="col" v-for="(cItem, cIndex) in checkerboardSize - 1" :key="cIndex"></view>
				</view>
			</view>
			<view class="checkerboard">
				<view class="row" v-for="(item, index) in checkerboardSize" :key="index">
					<view class="col" 
						v-for="(cItem, cIndex) in checkerboardSize"
						:key="cIndex"
						:class="[setClass(cItem, item)]"
						@click="playChess(cItem, item)"
						>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			setClass(){
				return (x, y) => {
					let className = '';
					let { checkerMap, last } = this;
					let key = `${x}-${y}`;
					let item = checkerMap.get(key);
					if(item){
						let { role, x, y } = item;
						className = role == 1 ? 'red ed' : 'black ed';
						if(x == last.x && y == last.y){
							className = `${className} last`
						};
					}
					return className;
				}
			}
		},
		data() {
			return {
				checkerboardSize: 15, // 棋盘大小
				model: 1, // 模式： 1 人机  2 真人
				level: 2, // 难易： 1 入门  2 高手 
				firstHand: 1, //先手： 1 红 2 黑
				currentRole: 1, // 当前下棋的人 1 红 2 黑
				checkerMap: new Map(), // 当前以及下过的 坐标记录
				isWinData: [
					[], [], [], []
				], // 根据当前点，生成的四条线 作为判断输赢的数据
				last: {}, // 记录最后一次的下棋坐标
			};
		},
		methods: {
			// 下棋
			playChess(x, y){
				let key = `${x}-${y}`;
				let { checkerMap, firstHand, currentRole } = this;
				if(!checkerMap.has(key)){
					let role = currentRole == 1 ? 2 : 1;
					let item = {
						x,
						y,
						role
					};
					this.currentRole = role;
					this.last = {
						x,
						y
					}
					this.checkerMap.set(key, item);
					this.isWin(x, y);
				}else{
					this.toast('此位置已下过棋子！')
				}
			},
			// 校验输赢
			isWin(x, y){
				// type 0: null 1 red 2 black
				let { checkerMap, checkerboardSize } = this;
				// 竖向
				for(let i = 0; i < checkerboardSize; i++){
					let key = `${x}-${i}`;
					let type = 0,
						item = checkerMap.get(key)
					if(item){
						let { role } = item;
						type = role;
					}
					this.isWinData[0][i] = type;
				};	
				// 横向
				for(let i = 0; i < checkerboardSize; i++){
					let key = `${i}-${y}`;
					let type = 0,
						item = checkerMap.get(key)
					if(item){
						let { role } = item;
						type = role;
					}
					this.isWinData[1][i] = type;
				}
				// 左右 上斜
				// 左右 上斜 左边部分
				for(let i = 0; i <= x; i++){
					let key = `${x - i}-${y + i}`;
					let type = 0,
						item = checkerMap.get(key)
					if(item){
						let { role } = item;
						type = role;
					}
					this.isWinData[2][x - i] = type;
				}
				// 左右 上斜 右边部分
				for(let i = 0; i < checkerboardSize - x; i++){
					let key = `${x + i}-${y - i}`;
					let type = 0,
						item = checkerMap.get(key)
					if(item){
						let { role } = item;
						type = role;
					}
					this.isWinData[2][x + i] = type;
				}
				// 左右 下斜
				// 左右 下斜 左边部分
				
				// 左右 下斜 右边部分
				
				console.log(this.isWinData)
			},
			// 提示
			toast(title){
				uni.showToast({
					title,
					icon: 'none'
				})
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
							transform: translate(-50%, -50%);
						}
						&.red{
							&:after {
								background: red;
							}
						}
						&.black {
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
