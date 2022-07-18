<template>
	<view class="wrap">
		<view class="mapBox">
			<!-- 地图背景 -->
			<view class="mBox bgBox">
				<view class="row" v-for="(itemX, x) in map[level]" :key="x">
					<template v-for="(itemY, y) in itemX">
						<view class="col" :class="{
			                black: itemY == 0,
			                bg: itemY == 1,
			                ball: itemY == 4,
			            }" :key="y">
						</view>
					</template>
				</view>
			</view>
			<!-- 小人 箱子 -->
			<view class="mBox moveBox">
				<view class="row" v-for="(itemX, x) in moveMap" :key="x">
					<template v-for="(itemY, y) in itemX" >
						<view class="col" v-if="itemY != 5" :class="{ box: itemY == 3 }" 
							:key="y"
							:style="{'left': y * 50 + 'rpx', 'top' : x * 50 + 'rpx' }">
						</view>
						<view :key="y" v-if="itemY == 5" class="col people" :style="setPeoplePos"></view>
					</template>
				</view>
			</view>
		</view>
		<view class="keyBox">
			<view class="btn btnTop" @click="move(38)">↑</view>
			<view class="btn btnRight" @click="move(39)">→</view>
			<view class="btn level" @click="changeLevel">选关({{level + 1}})</view>
			<view class="btn btnBottom" @click="move(40)">↓</view>
			<view class="btn btnleft" @click="move(37)">←</view>
		</view>
		<u-picker :show="show" :columns="levelList" @confirm="selectLevel"></u-picker>
	</view>
</template>

<script>
	/**
	 * 1.
	 * 2.
	 */

	import map from './map';
	export default {
		name: 'App',
		data() {
			return {
				map: map,
				level: 0, // 第几关
				moveMap: [],
				peoplePos: {
					x: 0,
					y: 0
				},
				show: false
			}
		},
		computed: {
			setPeoplePos: function() {
				let {
					x,
					y
				} = this.peoplePos;
				let pos = `left: ${x * 50}rpx;top: ${y * 50}rpx`
				return pos;
			},
			levelList(){
				let { length } = this.map;
				let list = [[]];
				for(let i = 0; i < length; i++){
					list[0].push(i + 1)
				}
				return list;
			}
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				this.moveMap = [];
				this.map[this.level].map((v) => {
					let item = [];
					v.map((v2) => {
						item.push(v2);
					})
					this.moveMap.push(item);
				});
				this.getPeoplePos(this.moveMap);
			},
			getPeoplePos(map) {
				map.map((v, y) => {
					let x = v.indexOf(5);
					if (x > -1) {
						this.peoplePos = {
							x,
							y
						}
					}
				})
			},
			getBoxPos(map, type) {
				let pos = [];
				for (let i = 0; i < map.length; i++) {
					for (let k = 0; k < map[i].length; k++) {
						if (map[i][k] == type) {
							pos.push([k, i])
						}
					}
				}
				return pos;
			},
			move(key){
				let {
					x,
					y
				} = this.peoplePos;
				let {
					moveMap
				} = this;
				// isBrick 是否是 砖 或者是 盒子
				// isEnd 是否是盒子终点
				// 左
				if (key == 37) {
					let left = moveMap[y][x - 1];
					let isBrick = (moveMap[y][x - 2] == 1 || moveMap[y][x - 2] == 3);
					if (left != 1) {
						if (left == 3) {
							if (!isBrick) {
								x -= 1;
								this.moveMap[y][x - 1] = 3;
								this.moveMap[y][x] = 2;
							}
						} else {
							x -= 1;
						}
					}
				}
				// 右
				else if (key == 39) {
					let right = moveMap[y][x + 1];
					let isBrick = (moveMap[y][x + 2] == 1 || moveMap[y][x + 2] == 3);
					if (right != 1) {
						if (right == 3) {
							if (!isBrick) {
								x += 1;
								this.moveMap[y][x + 1] = 3;
								this.moveMap[y][x] = 2;
							}
						} else {
							x += 1;
						}
					}
				}
				// 上
				else if (key == 38) {
					let top = moveMap[y - 1][x];
					let isBrick = moveMap[y - 2][x] == 1 || moveMap[y - 2][x] == 3;
					// let isEnd = moveMap[y - 2][x] == 4;
					if (top != 1) {
						if (top == 3) {
							if (!isBrick) {
								y -= 1;
								this.moveMap[y - 1][x] = 3;
								this.moveMap[y][x] = 2;
							}
						} else {
							y -= 1;
						}
					}
				}
				// 下
				else if (key == 40) {
					let down = moveMap[y + 1][x];
					let isBrick = moveMap[y + 2][x] == 1 || moveMap[y + 2][x] == 3;
					if (down != 1) {
						if (down == 3) {
							if (!isBrick) {
								y += 1;
								this.moveMap[y + 1][x] = 3;
								this.moveMap[y][x] = 2;
							}
						} else {
							y += 1;
						}
					}
				}
				this.peoplePos = {
					x,
					y
				};
				setTimeout(() => {
					this.isWin();
				})
			},
			isWin() {
				let a = (this.getBoxPos(this.map[this.level], 4)).toString(),
					b = (this.getBoxPos(this.moveMap, 3)).toString();
				if (a == b) {
					uni.showModal({
						title: 'NP,开始下一关?',
						success: (res)=> {
							let { confirm } = res;
							if(confirm){
								this.level = this.level + 1;
								this.init();
							}
						}
					})
				}
			},
			changeLevel(){
				this.show = true;
			},
			selectLevel(e){
				let { indexs } = e;
				let [index] = indexs;
				this.level = index;
				this.init();
				this.show = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	$url: "../static/moveBox/";
    .wrap{
		.mapBox{
			position: relative;
			width: 600rpx;
			margin: 20rpx auto 0;
		}
        .mBox{
            .row{
                overflow: hidden;   
				height: 50rpx;
				width: 100%;
                .col{
                    width: 50rpx;
                    height: 50rpx;
                    float: left;
                    &.black {
                        background: #000;
                    }
                    &.bg {
                        background: url($url + "bg.jpg") no-repeat;
                        background-size: 100% 100%;
                    }
                    &.box {
                        background: url($url + "box.jpg") no-repeat;
                        background-size: 100% 100%;
                    }
                    &.ball {
                        background: url($url + "light.png") no-repeat;
						background-size: 100% 100%;
                    }
                    &.people {
                        background: url($url + "people.png") no-repeat;
                        z-index: 999;
						background-size: 100% 100%;
                    }
                }
            }
            &.bgBox{
                background: url($url + "bg2.jpg") repeat;
                background-size: 50rpx 50rpx;
            }
            &.moveBox{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
				z-index: 9;
                .row{
                    .col{
                        position: absolute;
                    }
                }
            }
            
        }
        .keyBox{
			width: 300rpx;
			height: 300rpx;
			position: relative;
			margin: 40rpx auto;
			.btn{
				position: absolute;
				width: 100rpx;
				height: 100rpx;
				background: #000;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				&.btnTop{
					top: 0;
					left: 100rpx;
				}
				&.btnRight{
					right: 0;
					top: 100rpx;
				}
				&.btnBottom{
					bottom: 0;
					left: 100rpx;
				}
				&.btnleft{
					left: 0;
					top: 100rpx;
				}
				&.level{
					top: 100rpx;
					left: 100rpx;
					background: none;
					color: #000;
					font-size: 24rpx;
				}
			}
		}
    }
</style>
