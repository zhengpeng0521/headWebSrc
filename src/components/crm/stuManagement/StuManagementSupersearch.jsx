import React from 'react';
import { Popover } from 'antd';
import SuperSearch from '../../common/new-component/super-search/SuperSearch';

function StuManagementSupersearch({
	superSearchVisible,                     //高级搜索是否显示
    superSearchContent,                     //高级搜索栏搜索内容
    SuperSearchClick,                       //高级搜索点击搜索或者重置
    SuperSearchOnSearch,                    //点击右上角的X

}){

    let fields = [
        {
			key         : 'month',
		 	type        : 'input',
			label       : '月龄',
			placeholder : '请填写月龄'
		},{
			key              : 'birthday',
			type             : 'rangePicker',
			label            : '生日',
			startPlaceholder : '开始日期' ,
			endPlaceholder   : '结束日期'
		},{
			key         : 'sex',
			type        : 'select',
			label       : '性别',
			placeholder : '请选择性别',
			options : [
				{ key : '1' , label : '男' },
				{ key : '2' , label : '女' }
			]
		}
    ];

    return(
        <SuperSearch
            searchVisible = { superSearchVisible }
            onSearch = { (data) => SuperSearchClick(data) }
            onClear = { (data) => SuperSearchClick(data) }
            closeSearch = { SuperSearchOnSearch }
            fields = { fields }
        />
    );
}

export default StuManagementSupersearch;
