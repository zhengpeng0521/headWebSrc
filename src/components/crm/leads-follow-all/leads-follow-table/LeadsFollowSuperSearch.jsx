import React from 'react';
import { Popover } from 'antd';
import moment from 'moment';
import SuperSearch from '../../../common/new-component/super-search/SuperSearch';

/*高级搜索*/
function LeadsFollowSuperSearch({
    superSearchVisible,                     //高级搜索是否显示
    superSearchContent,                     //高级搜索栏搜索内容
    SuperSearchClick,                       //高级搜索点击搜索或者重置
    SuperSearchOnSearch,                    //点击右上角的X
}){
    //处理下次跟进时间(因为CRM首页点击时需要回填)
    let startNextFollowTime = superSearchContent.startNextFollowTime;
    let endNextFollowTime = superSearchContent.endNextFollowTime

    //处理创建时间(因为CRM首页点击时需要回填)
    let startCreateTime = superSearchContent.startCreateTime;
    let endCreateTime = superSearchContent.endCreateTime;

    let fields = [
        { label : '家长姓名' ,key : 'parentName' , type : 'input' , placeholder : '家长姓名' },
        { label : '性别' ,key : 'sex' , type : 'select' , placeholder : '性别' , options : [{ key : '1' , label : '男' },{ key : '2' , label : '女' }]},
        { label : '月龄' ,key : 'month' , type : 'input' , placeholder : '月龄' },
        { label : '生日' ,key : 'birthday' , type : 'rangePicker' , startPlaceholder : '开始日期' , endPlaceholder : '结束日期' },
        { label : '创建日期' ,key : 'createTime' , type : 'rangePicker' , startPlaceholder : '开始日期' , endPlaceholder : '结束日期' , initialValue : [ startCreateTime != undefined ? moment(startCreateTime,'YYYY-MM-DD HH:mm') : undefined, endCreateTime != undefined ? moment(endCreateTime,'YYYY-MM-DD HH:mm') : undefined ]},
        { label : '下次跟进时间' ,key : 'nextFollowTime' , type : 'rangePicker' , startPlaceholder : '开始时间' , endPlaceholder : '结束时间' , initialValue : [ startNextFollowTime != undefined ? moment(startNextFollowTime,'YYYY-MM-DD HH:mm') : undefined, endNextFollowTime != undefined ? moment(endNextFollowTime,'YYYY-MM-DD HH:mm') : undefined ]},
        { label : '最后跟进时间' ,key : 'finalFollowTime' , type : 'rangePicker' , startPlaceholder : '开始时间' , endPlaceholder : '结束时间' },
        { label : '负责销售' , key : 'uidName' , type : 'input' , placeholder : '负责销售' },
        { label : '收集者' ,key : 'collecterName' , type : 'input' , placeholder : '收集者' },
        { label : '推荐人' ,key : 'recommenderName' , type : 'input' , placeholder : '推荐人' }
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

export default LeadsFollowSuperSearch;
