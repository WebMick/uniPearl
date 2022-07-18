<template>
	<view class="home">
		<Introduce></Introduce>
		<FunctionList></FunctionList>
	</view>
</template>

<script>
	import Introduce from './components/Introduce.vue';
	import FunctionList from './components/FunctionList.vue';
	export default {
		components: {
			Introduce,
			FunctionList
		},
		data() {
			return {
			};
		}
	}
</script>

<style lang="scss" scoped>
	@import './home.scss';
</style>
