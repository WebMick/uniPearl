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
		<view class="setBox">
			<view class="noChange" v-if="canSetGame"></view>
			<view class="item">
				<view class="title">难度:{{levelText[level]}}</view>
				<view class="selectBox">
					<picker @change="changeLevel" class="picker" :value="level" :range="levelText">
						<view class="select">{{levelText[level]}}</view>
					</picker>
				</view>
			</view>
			<view class="item">
				<view class="title">先手:{{firstHandText[firstHand]}}</view>
				<view class="selectBox">
					<picker @change="changeFirstHand" class="picker" :value="firstHand" :range="firstHandText">
						<view class="select">{{firstHandText[firstHand]}}</view>
					</picker>
				</view>
			</view>
			<view class="item">
				<view class="title">模式:{{modelText[model]}}</view>
				<view class="selectBox">
					<picker @change="changeModel" class="picker" :value="model" :range="modelText">
						<view class="select">{{modelText[model]}}</view>
					</picker>
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
						className = role == 0 ? 'red ed' : 'black ed';
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
				model: 0, // 模式： 0 人机  1 真人
				modelText: ['人机', '真人'],
				level: 1, // 难易： 0 入门  1 高手 
				levelText: ['入门', '高手'],
				firstHand: 1, //先手： 0 红 1 黑
				firstHandText: ['红', '黑'],
				currentRole: 0, // 当前下棋的人 0 红 1 黑
				checkerMap: new Map(), // 当前以及下过的 坐标记录
				isWinData: [
					[], [], [], []
				], // 根据当前点，生成的四条线 作为判断输赢的数据
				last: {}, // 记录最后一次的下棋坐标
				winner: null , // 胜者
				canSetGame: false, // 是否可以设置游戏基础信息
			};
		},
		methods: {
			// 下棋
			playChess(x, y, isAuto = false){
				if(!this.winner){
					let key = `${x}-${y}`;
					let { checkerMap, firstHand, currentRole, model } = this;
					let { size } = checkerMap;
					this.canSetGame = size > 0;
					if(!checkerMap.has(key)){
						let role = currentRole == 0 ? 1 : 0;
						let item = {
							x,
							y,
							role
						};
						// 下完一颗 换边
						this.currentRole = role;
						this.last = {
							x,
							y
						}
						this.checkerMap.set(key, item);
						this.isWin(x, y);
						// 未分出胜负 标记自动下棋 人机对战 才下棋
						if(!this.winner && !isAuto && model == 0){
							this.autoAdd(x, y, true);
						};
					}else{
						this.toast('此位置已下过棋子！');
					}
				}else{
					this.toast('对局已完成！');
				}
			},
			createLine(x, y){
				// type 3: 没下过 0 red 1 black
				let { checkerMap, checkerboardSize } = this;
				// 竖向
				for(let i = 0; i < checkerboardSize; i++){
					let key = `${x}-${i}`;
					let type = 3,
						item = checkerMap.get(key);
					this.isWinData[0][i] = item || {};
				};	
				// 横向
				for(let i = 0; i < checkerboardSize; i++){
					let key = `${i}-${y}`;
					let type = 3,
						item = checkerMap.get(key);
					this.isWinData[1][i] = item || {};
				}
				// 左右 上斜
				// 左右 上斜 左边部分
				for(let i = 0; i <= x; i++){
					let key = `${x - i}-${y + i}`;
					let type = 3,
						item = checkerMap.get(key);
					this.isWinData[2][x - i] = item || {};
				}
				// 左右 上斜 右边部分
				for(let i = 0; i < checkerboardSize - x; i++){
					let key = `${x + i}-${y - i}`;
					let type = 3,
						item = checkerMap.get(key);
					this.isWinData[2][x + i] = item || {};;
				}
				// 左右 下斜
				// 左右 下斜 左边部分
				for (let i = 0; i <= y; i++) {
					let key = `${x - i}-${y - i}`;
					let type = 3,
						item = checkerMap.get(key);
					this.isWinData[3][x - i] = item || {};;
				}
				// 左右 下斜 右边部分
				for (let i = 0; i < checkerboardSize - y; i++) {
					let key = `${x + i}-${y + i}`;
					let type = 3,
						item = checkerMap.get(key);
					this.isWinData[3][x + i] = item || {};;
				};
			},
			// 校验输赢
			isWin(x, y){
				this.createLine(x, y);
				let { currentRole } = this; // 根据当前下棋的人，判断是谁赢了
				let txt = currentRole == 0 ? '00000' : '11111',
					currentRoleTxt = currentRole == 0 ? '红方' : '黑方';
				// 四条线连续 5 个一样的就获胜 
				this.isWinData.map((item, index) => {
					if(!this.winner){
						let role = item.map(cItem => cItem.role);
						let str  = role.join('');
						let winIndex = str.indexOf(txt);
						if(winIndex >= 0){
							this.winner = currentRole;
							// 获取连续的 五颗棋子 的位置，做出动效 标记
							this.toast(`恭喜${currentRoleTxt},获得胜利！`);
						}
					}
				});
			},
			// 自动下棋
			autoAdd(x, y){
				// 是否已经自动下过了
				let isClick = false;
				// -- 牛逼模式，先查看对方有没有 3连 4连
				if(this.level == 1){
					let { checkerMap } = this;
					let txt1 = this.firstHand == 0 ? '000' : '111',
						txt2 = this.firstHand == 0 ? '0000' : '1111',
						txt3 = this.firstHand == 0 ? '1000' : '0111',
						txt4 = this.firstHand == 0 ? '0001' : '1110';
					this.isWinData.map((item, index) => {
						let role = item.map(cItem => cItem.role || 3);
						let str  = role.join('');
						let _index1 = str.indexOf(txt1),
							_index2 = str.indexOf(txt2),
							_index3 = str.indexOf(txt3),
							_index4 = str.indexOf(txt4);	
						if(_index1 >= 0 && _index2 < 0 && _index3 < 0 && _index4 < 0){
							// 三连击了, 两边还没有子，堵住一边
							// 三连击开始的 x = _index1 y = ？？？？
							let { x: newx, y: newy } = this.isWinData[index][_index1];
							if(index == 0){
								newy = newy - 1;
								let key = `${newx}-${newy}`;
								if(checkerMap.has(key)){
									newy = newy + 1;
								}
							}
							else if(index == 1){
								newx = newx - 1;
								let key = `${newx}-${newy}`;
								if(checkerMap.has(key)){
									newx = newx + 1;
								}
							}
							else if(index == 2){
								newx = newx - 1;
								newy = newy + 1;
								let key = `${newx}-${newy}`;
								if(checkerMap.has(key)){
									newx = newx + 1;
									newy = newy - 1;
								}
							}
							else if(index == 3){
								newx = newx - 1;
								newy = newy - 1;
								let key = `${newx}-${newy}`;
								if(checkerMap.has(key)){
									newx = newx + 1;
									newy = newy + 1;
								}
							}
							console.log({index})
							this.playChess(newx, newy, true);
							isClick = true;
						}
						else if(_index2 >= 0){
							let { x: newx, y: newy } = this.isWinData[index][_index2];
							if(index == 0){
								newy = newy - 1;
								let key = `${newx}-${newy}`;
								if(checkerMap.has(key)){
									newy = newy + 5;
								}
							}
							else if(index == 1){
								newx = newx - 1;
								let key = `${newx}-${newy}`;
								if(checkerMap.has(key)){
									newx = newx + 5;
								}
							}
							else if(index == 2){
								newx = newx - 1;
								newy = newy + 1;
								let key = `${newx}-${newy}`;
								if(checkerMap.has(key)){
									newx = newx + 5;
									newy = newy - 5;
								}
							}
							else if(index == 3){
								newx = newx - 1;
								newy = newy - 1;
								let key = `${newx}-${newy}`;
								if(checkerMap.has(key)){
									newx = newx + 5;
									newy = newy + 5;
								}
							}
							console.log({index,_index2, newx, newy})
							this.playChess(newx, newy, true);
							isClick = true;
						}
					});
				}
				// -- 简单模式 
				// 以 当前点为准x y 各自上下左右扩散 2个坐标 即 以当前点画一个 5*5 的大格子 
				// 按自定义顺序 优先下棋
				// 前4个的顺序，随机一下，感觉牛逼一点
				if(isClick) return;
				console.log('没达到高手')
				let randomMaps = [
					[x - 1, y],
					[x ,y - 1],
					[x + 1, y], 
					[x, y + 1]
				];
				let { length: randomMapsLength } = randomMaps;
				let maps = [
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
				]; // 自动下棋的顺序
				for(let i = 0; i < randomMapsLength; i++){
					let _index = parseInt(Math.random() * randomMapsLength);
					maps.unshift(randomMaps[_index]);
				};
				
				maps.map(item => {
					let [newx, newy] = item;
					let key = `${newx}-${newy}`;
					if(!this.checkerMap.has(key) && newx >= 0 && newy >= 0 && !isClick){
						this.playChess(newx, newy, true);
						isClick = true;
					}
				});	
			},
			// 提示
			toast(title){
				uni.showToast({
					title,
					icon: 'none'
				})
			},
			// 切换 难度
			changeLevel(e){
				let { detail: { value } } = e;
				this.level = value;
			},
			// 切换先手
			changeFirstHand(e){
				let { detail: { value } } = e;
				this.firstHand = value;
				this.currentRole = value == 0 ? 1 : 0;;
			},
			// 切换模式
			changeModel(e){
				let { detail: { value } } = e;
				this.model = value;
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
		.setBox{
			display: flex;
			width: 560rpx;
			margin: 0 auto;
			border-left: #999 solid 1px;
			position: relative;
			.noChange{
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 9;
			}
			.item{
				flex: 1;
				border: #999 solid 1px;
				border-left: none;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				height: 70rpx;
				position: relative;
				.title{
					position: relative;
				}
				.selectBox{
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					z-index: 6;
					opacity: 0;
					.picker,.picker .select{
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
					}
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
