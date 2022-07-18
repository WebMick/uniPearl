<template>
	<view class="functionList">
		<view class="module" v-for="(item, index) in tData" :key="index">
			<view class="head">
				<view class="title">{{item.title}}</view>
				<view class="subTitle">{{item.subTitle}}</view>
			</view>
			<view class="list">
				<view class="item"  
					v-for="(cItem, cIndex) in item.list" 
					:key="cItem.id" 
					@click="clickItem(cItem)">
					<view class="icon">
						<image :src="cItem.icon" class="img" mode=""></image>
					</view>
					<view class="title">{{cItem.title}}</view>
				</view>
			</view>
		</view>
	</view>
</template>
 
<script>
	export default {
		name: '',
		data(){
			return {
				tData: [
					{
						title: '我我我我',
						subTitle: '',
						list: [
							{
								id: 1,
								title: '功能',
								icon: 'https://cos765.sunwaystech.com//images/equities/privilege/1/xinxiu.png',
								remarks: '功能备注'
							},
							{
								id: 2,
								title: '功能',
								icon: 'https://cos765.sunwaystech.com//images/equities/privilege/2/xinxiu.png',
								remarks: '功能备注'
							},
							{
								id: 3,
								title: '功能',
								icon: 'https://cos765.sunwaystech.com//images/equities/privilege/3/xinxiu.png',
								remarks: '功能备注'
							},
							{
								id: 4,
								title: '功能',
								icon: 'https://cos765.sunwaystech.com//images/equities/privilege/4/xinxiu.png',
								remarks: '功能备注'
							}
						]
					},
					{
						title: '开发项目',
						subTitle: '',
						list: [
							{
								id: 22,
								title: '趣看行情',
								icon: 'https://cos765.sunwaystech.com/images/equities/product/202207181622205423.png',
								remarks: '趣看行情',
								type: 1,
								url: '/project/seeStock/seeStock'
							},
						]
					},
					{
						title: '开发工具',
						subTitle: '',
						list: [
							{
								id: 31,
								title: 'AChart',
								icon: 'https://cos765.sunwaystech.com//images/equities/privilege/1/xinxiu.png',
								remarks: '',
								type: 1,
								url: '/plug/AChart/AChart'
							},
							{
								id: 33,
								title: '赛博朋克',
								icon: 'https://cos765.sunwaystech.com//images/equities/privilege/2/xinxiu.png',
								remarks: '功能备注',
								type: 1,
								url: '/plug/Btn/Btn'
							},
							{
								id: 34,
								title: 'UNIAPP',
								icon: 'https://cos765.sunwaystech.com//images/equities/privilege/2/xinxiu.png',
								remarks: '功能备注'
							}
						]
					},
					{
						title: '辅助工具',
						subTitle: '',
						list: [
							{
								id: 2,
								title: '头条评论',
								icon: 'https://cos765.sunwaystech.com//images/equities/privilege/2/xinxiu.png',
								remarks: '功能备注',
								type: 1,
								url: '/subTools/TtComment/TtComment',
								needPassword: true,
								password: '958023'
							}
						]
					},
					{
						title: '小游戏',
						subTitle: '',
						list: [
							{
								id: 1,
								title: '推箱子',
								icon: 'https://cos765.sunwaystech.com//images/equities/privilege/1/xinxiu.png',
								type: 1,
								url: '/games/MoveBox/MoveBox',
							}
						]
					}
				]
			}
		},
		methods:{
			clickItem(item){
				let { type } = item;
				switch(type){
					case 1:
					let { url, needPassword } = item;
					if(needPassword)
						uni.showModal({
							title: '请输入功能密码！',
							editable: true,
							success(res) {
								let { confirm } = res;
								if(confirm){
									let { content } = res;
									let { password } = item;
									if(content == password)
										uni.navigateTo({
											url
										});
									else
										uni.showToast({
											title: '密码错误！',
											icon: 'none'
										})
								}
							}
						})
					else
						wx.navigateTo({
							url
						});
						break;
					case 2:
						wx.navigateToMiniProgram({
							appId: 'wx94532f949008713c'
						});
						break;
					default:
						break;
				}
			}
		}
	}
</script>
 
<style lang="scss" scoped>
	.functionList{
		.module{
			margin-top: 20rpx;
			background-color: #fff;
			padding: 20rpx 32rpx 0;
			.head{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.title{
					font-size: 32rpx;
				}
				.subTitle{
					font-size: 24rpx;
					color: #909193;
				}
			}
			.list{
				overflow: hidden;
				.item{
					float: left;
					width: 25%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					padding: 20rpx 0;
					.icon{
						width: 60rpx;
						height: 60rpx;
						display: flex;
						.img{
							display: block;
							width: 100%;
							height: 100%;
						}
					}
					.title{
						margin-top: 15rpx;
						font-size: 26rpx;
						color: #606266;
					}
				}
			}
		}
	}
</style>