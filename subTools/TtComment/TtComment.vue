<template>
	<view class="comment">
		<view class="contentBox">
			<textarea class="ipt" v-model="content" placeholder="输入链接内容" maxlength="-1"></textarea>
		</view>
		
		<view class="btnBox">
			<view class="btn" @click="isLogin = !isLogin">登录</view>
			<view class="btn" @click="getLink">获取连接</view>
			<view class="btn" @click="commentAll">一键评论</view>
		</view>
		<view class="list">
			<view class="item" v-for="(item, index) in linkList" :key="item.id">
				<view class="title">
					<text class="text">{{item.title}}</text>
					<text class="link" @click="toWebview(item)">[查看原文]</text>
				</view>
				<view class="iptBox">
					<textarea class="ipt" v-model="item.content" placeholder="请输入评论" maxlength="-1"></textarea>
					<view class="btnComment" :class="{ed: item.isComment}" @click="commentOne(item, index)">{{item.isComment ? '已评论' : '评论'}}</view>
				</view>
			</view>
		</view>
		<u-popup 
			:show="isLogin" 
			mode="bottom" 
			:round="10">
			<Login :isLogin.sync="isLogin"></Login>
		</u-popup>
	</view>
</template>

<script>
	import { comment } from './request/api.js'
	import Login from './components/Login.vue'
	export default {
		components: {
			Login
		},
		data() {
			return {
				isLogin: false,
				content: `@微博1群头条3群+徐倪帆 头条3群
1、5月新能源销量出炉 广汽埃安拿下第一 极氪AITO问界创新高！ http://www.toutiao.com/a7106029773625360933
2、5月销量，新势力排排座，埃安夺冠，蔚来掉队，威马消声 http://www.toutiao.com/a7106031854209614369
3、国产新能源还能这样用？ 选择AION V Plus一开始想着是为了响应国家的号召 http://www.toutiao.com/item/1734891227157519`,
				linkList: '', // 链接
			}
		},
		onLoad() {
			
		},
		methods: {
			replaceSrc(txt){
				var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
				let links = [];
				let title = [];
				var result = txt.replace(reg,function(item){
					txt = txt.split(item);
					let title = txt[0];
					txt = txt[1];
					let arr = item.split('/');
					let id = arr[arr.length - 1];
					id = id.match(/[0-9]+/g)[0];
					console.log(id)
					links.push({
						id,
						title,
						url: item,
						isComment: false
					})
				});
				return links;
			},
			getLink(){
				let { content } = this;
				this.linkList = this.replaceSrc(content);
			},
			commentOne(item, index){
				let { content, id, isComment } = item;
				if(!isComment){
					if(!content || content.length <= 10){
						uni.showToast({
							title: '评论字数最少为10！',
							icon: 'none'
						});
						return;
					}
					let params = {
						group_id: id,
						item_id: id,
						text: content
					}
					comment(params).then(res => {
						let { errno } = res;
						if(errno == 0){
							this.linkList[index].isComment = true;
						}
					});
				}
			},
			commentAll(){
				let { linkList } = this;
				let { length } = linkList;
				let hasNull = linkList.findIndex((item) => !item.content || item.content.length < 10);
				if(hasNull != '-1'){
					uni.showToast({
						title: `第${hasNull + 1}条字数太少！`,
						icon: 'none'
					});
					return;
				}
				let _index = 0;
				let timer = setInterval(()=>{
					uni.showLoading({
						title: `评论中(${_index + 1}/${length})...`,
						mask: true
					});
					let item = linkList[_index];
					let { isComment } = item;
					if(!isComment){
						this.commentOne(item, _index);
					}
					_index++;
					if(_index >= length){
						uni.hideLoading();
						clearInterval(timer);
					}
				}, 5 * 1000);
			},
			toWebview(item){
				let { url } = item;
				uni.navigateTo({
					url: '../Webview/Webview?src=' + url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment{
		padding: 25rpx;
		.contentBox{
			.ipt{
				display: block;
				width: 100%;
				padding: 10rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
				border: 1rpx solid #F4F5F6;
				height: 300rpx;
			}
		}
		.btnBox{
			margin: 30rpx 0;
			display: flex;
			.btn{
				text-align: center;
				background-color: #316DF6;
				color: #fff;
				line-height: 80rpx;
				border-radius: 10rpx;
				margin-left: 20rpx;
				flex: 1;
				&:nth-child(1){
					margin-left: 0;
				}
			}
		}
		.list{
			.iptBox{
				position: relative;
				.btnComment{
					z-index: 9;
					position: absolute;
					right: 10rpx;
					bottom: 10rpx;
					border-radius: 10rpx;
					width: 120rpx;
					height: 60rpx;
					display: flex;
					font-size: 28rpx;
					align-items: center;
					justify-content: center;
					background-color: #316DF6;
					color: #fff;
					&.ed{
						background-color: #909193;
					}
				}
			}
			.ipt{
				position: relative;
				display: block;
				width: 100%;
				padding: 10rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
				border: 1rpx solid #F4F5F6;
				height: 300rpx;
				margin-top: 20rpx;
			}
			.link{
				color: #316DF6;
			}
		}
	}
</style>
