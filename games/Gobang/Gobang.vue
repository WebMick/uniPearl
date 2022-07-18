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
					<view class="col" 
						v-for="(cItem, cIndex) in size"
						:class="{ed: isEd(itemCol, itemRow), isMe: itemIsMe(itemCol, itemRow)}"  
						@click="clk(itemCol, itemRow)"
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
				return function(x, y){
					let key = x + '-' +  y;
					return this.clkEd.has(key);
				}
			},
			itemIsMe: function() {
				return function (x, y) {
					let key = x + '-' +  y;
					return this.clkEd.has(key) && this.clkEd.get(key).isMe;
				}
			}
		},
		data() {
			return {
				size: 15,
				isMe: false,
				clkEd: new Map(), // 已经下过的坐标
				winsData: [[],[],[],[]], // 存储四条线的位置
			};
		},
		methods: {
			clk (x,y) {
			  this.addItem(x, y);
			  this.$forceUpdate();
			},
			// 添加已选中棋子
			addItem (x, y) {
			  // console.log({x,y});
			  let key = x + '-' +  y;
			  if(!this.clkEd.has(key)){
			    this.isMe = !this.isMe;
			    let item = {
			      x,
			      y,
			      isMe: this.isMe
			    };
			    this.clkEd.set(key, item);
			  }
			  setTimeout(()=>{
			    this.isWins(x, y);
			  })
			},
			// 判断输赢
			isWins (x, y) {
			  // 以 当前位置新建 四条线 -- | / \
			  // 横向
			  let { size } = this;
			  for(let i = 0; i <= size; i++){ 
			    let key = i + '-' + y;
			    let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
			    this.winsData[0][i - 1] = item;
			  }
			  // 竖向
			  for(let i = 0; i <= size; i++){
			    let key = x + '-' + i;
			    let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
			    this.winsData[1][i - 1] = item;
			  }
			  // / 向 左边的
			  for(let i = 0; i <= x; i++){
			    let key = x - i + '-' + (y + i);
			    let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
			    this.winsData[2][x - i] = item;
			  }
			  // /向 右边的
			  for(let i = 0; i < size - x; i++){
			    let key = x + i + '-' + (y - i);
			    let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
			    this.winsData[2][x + i] = item;
			  }
			  // \向
			  for(let i = 0; i <= y; i++){
			    let key = x - i + '-' + (y - i);
			    let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
			    this.winsData[3][x - i - 1] = item;
			  }
			  // \向 右边的
			  for(let i = 0; i < size - y; i++){
			    let key = x + i + '-' + (y + i);
			    let item = this.clkEd.has(key) ? this.clkEd.get(key).isMe : null;
			    this.winsData[3][x + i - 1] = item;
			  }
			  // 判断是否有连续5个相同的
			  this.winsData.map((v) => {
			    let str = '';
			    v.map((v2) => {
			      let t;
			      if(v2 == true){
			        t = 1;
			      }else if(v2 == false){
			        t = 0;
			      }else{
			        t = 'null';
			      }
			      str += t;
			    });
			    if(str.indexOf('00000') >= 0){
			      alert('red wins');
			      return;
			    }
			    if(str.indexOf('11111') >= 0){
			      alert('black wins');
			      return;
			    }
			  })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gobang{
		padding-top: 50rpx;
		.main{
			width: 600rpx;
			height: 600rpx;
			position: relative;
			margin: 0 auto;
			.bg{
				display: flex;
				flex-direction: column;
				position: absolute;
				left: 20rpx;
				top: 20rpx;
				width: 560rpx;
				height: 560rpx;
				border-left: #999 solid 1px;
				border-bottom: #999 solid 1px;
				.col{
					border: #999 solid 1px;
					border-left: none;
					border-bottom: none;
				}
			}
			.checkerboard{
				display: flex;
				flex-direction: column;
				position: relative;
				width: 100%;
				height: 100%;
				border-left: rgba(0,0,0,0) solid 1px;
				border-bottom: rgba(0,0,0,0) solid 1px;
				.col{
					border: rgba(0,0,0,0) solid 1px;
					border-left: none;
					border-bottom: none;
					&.ed{
						&:after{
							content: '';
							position: absolute;
							left: 50%;
							top: 50%;
							width: 60%;
							height: 60%;
							border-radius: 50%;
							background: red;
							transform: translate(-50%,-50%);
						}
						&.isMe{
							&:after{
								background: #000;
							}
						}
					}
				}
			}
			.row{
				flex: 1;
				display: flex;
				.col{
					width: 40rpx;
					height: 40rpx;
					box-sizing: border-box;
					position: relative;
				}
			}
		}
	}
</style>
