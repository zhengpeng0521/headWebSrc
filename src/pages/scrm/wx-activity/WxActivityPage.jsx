import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Input } from 'antd';
import WxActivityComponent from '../../../components/common/manager-list/ManagerListMgr';
import WxActivityCreateForm from '../../../components/scrm/wx-activity/WxActivityCreateForm';
import WxActivitySuccessApplyModal from '../../../components/scrm/wx-activity/WxActivitySuccessApplyModal';
import WxActivityRemarkModal from '../../../components/scrm/wx-activity/WxActivityRemarkModal';
import WxActivityCodeUrlModal from '../../../components/scrm/wx-activity/WxActivityCodeUrlModal';
import TenantOrgSelect from '../../common/tenant-org-select/TenantOrgSelect';            //引进校区公共组件

function WxActivityPage({ dispatch, wxActivityModel }){
    let {
        searchVisible,               //筛选框是否可见
        modifyCourse,
        loading,
        dataSource,                  //列表数据
        resultCount,
        pageIndex,
        pageSize,
        selectedRows,
        selectedRowKeys,

        //表单属性
        wxActivityCreateVisible,
        activityInfo,

        selectModalVisible,
        selectOrgs,

        //报名成功
        successModalVisible,
        successDataSource,
        successResultCount,
        successPageIndex,
        successPageSize,
        successLoading,

        successOrgId,
        applyStatus,
        activityId,
        successSearchVisible,

        applyId,
        remark,

        //备注框
        remarkModalVisible,

        selectedOrgModalVisible,
        selectedOrgIds,

        //二维码
        url,
        urlOrgId,
        urlOrgIds,
        codeUrlModalVisible,
        codeId,

        id,             //渲染用id判断是新增还是修改
        isModify,
        limitTime

    } = wxActivityModel;

    dataSource && dataSource.map((item, index) => {
        item.key = String(index)
    })

    //有关校区选择框
    function onOpenSelectOrgModal() {
        dispatch({
            type: 'wxActivityModel/onOpenSelectOrgModal',
            payload : {
                selectModalVisible
            }
        });
    };

    function onSelectOrgModalClose() {
        dispatch({
            type: 'wxActivityModel/onSelectOrgModalClose',
            payload : {
                selectModalVisible
            }
        });
    }

    function afterSelectOrgModal( org_select ) {
        dispatch({
            type: 'wxActivityModel/afterSelectOrgModalSubmit',
            payload : {
                selectOrgs : org_select,
            }
        });
    };


    //筛选是否可见
    function filterFunction(){
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                searchVisible : !searchVisible
            }
        })
    };

    //点击搜索
    function searchFunction( values ){
        dispatch({
            type : 'wxActivityModel/searchAndClearFunction',
            payload : {
                values
            }
        })
    };

    //点击清除条件
    function clearFunction(){
        dispatch({
            type : 'wxActivityModel/searchAndClearFunction',
            payload : {
                values : {
                    orgId  : '',
                    name   : '',
                    status : '',
                }
            }
        })
    };

    //选中表格项
    function rowSelectChange( selectedRowKeys, selectedRows ){
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                selectedRows,
                selectedRowKeys,
            }
        })
    }

    //删除、上架、下架活动
    function updateActivityStatus( status ){
        dispatch({
            type : 'wxActivityModel/updateActivityStatus',
            payload : {
                selectedRows,
                status
            }
        })
    }

    //新增活动
    function createActivity(){
        dispatch({
            type : 'wxActivityModel/createActivity',
            payload : {
                wxActivityCreateVisible
            }
        })
        dispatch({
            type: 'wxActivityModel/updateState',
            payload: {
                modifyCourse: false,
            }
        })
    };

    //修改活动
    function updateActivity( id ){
        
        dispatch({
            type : 'wxActivityModel/updateActivity',
            payload : {
                id
            }
        })
        dispatch({
            type: 'wxActivityModel/updateState',
            payload: {
                modifyCourse: true,
            }
        })
    };

    //确认新增活动
    function confirmAddWxActivity( values ){
        dispatch({
            type : 'wxActivityModel/confirmAddWxActivity',
            payload : {
                values
            }
        })
    };

    //取消新增活动
    function cancelAddWxActivity(){
		clearInterval( window.wActivityTimer );
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                id                      : '',
                wxActivityCreateVisible : false,
                activityInfo            : {},
                selectOrgs              : [],
            }
        })
    };

    //报名成功列表
    function applySuccess( id ){
        dispatch({
            type : 'wxActivityModel/applySuccess',
            payload : {
                id
            }
        })
    }

    //报名成功搜索框是否显示
    function successFilterFunction(){
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                successSearchVisible : !successSearchVisible
            }
        })
    };

    //报名成功搜索
    function successSearchFunction( values ){
        dispatch({
            type : 'wxActivityModel/successSearchAndClearFunction',
            payload : {
                values
            }
        })
    };

    //报名成功重置
    function successClearFunction(){
        dispatch({
            type : 'wxActivityModel/successSearchAndClearFunction',
            payload : {
                values : {

                }
            }
        })
    };

    //导出
    function exportSuccess(){
        dispatch({
            type : 'wxActivityModel/exportSuccess',
            payload : {

            }
        })
    };

    //取消报名
    function cancelApply( id ){
        dispatch({
            type : 'wxActivityModel/cancelApply',
            payload : {
                activityId,
                id,
            }
        })
    };

    //优先等位
    function toBeNumberOne( id ){
        dispatch({
            type : 'wxActivityModel/toBeNumberOne',
            payload : {
                id,
                activityId,
            }
        })
    };

    //报名成功改变pageSize
    function successPageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'wxActivityModel/successPagination',
            payload : {
                successPageIndex : pageIndex,
                successPageSize  : pageSize,
            }
        })
    };

    //报名成功改变pageIndex
    function successPageIndexChange( pageIndex ){
        dispatch({
            type : 'wxActivityModel/successPagination',
            payload : {
                successPageIndex : pageIndex,
                successPageSize  : pageSize,
            }
        });
    };

    //添加备注
    function addRemark( id, remark){
        dispatch({
            type : 'wxActivityModel/addRemark',
            payload : {
                id,
                remark
            }
        })
    };

    //确定添加备注
    function confirmAddRemark( value ){
        dispatch({
            type : 'wxActivityModel/confirmAddRemark',
            payload : {
                value
            }
        })
    };

    //取消添加备注
    function cancelAddRemark(){
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                remark             : '',
                applyId            : '',
                remarkModalVisible : false,
            }
        })
    };

    function changemoneySetFuntioin(e) {
        dispatch({
            type: 'wxActivityModel/updateState',
            payload: {
                moneySet: e,
            }
        })
    }

    //关闭报名列表模态框
    function closeSuccessApplyModal(){
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                successModalVisible : !successModalVisible,
                successDataSource   : [],
                activityId          : '',
                successResultCount  : '',
                successPageIndex    : 0,
                successPageSize     : 10,
                successLoading      : false,
            }
        })
    };

    //查看已选校区
    function showSelectedOrgIds( orgIds ){
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                selectedOrgIds          : orgIds,
                selectedOrgModalVisible : true,
                modifyCourse            : true,
            }
        })
    };
    //关闭校区查看框
    function selectedOrgModalClose(){
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                selectedOrgModalVisible : false,
                selectedOrgIds          : [],
            }
        })
    };

    //查看校区框属性
    let tenantOrgSelectProps = {
        visible         : selectedOrgModalVisible,
        onClose         : selectedOrgModalClose,
        disabled        : true,
        no_select_campus: modifyCourse,
        init_org_select : selectedOrgIds,
    };

    //查看二维码
    function showActivityUrl( orgIds, id ){
//        let orgId = orgIds[0];
        dispatch({
            type : 'wxActivityModel/showActivityUrl',
            payload : {
                urlOrgId             : '',//orgId,
                codeId               : id,
                urlOrgIds            : orgIds,
            }
        })
    };

    //选择校区改变二维码链接
    function TenantOrgFilterAction( orgId ){
        dispatch({
            type : 'wxActivityModel/TenantOrgFilterAction',
            payload : {
                urlOrgId             : orgId,
            }
        });
    };
    //关闭二维码
    function closeWxActivityCodeUrlModal(){
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                url                 : '',
                urlOrgId            : '',
                urlOrgIds           : [],
                codeUrlModalVisible : false,
                codeId              : '',
            }
        })
    }

    //改变pageSize
    function pageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'wxActivityModel/pagination',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    }

    //改变pageIndex
    function pageIndexChange( pageIndex ){
        dispatch({
            type : 'wxActivityModel/pagination',
            payload : {
                pageIndex, pageSize,
            }
        })
    };

    //活动时间改变
    function changeActivityTime( date ){
        dispatch({
            type : 'wxActivityModel/updateState',
            payload : {
                limitTime : date
            }
        })
    };

    let WxActivityComponentProps = {
        search : {
            searchAble    : true,
            showSearch    : searchVisible,
            filterBtnText : '筛选',
            onFilterClick : filterFunction,
            onSearch      : searchFunction,
            onClear       : clearFunction,
            fields : [
                        {
                            key         : 'orgId',
                            type        : 'orgSelect',
                            placeholder : '所属校区',
                            options : {
                                width : 300,
                            },
                        },{
                            key         : 'name',
                            type        : 'text',
                            placeholder : '活动名称',
                        },{
                            key         : 'status',
                            type        : 'select',
                            placeholder : '活动状态',
                            options     : [
                                { 'key' : '1', 'label' : '已上架' },
                                { 'key' : '2', 'label' : '已下架' }
                            ],
                        },
            ]
        },
        leftBars: {
            label : '操作 : ',
            btns : [
                {
                    type     : 'text',
                    label    : '删除',
                    handle   : () => updateActivityStatus( '0' ),
                    disabled : selectedRowKeys.length !== 1,
                    confirm  : true,
                },{
                    type     : 'text',
                    label    : '上架',
                    handle   : () => updateActivityStatus( '1' ),
                    disabled : selectedRowKeys.length !== 1,
                    confirm  : true,
                },{
                    type     : 'text',
                    label    : '下架',
                    handle   : () => updateActivityStatus( '2' ),
                    disabled : selectedRowKeys.length !== 1,
                    confirm  : true,
                },
            ]
        },
        rightBars : {
            btns : [
                {
                    type     : 'btn',
                    label    : '新增活动',
                    icon     : 'plus',
                    handle   : createActivity,
                }
            ]
        },
        table : {
            loading    : loading,
            dataSource : dataSource,
            columns : [
                {
                    dataIndex : 'name',
                    key       : 'name',
                    title     : '活动名称',
                    width     : 200,
                    render    : ( text, record ) => (
                        <div>
                            <div style = {{ width : '80%', display : 'inline-block' }}>
                                <a style = {{ marginRight : '10px' }} onClick = { () => updateActivity( record.id ) }>{ text }</a>
                            </div>
                            <div style = {{ width : '20%', display : 'inline-block', textAlign : 'right' }}>
                                <Icon style = {{ cursor : 'pointer' }} onClick = { () => showActivityUrl( record.orgIds, record.id ) } type = 'erweima' />
                            </div>
                        </div>
                    )
                },{
                    dataIndex : 'applyTime',
                    key       : 'applyTime',
                    title     : '活动报名时间',
                    width     : 300,
                    render    : ( text, record ) => (
                        <span>
                            { record.applystartTime || '' }
                            ~
                            { record.applyendTime || '' }
                        </span>
                    )
                },{
                    dataIndex : 'success',
                    key       : 'success',
                    title     : '报名成功/等位',
                    width     : 100,
                    render    : ( text, record ) => (
                        <a onClick = { () => applySuccess( record.id )} >
                            { record.sucNum || '0' }
                            /
                            { record.waitNum || '0' }
                        </a>
                    )
                },{
                    dataIndex : 'status',
                    key       : 'status',
                    title     : '活动状态',
                    width     : 120,
                    render    : ( text, record ) => (
                        <div style = {{ color : text == '1' ? '#5d9cec' : 'red' }} >
                            { text && text == '1' ? '已上架' : text == '2' ? '已下架' : null }
                        </div>
                    )
                },{
                    dataIndex : 'orgIds',
                    key       : 'orgIds',
                    title     : '开设校区',
                    width     : 80,
                    render    : ( text, record ) => (
                        <a onClick = { () => showSelectedOrgIds( text ) }>
                            { text && text.length  || '' }
                        </a>
                    )
                },{
                    dataIndex : 'sort',
                    key       : 'sort',
                    title     : '排序值',
                    width     : 80,
                },{
                    dataIndex : 'createTime',
                    key       : 'createTime',
                    title     : '创建日期',
                    width     : 180,
                }
            ],
            emptyText : '暂时没有数据',
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : rowSelectChange,
                getCheckboxProps: record => ({
                    disabled: (record.isHq === 0 || record.isHq === false),
                }),
            },
            pagination : {
                total            : resultCount,
                pageIndex        : pageIndex,
                pageSize         : pageSize,
                showTotal        : '',
                showSizeChanger  : true,
                showQuickJumper  : true,
                onShowSizeChange : pageSizeChange,
                onChange         : pageIndexChange

            }
         }
    };

    let WxActivityCreateFormProps = {
        wxActivityCreateVisible,
        activityInfo,
        modifyCourse,

        cancelAddWxActivity,
        confirmAddWxActivity,

        //打开校区选择框
        selectOrgs,
        onOpenSelectOrgModal,
        selectModalVisible,
        onSelectOrgModalClose,
        afterSelectOrgModal,

        id,
        isModify,
        changemoneySetFuntioin,
        changeActivityTime,
        limitTime,
    };

    let WxActivitySuccessApplyModalProps = {
        successFilterFunction,
        successSearchFunction,
        successClearFunction,
        exportSuccess,
        successPageSizeChange,
        successPageIndexChange,

        successModalVisible,
        successDataSource,
        successResultCount,
        successPageIndex,
        successPageSize,
        successLoading,


        successOrgId,
        applyStatus,
        activityId,
        successSearchVisible,

        applyId,
        remark,

        addRemark,                      //添加备注

        closeSuccessApplyModal,

        cancelApply,
        toBeNumberOne,

    };

    //备注框
    let WxActivityRemarkModalProps = {
        remark,
        remarkModalVisible,

        cancelAddRemark,
        confirmAddRemark,
    };

    //二维码框
    let WxActivityCodeUrlModalProps = {
        url,
        urlOrgId,
        urlOrgIds,
        codeUrlModalVisible,

        TenantOrgFilterAction,
        closeWxActivityCodeUrlModal
    }
    return (
        <div className="wxMicroCourseTable">
            <WxActivityComponent { ...WxActivityComponentProps } />
            <WxActivityCreateForm { ...WxActivityCreateFormProps } />
            <WxActivitySuccessApplyModal { ...WxActivitySuccessApplyModalProps } />
            <WxActivityRemarkModal { ...WxActivityRemarkModalProps } />
            <TenantOrgSelect { ...tenantOrgSelectProps } />
            <WxActivityCodeUrlModal { ...WxActivityCodeUrlModalProps } />
        </div>
    )
};

function mapStateToProps ({ wxActivityModel }){
	return { wxActivityModel };
};

export default connect( mapStateToProps )( WxActivityPage );
