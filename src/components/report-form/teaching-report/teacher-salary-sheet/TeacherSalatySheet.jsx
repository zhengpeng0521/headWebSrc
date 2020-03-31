import React from 'react';
import Media from 'react-media';
import { Popover , Icon } from 'antd';
import ManagerList from '../../../common/new-component/manager-list/ManagerList';

/*销售工作表*/
function TeacherSalatySheet({
    sTable,                 //小屏下table
    lTable,                 //大屏下table
    pagination,
}){
    let columns = [{
        title : '姓名',
        key : 'uname',
        dataIndex : 'uname',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '授课总节数',
        key : 'teachTime',
        dataIndex : 'teachTime',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '授课总人次',
        key : 'teachNum',
        dataIndex : 'teachNum',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '消课总金额',
        key : 'costMoney',
        dataIndex : 'costMoney',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '基本工资',
        key : 'baseSalary',
        dataIndex : 'baseSalary',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '补贴',
        key : 'subsidy',
        dataIndex : 'subsidy',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '提成',
        key : 'royalty',
        dataIndex : 'royalty',
        width : 150,
        render : (text,record) => {
            if(!!record.courseList && record.courseList.length > 0){
                let prefix = `${text}元 = `;
                let content = [];
                record.courseList.map((item,index) => {
                    content.push(`${item.courseName}${item.time}${item.desc}*${item.money}`);
                })
                return(
                    <Popover placement="top" content={ prefix + content.join(' + ') } trigger="hover">
                        <a>{ text }</a>
                    </Popover>
                )
            }else{
                return(
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            }
        }
    }, {
        title : '工资金额',
        key : 'salary',
        dataIndex : 'salary',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }];


    sTable.columns = columns;

    lTable.columns = columns;

    return(
        <Media query="(max-width: 1350px)">
            { matches => matches ?
                (<ManagerList
                    table = { sTable }
                    pagination = { pagination }
                    />)
                :
                (<ManagerList
                    table = { lTable }
                    pagination = { pagination }
                    />)
            }
        </Media>
    );
}

export default TeacherSalatySheet;
