// 0 黑色背景 1砖 2路线 3 箱子 4 箱子要前往的终点 5 人
const map = [
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 2, 4, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 3, 4, 1, 0, 0, 0],
        [0, 0, 1, 2, 2, 3, 2, 2, 2, 1, 0, 0],
        [0, 0, 1, 2, 2, 1, 3, 3, 2, 1, 0, 0],
        [0, 0, 1, 5, 2, 2, 2, 2, 2, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
		[0, 0, 1, 5, 2, 2, 1, 0, 0, 0, 0, 0],
		[0, 0, 1, 2, 3, 3, 1, 0, 1, 1, 1, 0],
		[0, 0, 1, 2, 3, 2, 1, 0, 1, 4, 1, 0],
		[0, 0, 1, 1, 1, 2, 1, 1, 1, 4, 1, 0],
		[0, 0, 0, 1, 1, 2, 2, 2, 2, 4, 1, 0],
		[0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0],
		[0, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1, 0],
		[0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
	],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 1, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 4, 5, 3, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 1, 1, 2, 3, 4, 1, 0, 0, 0],
		[0, 0, 1, 4, 1, 1, 3, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 1, 2, 4, 2, 1, 1, 0, 0],
		[0, 0, 1, 3, 2, 3, 3, 3, 4, 1, 0, 0],
		[0, 0, 1, 2, 2, 2, 4, 2, 2, 1, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	]
]

export default map