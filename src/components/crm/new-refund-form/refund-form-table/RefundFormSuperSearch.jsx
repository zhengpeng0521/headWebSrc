import React from 'react';
import { Popover } from 'antd';
import SuperSearch from '../../../common/new-component/super-search/SuperSearch';

/*高级搜索*/
function RefundFormSuperSearch({
    wetherChangeRouter,                             //是否切换路由，用于清空快捷搜索与高级搜索栏内容
    refundRightSuperSearchVisible,                  //高级搜索是否显示
    RefundRightSuperSearchClick,                    //高级搜索点击搜索或者重置
    RefundSuperSearchOnSearch,                      //点击右上角的X
}){

    //审核退款不需要退款单状态查询
    let fields = [
            { label : '合同编号' , key : 'orderNum' , type : 'input' , placeholder : '合同编号' },
            {/* label : '会员卡号' , key : 'cardId' , type : 'input' , placeholder : '会员卡号' */},
            { label : '退款类型' , key : 'refundType' , type : 'select' , placeholder : '退款类型', options: [
                { key : '2', label : '退课时' },
				{ key : '3', label : '退时长' }
            ] },
        ];


    return(
        <SuperSearch
            searchVisible = { refundRightSuperSearchVisible }
            onSearch = { (data) => RefundRightSuperSearchClick(data) }
            onClear = { (data) => RefundRightSuperSearchClick(data) }
            closeSearch = { RefundSuperSearchOnSearch }
            wetherChear = { wetherChangeRouter }
            fields = { fields }
            />
    );
}

export default RefundFormSuperSearch;
