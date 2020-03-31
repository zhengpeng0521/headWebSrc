import React from 'react';
import { Popover } from 'antd';
import moment from 'moment';
import SuperSearch from '../../../common/new-component/super-search/SuperSearch';

/*高级搜索*/
function LeadsFollowSuperSearch({
    leadsFollowSecondChannel,                   //二级来源
    leadsFollowType,                            //全部leads(all),我的leads(my),公海池(public),回收站(recycle)
    leadsFollowRightSuperSearchVisible,         //高级搜索是否显示
    leadsFollowRightSuperSearchContent,         //高级搜索栏搜索内容
    wetherChangeRouter,                         //是否切换路由，用于清空快捷搜索与高级搜索栏内容
    LeadsFollowRightSuperSearchClick,           //高级搜索点击搜索或者重置
    LeadsSuperSearchOnSearch,                   //点击右上角的X
    routerName,
}){

    let fields = [
        { label : '家长姓名',key : 'parentName' ,type : 'input' , placeholder : '家长姓名' },
        { label : '性别' ,key : 'sex' , type : 'select' , placeholder : '性别' , options : [{ key : '1' , label : '男' },{ key : '2' , label : '女' }]},
        { label : '联系地址' , key : 'conaddress' , type : 'input' , placeholder : '联系地址' },
        { label : '生日' ,key : 'birthday' , type : 'rangePicker' , startPlaceholder : '开始日期' , endPlaceholder : '结束日期' },

    ];

    {/*全部名单高级搜索在收集者前边增加负责销售选项*/}
    if(leadsFollowType == 'all'){
        let obj = { label : '负责销售' , key : 'uidName' , type : 'input' , placeholder : '负责销售' }
        for(let i in fields){
            if(fields[i].key == 'collecterName'){
                fields.splice(i,0,obj);
                break;
            }
        }
    }

    return(
        <SuperSearch
            searchVisible = { leadsFollowRightSuperSearchVisible }
            onSearch = { (data) => LeadsFollowRightSuperSearchClick(data) }
            onClear = { (data) => LeadsFollowRightSuperSearchClick(data) }
            closeSearch = { LeadsSuperSearchOnSearch }
            wetherChear = { wetherChangeRouter }
            fields = { fields }
            />
    );
}

export default LeadsFollowSuperSearch;
