import React from 'react';
import { Popover , Icon , message , Modal , Button } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent';
import ManagerList from '../../../common/new-component/manager-list/ManagerList';
import qs from 'qs';

/*全部leads，我的leads，公海池，回收站*/
function LeadsFollowTable({
    search,
    table,
    pagination,
    leftBars,
    rightBars,
}){

    let columns = [{
        title : '名单姓名',
        key : 'name',
        dataIndex : 'name',
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
                { text }
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
        title : '跟进状态',
        key : 'studentFollowState',
        dataIndex : 'studentFollowState',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title : '重要程度',
        key : 'importance',
        dataIndex : 'importance',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
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
        width : 112,
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
        width : 66,
        render : (text,record) => (
            <div>
                { text == '1' ? <Icon type="boy" style={{color:'#5d9cec'}}/> :
                  text == '2' ? <Icon type="girl" style={{color:'#ff7f75'}}/> : '' }
            </div>
        )
    }, {
        title : '生日',
        key : 'bir',
        dataIndex : 'birthday',
        width : 140,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '月龄',
        key : 'month',
        dataIndex : 'month',
        width : 66,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '年龄',
        key : 'age',
        dataIndex : 'age',
        width : 66,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '最后跟进时间',
        key : 'followRecordTime',
        dataIndex : 'followRecordTime',
        width : 140,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '下次跟进时间',
        key : 'nextFollowTime',
        dataIndex : 'nextFollowTime',
        width : 140,
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
    }, {
        title : '负责销售',
        key : 'sellerName',
        dataIndex : 'sellerName',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '收集者',
        key : 'collecterName',
        dataIndex : 'collecterName',
        width : 82,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '推荐人',
        key : 'recommenderName',
        dataIndex : 'recommenderName',
        width : 82,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '所属校区',
        key : 'orgName',
        dataIndex : 'orgName',
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }];

    table.columns = columns;
    table.xScroll = 1950;

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
