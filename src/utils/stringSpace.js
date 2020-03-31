/*
 * 字符串空格处理
 * @params
 * str string需要检验的字符串
 * type string/number 1-所有空格  2-前后空格  3-前空格 4-后空格
 * @return
 * string 筛选过后的字符串
 */
export function specialTrim(str,type) {
    if(!!!str || typeof(str) != 'string'){
        return console.error('请输入有效字符串');
    }
	switch (type) {
        case 1:
            return str.replace(/\s+/g, "");
        case 2:
            return str.replace(/(^\s*)|(\s*$)/g, "");
        case 3:
            return str.replace(/(^\s*)/g, "");
        case 4:
            return str.replace(/(\s*$)/g, "");
        default:
            return str;
    }
}
