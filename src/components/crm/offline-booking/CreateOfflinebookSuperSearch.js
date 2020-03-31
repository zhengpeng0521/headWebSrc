/**
 * Created by zhaosi on 2017/6/29.
 */
import React from 'react';
import { Popover } from 'antd';
import SuperSearch from '../../common/new-component/super-search/SuperSearch';

function CreateOfflinebookSuperSearch({
    CreateOfflinebookSuperSearchVisible,         //高级搜索是否显示
    wetherClearSearchContent,                         //是否切换路由，用于清空快捷搜索与高级搜索栏内容
    CreateOfflinebookSuperSearchClick,           //高级搜索点击搜索或者重置
    CreateOfflinebookSuperSearchOnSearch,                   //点击右上角的X
    onClearSuperSearchClick,                       //清除高级搜索
    wetherChear,

    // searchVisible  : searchVisible,
    // closeSearch    : showSuperSearch,
    // onSearch       : onSuperSearch,
    // onClear        : onSuperClear,
}){


    let fields = [
        { key : 'sellerName', label : '跟进人', type : 'input' , placeholder : '请输入跟进人名字' },
        // { key : 'orgId' , type : 'orgSelect' , placeholder : '所属校区' },

        { key : 'auditionTime', label : '时间', type : 'rangePicker' , startPlaceholder : '试听开始时间' , endPlaceholder : '试听结束时间' },

    ];

    return(
        <SuperSearch
            searchVisible = {  CreateOfflinebookSuperSearchVisible }
            onSearch = { (data) => CreateOfflinebookSuperSearchClick(data,'inner') }
            onClear = { (data) => onClearSuperSearchClick(data,'inner') }
            closeSearch = { CreateOfflinebookSuperSearchOnSearch }
            wetherChear = { wetherChear }
            fields = { fields }
        />
    );
}

export default CreateOfflinebookSuperSearch;
