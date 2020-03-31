import React from 'react';
import styles from './StuManagement.less';
import { Modal , Button , Rate , Icon , Popover } from 'antd';
import moment from 'moment';
import ManagerList from '../../common/new-component/manager-list/ManagerList';

function StuManagement ({
    search,
    table,
    pagination,
    leftBars,
    rightBars,
}){
    let columns = [
         {
            key       : 'name',
            dataIndex : 'name',
            title     : '学员姓名',
            width     : 96,
            render    : ( text, record ) => (
                <Popover placement = 'top' content = { text } trigger = 'hover' >
                    { text }
                </Popover>
            ),
        },{
            key       : 'nickName',
            dataIndex : 'nickName',
            title     : '昵称',
            width     : 96,
            render    : ( text, record ) => (
                <Popover placement = 'top' content = { text } trigger = 'hover' >
                    { text }
                </Popover>
            )
        },{
            key       : 'stuCardId',
            dataIndex : 'stuCardId',
            width     : 160,
            title     : '会员卡号',
            render    : ( text, record ) => (
                <Popover placement = 'top' content = { text } trigger = 'hover' >
                    { text }
                </Popover>
            )
        },{
            dataIndex : 'sex',
            key       : 'sex',
            title     : '性别',
            width     : 68,
            render    : (text,record) => (
                <div>
                    { text == 1 ? <Icon type="boy" style={{color:'#5d9cec'}}/> :
                        text == 2 ? <Icon type="girl" style={{color:'#ff7f75'}}/> : '' }
                </div>
            )
        },{
            key       : 'birthday',
            dataIndex : 'birthday',
            title     : '生日',
            width     : 140,
            render    : ( text, record ) => (
                <Popover placement = 'top' content = { text } trigger = 'hover' >
                    { text }
                </Popover>
            )
        },{
            key       : 'month',
            dataIndex : 'month',
            title     : '月龄',
            width     : 68,
            render    : ( text, record ) => (
                <Popover placement = 'top' content = { text } trigger = 'hover' >
                    { text }
                </Popover>
            )
        },{
            key       : 'age',
            dataIndex : 'age',
            title     : '年龄',
            width     : 68,
            render    : ( text, record ) => (
                <Popover placement = 'top' content = { text } trigger = 'hover' >
                    { text }
                </Popover>
            )
        },{
            key       : 'parents',
            dataIndex : 'parents',
            title     : '家长',
            width     : 160,
            render    : ( text, record ) => (
                <Popover placement = "top" content = {
                    <span>
                        { !!text && text.map( (item, index) => {
                            return <span key = { 'parents_' + index } style = {{ marginRight : text.length > 1 && index != text.length - 1 ? 10 : 0 }}>{ item.name }</span>
                        }) }
                    </span> } trigger = 'hover' >
                    <span style = {{ marginRight : text && text.length > 1 ? 10 : 0 }}>
                        { !!text && !!text[0] && text[0].name }
                    </span>
                    { text && text.length > 1 &&
                        <a>{ '共' + text.length + '人' }</a>
                    }
                </Popover>
            )
        },{
            key       : 'mobile',
            dataIndex : 'mobile',
            title     : '家长手机号',
            width     : 112,
            render    : ( text, record ) => (
                <Popover placement = "top" content = {
                    <div>
                        { !!record.parents && record.parents.map( (item, index) => {
                            return <div key = { 'mobile' + index } style = {{ marginRight : record.parents.length > 1 && index != record.parents.length - 1 ? 10 : 0 }}>{ (item.name || '--') + ' : ' + (item.mobile || '--') }</div>
                        }) }
                    </div> } trigger = 'click' >
                    <a>查看</a>
                </Popover>
            )
        },{
            key       : 'sellerName',
            dataIndex : 'sellerName',
            title     : '负责销售',
            width     : 96,
            render    : ( text, record ) => (
                <Popover placement = 'top' content = { text } trigger = 'hover' >
                    { text }
                </Popover>
            )
        },{
            key       : 'counselorName',
            dataIndex : 'counselorName',
            title     : '负责老师',
            width     : 96,
            render    : ( text, record ) => (
                <Popover placement = 'top' content = { text } trigger = 'hover' >
                    { text }
                </Popover>
            )
        },{
            key       : 'orgName',
            title     : '所属校区',
            dataIndex : 'orgName',
            render    : ( text, record ) => (
                <Popover placement = 'top' content = { text } trigger = 'hover' >
                    { text }
                </Popover>
            )
        }]

    table.columns = columns;
    table.xScroll = 1400;

    return (
        <ManagerList
            search = { search }
            table = { table }
            pagination = { pagination }
            leftBars = { leftBars }
            rightBars = { rightBars }
            />
    );
}

export default StuManagement;
