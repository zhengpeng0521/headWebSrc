
let timer = null

/** 防抖动 */
export function debounce(fn, wait=2000) {
	// 将 debounce 处理结果当作函数返回
	// 触发事件回调时执行这个返回函数
	return function(e) {
		// 如果已经设定过定时器就清空上一次的定时器
		if (timer) clearTimeout(timer)
		//保留对事件的引用
		e.persist && e.persist()

		// 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
		timer = setTimeout(() => {
			fn(e)
		}, wait)
	}
}
