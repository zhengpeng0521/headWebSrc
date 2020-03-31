import React from 'react';
import { Modal, Button, Rate } from 'antd';
import moment from 'moment';
import ClassPackageComponent from '../../common/new-component/manager-list/ManagerList';
import { StatusFlag } from '../../common/new-component/NewComponent';
import styles from './OfflinebookingComponent.less';
import { Popover, Icon } from 'antd';

function OfflinebookingComponent ({
    table : {
        isChecked,
        isPickOn,
        loading,
        pageIndex,
        pageSize,
        dataSource,
        resultCount,

        pageSizeChange,
        pageIndexChange,
        TableNewColumns,        //table设置
        TableChangeColumns
    },
	search : {
		searchFunction,
		clearFunction,
	},
	handleleadsrecord,           //点击切换到名单试听
	handlesturecord,             //点击切换到学员试听
	superSearchVisible,          //高级搜索是否显示
	superSearch,                 //点击显示高级搜索

}) {
    var selctarr =  [
        { 'key' : '0', 'label' : '取消' },
        { 'key' : '1', 'label' : '已预约' },
        { 'key' : '2', 'label' : '已试听' },
        { 'key' : '3', 'label' : '旷课' }
    ];
    let stumagegeComponentProps = {
        search : {
            onSearch  : searchFunction,
            onClear   : clearFunction,
            fields : [
				{ key : 'dept_org', type : 'dept_org' },
                { key : 'stuName', type : 'input', placeholder : '学员姓名' },
				{ key : 'status', type : 'select', placeholder : '状态', options : selctarr }
            ]
        },
        rightBars : {
            // btns : [
            //     {
            //         label     : '名单试听',
            //         handle    : handleleadsrecord,
            //         type      : 'leadsrecord',
            //         isChecked : isChecked
            //     },{
            //         label     : '学员试听',
            //         handle    : handlesturecord,
            //         type      : 'sturecord' ,
            //         isPickOn  : isPickOn
            //     }
            // ],
            isSuperSearch      : true,
            superSearch        : superSearch,
            superSearchVisible : superSearchVisible,
        },

        table: {
            loading,
            dataSource    : dataSource,
            newColumns    : TableNewColumns,
            changeColumns : TableChangeColumns,
            columns : [
                {
                    key       : 'stuName',
                    title     : '学员姓名',
                    dataIndex : 'stuName',
                    width     : 140,
                    render : ( text, record ) => (
                        <Popover placement = "top" content = { text } trigger = "hover">
                            { text }
                        </Popover>
                    )
                },{
                    key       : 'sourceType',
                    title     : '学员类型',
                    dataIndex : 'sourceType',
                    width     : 82,
                    render : ( text, record ) => (
                     <span> { text == 0 ? '潜在学员' : text == 1 ? '在读学员' : text == 2 ? '往期学员'  : '' }</span>
                    )
                },
                {
                    dataIndex : 'sellerName',
                    key       : 'sellerName',
                    title     : '跟进人',
                    width     : 96,
                    render : ( text, record ) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key       : 'status',
                    title     : '状态',
                    dataIndex : 'status',
                    width     : 82,
                    render : ( text, record ) => (
                        <StatusFlag type = { (text == '0' || text == '4') ? 'gray' :  'blue' }>{ text == '0' ? '取消' : text == '1' ? '已预约' : text == '2' ? '已试听' : text == 3 ? '旷课' :'' }</StatusFlag>
                    )
                },{
                    key       : 'courseName',
                    title     : '试听课程',
                    dataIndex : 'courseName',
                    width     : 96,
                    render : ( text, record ) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key       : 'auditionTime',
                    title     : '预约时间',
                    dataIndex : 'auditionTime',
                    width     : 200,
                    render    : ( text, record ) => (
                        <Popover placement = 'top' content = { text } trigger = 'hover' >
                            { ( !record.auditionTime ? "" : record.auditionTime) + '-' + (!(record.auditionEndTime +'') || (record.auditionEndTime == undefined  || record.auditionEndTime == null ? '' : (record.auditionEndTime+ '').substring(11) )) }
                        </Popover>
                    )
                },{
                    key       : 'remark',
                    title     : '备注',
                    dataIndex : 'remark',
                    width     : 96,
                    render : ( text, record ) => (
                        <Popover placement = 'top' content={text} trigger = 'hover' >
                            { text }
                        </Popover>
                    )
                },{
                    key       : 'createTime',
                    title     : '创建时间',
                    dataIndex : 'createTime',
                    width     : 160,
                    render : ( text, record ) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key       : 'orgName',
                    title     : '所属校区',
                    dataIndex : 'orgName',
                    render : ( text, record ) => (
                        <Popover placement = "top" content = { text } trigger = "hover">
                            { text }
                        </Popover>
                    )
                }
            ],
        },
        pagination : {
            total            : resultCount,
            pageIndex        : pageIndex,
            pageSize         : pageSize,
            showTotal        : total => `总共 ${ total } 条`,
            showSizeChanger  : true,
            showQuickJumper  : true,
            onShowSizeChange : pageSizeChange,
            onChange         : pageIndexChange,
        }
    };

    return (
        <div style = {{ height : '100%' , overflow : 'hidden' }} >
            <ClassPackageComponent { ...stumagegeComponentProps } />
        </div>
    );
}

export default OfflinebookingComponent;
