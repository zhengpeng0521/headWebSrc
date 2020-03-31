import React from 'react';
import { Popover , Icon , message , Modal , Button } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent';
import { specialTrim } from '../../../../utils/stringSpace';
import ManagerList from '../../../common/new-component/manager-list/ManagerList';
import qs from 'qs';

/*全部leads，我的leads，公海池，回收站*/
function LeadsFollowTable({
    leadsFollowType,                        //全部leads(all),我的leads(my),公海池(public),回收站(recycle)
    leadsFollowFastSearchFollowState,       //快捷搜索栏跟进状态下拉列表内容
    TableClickOpenDetail,                   //table点击姓名打开详情
    studentCallEvent,                       //拨打电话
    search,
    table,
    pagination,
    leftBars,
    rightBars,
    routerName,
}){
    let columns =  [{
        title : '名单姓名',
        key : 'name',
        dataIndex : 'name',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { leadsFollowType != 'recycle' ?
                    <span style={{color:'#5d9cec',cursor:'pointer'}} onClick={() => TableClickOpenDetail(record)}>{ text }</span> : <span>{ text }</span>
                }
            </Popover>
        )
    },{
        title : '家长姓名',
        key : 'parentName',
        dataIndex : 'parentName',
        width : 140,
        render : (text,record) => {
            return (
                <Popover placement = "top" content = {
                    <span>
                        { !!record.list && (record.list).map( (item, index) => {
                            return <span key = { 'parents_' + index } style = {{ marginRight : (record.list).length > 1 && index != (record.list).length - 1 ? 10 : 0 }}>{ item.parentName }</span>
                        }) }
                    </span> } trigger = 'hover' >
                    <span style = {{ marginRight : (record.list) && (record.list).length > 1 ? 10 : 0 }}>
                        { !!(record.list) && !!(record.list)[0] && (record.list)[0].parentName }
                    </span>
                    { record.list && (record.list).length > 1 &&
                        <a>{ '共' + (record.list).length + '人' }</a>
                    }
                </Popover>
            )
        }
    }, {
        title : '家长手机号',
        key : 'parentMobile',
        dataIndex : 'parentMobile',
        width : 96,
        render : (text,record) => {
            return(
                <Popover
                    trigger="hover"
                    placement="top"
                    content={
                        <div>
                            { !!record.list && record.list.map( (item, index) => {
                            return(
                                <div key = { 'mobile' + index }>
                                    <span style = {{ marginRight : record.list.length > 1 && index != record.list.length - 1 ? 10 : 0 }}>{ (item.parentName || '--') + ' : ' + (item.parentMobile || '--') }</span>

                                </div>)
                            }) }

                        </div>
                    }>
                        <a>查看</a>
                </Popover>
            )
        }
    }, {
        title : '性别',
        key : 'sex',
        dataIndex : 'sex',
        width : 96,
        render : (text,record) => (
            <div>
                { text == '男' ? <Icon type="boy" style={{color:'#5d9cec'}}/> :
                  text == '女' ? <Icon type="girl" style={{color:'#ff7f75'}}/> : '' }
            </div>
        )
    },{
        title : '生日',
        key : 'bir',
        dataIndex : 'birthday',
        width : 140,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },  {
        title : '月龄',
        key : 'month',
        dataIndex : 'month',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '年龄',
        key : 'age',
        dataIndex : 'age',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '一级来源',
        key : 'channel',
        dataIndex : 'channel',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text || '校区回收' }
            </Popover>
        )
    }, {
        title : '二级来源',
        key : 'secondChannel',
        dataIndex : 'secondChannel',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '创建时间',
        key : 'createTime',
        dataIndex : 'createTime',
        width : 140,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }];

    table.columns = columns;
    table.xScroll = 1350;

    return(
        <ManagerList
            search = { search }
            table = { table }
            pagination = { pagination }
            leftBars = { leftBars }
            rightBars = { rightBars }
            />
    );
}

export default LeadsFollowTable;
