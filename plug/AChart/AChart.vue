<template>
	<view class="page">
		<view class="item">
			<view class="title">AChart</view>
			<view class="subTitle">软件简介</view>
			<view class="text">H5, 微信小程序, K 线图，走势图，缩放，拖拽，十字光标，饼图，柱状图等</view>
		</view>
		<view class="item">
			<view class="subTitle">K线图</view>
			<view class="ul">
				<view class="li text">支持日线，月线，周线，年线</view>
				<view class="li text">K 线形状支持 空心 K 线，实心 K 线</view>
				<view class="li text">支持常用指标指标，均线</view>
				<view class="li text">数据鼠标左右拖拽移动，移动十字光标移动</view>
				<view class="li text">支持弹幕</view>
				<view class="li text">支持自定义颜色</view>
			</view>
			<view class="imgBox">
				<Kline></Kline>
			</view>
		</view>
		<view class="item">
			<view class="subTitle">分时走势图</view>
			<view class="ul">
				<view class="li text">分钟数据显示</view>
				<view class="li text">支持多日分钟数据显示</view>
				<view class="li text">支持 A 股集合竞价显示 / 隐藏</view>
				<view class="li text">支持自定义颜色</view>
			</view>
			<view class="imgBox">
				<Minute :chartData="minuteData" :yestClose="48.00"></Minute>
			</view>
		</view>
		<view class="item">
			<view class="subTitle">饼图</view>
			<view class="ul">
				<view class="li text">圆形数据显示</view>
				<view class="li text">支持自定义颜色</view>
			</view>
			<view class="imgBox">
				<Pie 
					:height="[300]" 
					:chartData="[{income_ratio: 20},{income_ratio: 40},{income_ratio: 10},{income_ratio:30}]">
				</Pie>
			</view>
		</view>
	</view>
</template>

<script>
	import Kline from './components/AChart/Kline.vue';
	import Minute from './components/AChart/Minute.vue';
	import Pie from './components/AChart/Pie.vue';
	import { minuteData } from './components/AChart/data.js'
	export default {
		components: {
			Kline,
			Minute,
			Pie
		},
		data() {
			return {
				minuteData: []
			};
		},
		onShow() {
			this.minuteData = minuteData;
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/styles/style.scss";
</style>
