import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, message, DatePicker } from 'antd';
import WxActivitySuccessTable from '../../common/manager-list/ManagerListMgr';
import style from './WxActivitySuccessApplyModal.less';

function WxActivityCreateForm({

    attrSuccessModalVisible,
    attrSuccessDataSource,
    attrSuccessResultCount,
    attrSuccessPageIndex,
    attrSuccessPageSize,
    attrSuccessLoading,
    attrSuccessSearchVisible,
    funcSuccessFilterFunction,
    funcSuccessSearchFunction,
    funcSuccessClearFunction,
    funcExportSuccess,
    funcSuccessPageSizeChange,
    funcSuccessPageIndexChange,
    funcCloseSuccessApplyModal,
    funcCancelApply,
    funcToBeNumberOne,
    funcAddRemark,                  

}){

    //家长关系
    function SetRelation({relation}){
        switch(relation){
            case "father":
                return <span>爸爸</span>;
            case "mother":
                return <span>妈妈</span>;
            case "grandfather":
                return <span>爷爷</span>;
            case "grandmother":
                return <span>奶奶</span>;
            case "motherfather":
                return <span>外公</span>;
            case "mothermother":
                return <span>外婆</span>;
            default :
                return <span></span>;
        }
    }

    let WxActivitySuccessTableProps = {
        search : {
            searchAble    : true,
            showSearch    : attrSuccessSearchVisible,
            filterBtnText : '筛选',
            onFilterClick : funcSuccessFilterFunction,
            onSearch      : funcSuccessSearchFunction,
            onClear       : funcSuccessClearFunction,
            fields : [
                        {
                            key         : 'orgId',
                            type        : 'orgSelect',
                            placeholder : '所属校区',
                            options : {
                                width : 300,
                            },
                        },{
                            key         : 'status',
                            type        : 'select',
                            placeholder : '报名状态',
                            options     : [
                                { 'key' : '2', 'label' : '报名成功' },
                                { 'key' : '1', 'label' : '等位中' },
                                { 'key' : '0', 'label' : '已取消' }
                            ],
                        },
            ]
        },
        rightBars : {
            btns : [
                {
                    type     : 'btn',
                    label    : '导出',
                    handle   : funcExportSuccess,
                }
            ]
        },
        table : {
            loading    : attrSuccessLoading,
            dataSource : attrSuccessDataSource,
            columns : [
                {
                    dataIndex : 'name',
                    key       : 'name',
                    title     : '宝宝姓名',
                    width     : 80,
                },{
					dataIndex : 'vip',
					key       : 'vip',
					title     : '是否会员',
					width     : 80,
					render    : ( text, record ) => (
						<span>
							{ !!text && text == 'false' ? '否' : text == 'true' ? '是' : text == '/' ? '/' : null }
						</span>
					)
				},{
                    dataIndex: 'relation',
                    key: 'relation',
                    title: '家长关系',
                    width: 100,
                    render: (text, record) => (
                        <p><SetRelation relation={record.relation}/></p>
                    )
                },{
                    dataIndex: 'birthday',
                    key: 'birthday',
                    title: '宝宝生日',
                    width: 100,
                    render: (text, record) => (
                        <p>{record.birthday}</p>
                    )
                },{
                    dataIndex: 'sex',
                    key: 'sex',
                    title: '宝宝性别',
                    width: 100,
                    render: (text, record) => (
                        <p>{record.sex == "1" ? "男" : "女"}</p>
                    )
                },{
                    dataIndex : 'orgName',
                    key       : 'orgName',
                    title     : '报名校区',
                    width     : 150,
                },{
                    dataIndex : 'mobile',
                    key       : 'mobile',
                    title     : '联系方式',
                    width     : 120,
                },{
                    dataIndex : 'createTime',
                    key       : 'createTime',
                    title     : '报名时间',
                    width     : 190,
                },{
                    dataIndex : 'remark',
                    key       : 'remark',
                    title     : '备注',
                    width     : 200,
                    render    : ( text, record ) => (
                        <a onClick = { () => funcAddRemark( record.id, record.remark ) }>
                           { text || '暂无' }
                        </a>
                    )
                },{
                    dataIndex: 'payAmount',
                    key: 'payAmount',
                    title: '支付金额',
                    width: 100,
                    render: (text, record) => (
                        <p>{record.payAmount}元</p>
                    )
                },{
                    dataIndex: 'payStatus',
                    key: 'remark3',
                    title: '支付状态',
                    width: 100, 
                    render: (text, record) => (
                        <p>{record.payStatus == '0' ? '未支付' : record.payStatus == '1' ? '已支付' : record.payStatus == '2' ? '已退款' : record.payStatus == '3' ? '已关闭' : ''}</p>
                    )
                }, {
                    dataIndex : 'status',
                    key       : 'status',
                    title     : '报名状态',
                    width     : 200,
                    render    : ( text, record ) => (
                        <div>
                            <span>
                                {text && text == '2' ? '报名成功' : text == '1' ? '等位中' : text == '0' ? '已取消' : text == '3' ? '未支付' : text == '4' ? '支付超时' : null  }
                            </span>
                            <div style = {{ color : '#c80d0d' }} >
                                {  record && record.reason && ( '取消原因 : ' + record.reason ) || '' }
                            </div>
                        </div>
                    )
                },{
                    dataIndex : 'operation',
                    key       : 'operation',
                    title     : '操作',
                    width     : 130,
                    render    : ( text, record ) => (
                        <div>
                            {
                                record && ( record.status == '1' || record.status == '2' ) &&
                                <Popconfirm title="确认要取消报名么?" placement="top" okText="确认" cancelText="取消" onConfirm={() => funcCancelApply( record.id ) } >
                                    <a>取消报名</a>
                                </Popconfirm>

                            }
                            {
                                record && record.status == '1' &&
                                <Popconfirm title = "确认要优先等位么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { () => funcToBeNumberOne( record.id ) } >
                                    <a style = {{ marginLeft : '10px' }} >优先等位</a>
							    </Popconfirm>
                            }
                        </div>
                    )
                }
            ],
            emptyText : '暂时没有数据',
            rowSelection : null,
            pagination : {
                total            : attrSuccessResultCount,
                pageIndex        : attrSuccessPageIndex,
                pageSize         : attrSuccessPageSize,
                showTotal        : '',
                showSizeChanger  : true,
                showQuickJumper  : true,
                onShowSizeChange : funcSuccessPageSizeChange,
                onChange         : funcSuccessPageIndexChange,

            }
         }
    };

	return(
       <Modal
            className = "yhwu_wx_activity_success_model"
            visible   = {attrSuccessModalVisible }
            title     = '活动信息'
            maskClosable = { false }
            width     = '1000px'
            onCancel  = { funcCloseSuccessApplyModal }
            footer    = { null }
        >
            <WxActivitySuccessTable { ...WxActivitySuccessTableProps } />
        </Modal>
	)
};

export default WxActivityCreateForm;
