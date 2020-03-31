import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, message, DatePicker } from 'antd';
import WxActivitySuccessTable from '../../common/manager-list/ManagerListMgr';
import style from './WxActivitySuccessApplyModal.less';
import QueueAnim from 'rc-queue-anim';

function WxActivityCreateForm({

    successSearchVisible,

    successFilterFunction,
    successSearchFunction,
    successClearFunction,
    successPageSizeChange,
    successPageIndexChange,
    exportSuccess,

    closeSuccessApplyModal,        //关闭报名成功列表

    successModalVisible,
    successDataSource,
    successResultCount,
    successPageIndex,
    successPageSize,
    successLoading,

    cancelApply,
    toBeNumberOne,

    addRemark,                  //添加备注


}){

    let WxActivitySuccessTableProps = {
        search : {
            searchAble    : true,
            showSearch    : successSearchVisible,
            filterBtnText : '筛选',
            onFilterClick : successFilterFunction,
            onSearch      : successSearchFunction,
            onClear       : successClearFunction,
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
                    handle   : exportSuccess,
                    disabled : successDataSource && successDataSource.length == 0,
                }
            ]
        },
        table : {
            loading    : successLoading,
            dataSource : successDataSource,
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
                        <a onClick = { () => addRemark( record.id, record.remark ) }>
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
                                <Popconfirm title = "确认要取消报名么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { () => cancelApply( record.id ) } >
                                    <a>取消报名</a>
                                </Popconfirm>

                            }
                            {
                                record && record.status == '1' &&
                                <Popconfirm title = "确认要优先等位么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { () => toBeNumberOne( record.id ) } >
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
                total            : successResultCount,
                pageIndex        : successPageIndex,
                pageSize         : successPageSize,
                showTotal        : '',
                showSizeChanger  : true,
                showQuickJumper  : true,
                onShowSizeChange : successPageSizeChange,
                onChange         : successPageIndexChange,

            }
         }
    };

	return(
       <Modal
            className = "yhwu_wx_activity_success_model"
            visible   = { successModalVisible }
            title     = '活动信息'
            maskClosable = { false }
            width     = '1000px'
            onCancel  = { closeSuccessApplyModal }
            footer    = { null }
        >
            <WxActivitySuccessTable { ...WxActivitySuccessTableProps } />
        </Modal>
	)
};

export default WxActivityCreateForm;
