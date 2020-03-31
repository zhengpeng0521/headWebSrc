import React, { PropTypes } from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';

import { Icon } from 'antd';

import WxActivityComponent from '../../../components/common/manager-list/ManagerListMgr';
import WxCreateActivityComponent from '../../../components/scrm/wx-activity-create/WxActivityContent';

function WxActivityPage({ dispatch, NAMESPACECREATEACTIVITY }){

    let {

        attrActivityList,
        attrActivityData,
        attrSelectedRows,
        attrSelectedRowKeys,
        attrSearchVisible,
        attrListLoading,
        attrPageSize,
        attrPageIndex,
        attrOrgId,
        attrName,
        attrStatus,
        attrPageModal,
        attrQrCodeShow,
        attrCampusShowModal,
        attrQrUrl,
        attrModify,
        attrModifyData,
        attrTabActiveKey,
        attrImageList,
        attrActivityId,
        attrSuccessDataSource,
        attrSuccessResultCount,
        attrSuccessPageIndex,
        attrSuccessPageSize,
        attrSuccessLoading,
        attrSuccessOrgId,
        attrApplyStatus,
        attrSuccessModalVisible,
        attrSuccessSearchVisible,
        attrApplyId,
        attrRemark,
        attrRemarkModalVisible,
        attrSaveSuccess,
        attrHTMLValue,
        attrCampusSelectIds,

    } = NAMESPACECREATEACTIVITY;

    function dp(name, params) {
        dispatch({
            type: `NAMESPACECREATEACTIVITY/${name}`,
            payload: {
                ...params,
            }
        })
    }

    //处理key
    attrActivityList && attrActivityList.map((item, index) => {
        item.key = String(index);
    })

    //改变pageIndex
    function funcPageSizeChange(pageIndex, pageSize) {
        dp('paginationChange', {pageIndex : pageIndex, pageSize : pageSize});
    }
   
    //改变pageIndex
    function funcPageIndexChange(pageIndex) {
        dp('paginationChange', { pageIndex: pageIndex, pageSize: attrPageSize});
    }

    //筛选是否可见
    function funcFilterFunction() {
        dp('updateState', { attrSearchVisible: !attrSearchVisible});
    }

    //点击搜索
    function funcSearchFunction(values) {        
        dp('searchAndClearFunction', { values });
    }

    //点击清除条件
    function funcClearFunction() {
        dp('searchAndClearFunction', {
            values : {
                attrOrgId   : '',
                attrName    : '',
                attrStatus  : '',
            }
        });
    }

    //创建活动
    function funcCreateActivity() {
        dp('createActivity', { attrPageModal: !attrPageModal, attrModify: false, attrModifyData : {}});
    }

    //选中行变化
    function funcRowSelectChange(selectedRowKeys, selectedRows) {
        dp('updateState', { attrSelectedRows: selectedRows, attrSelectedRowKeys: selectedRowKeys });
    }

    //提交数据
    function funcHandleOnSubmit(params) {
        dp('confirmAddWxActivity', { params: params, attrPageModal: !attrPageModal });
    }

    //关闭主modal
    function funcHandleClose() {
        dp('updateState', { attrPageModal: !attrPageModal, attrModify: false, attrModifyData: {}, attrSaveSuccess: !attrSaveSuccess, attrHTMLValue: undefined });
    }

    //删除、上架、下架活动
    function updateActivityStatus(status) {
        dp('updateActivityStatus', {
            selectedRows : attrSelectedRows,
            status,
        });
    }

    //查看二维码
    function funcShowActivityUrl(orgIds, id) {
        dp('showActivityUrl', { codeId: id, urlOrgIds: orgIds});
    };

    //修改活动
    function updateActivity(id) {
        dp('updateActivity', { id });
    };

    //更新属性
    function funcChangeParam(param) {
        dp('updateState', {...param});
    }

    //关闭二维码弹框
    function funcCloseQrUrlModal() {
        dp('updateState', { attrQrCodeShow: !attrQrCodeShow})
    }

    //报名信息
    function funcApplySuccess(id) {
        dp('applySuccess', {id});
    }

    //报名成功搜索框是否显示
    function funcSuccessFilterFunction () {
        dp('updateState', { attrSuccessSearchVisible: !attrSuccessSearchVisible});
    }

    //报名成功搜索
    function funcSuccessSearchFunction(values) {
        dp('successSearchAndClearFunction', { values});
    }

     //报名成功重置
    function funcSuccessClearFunction () {
        dp('successSearchAndClearFunction', { values : {} });
    }

    //导出
    function funcExportSuccess () {
        dp('exportSuccess', {});
    }

    //报名成功改变pageSize
    function funcSuccessPageSizeChange(pageIndex, pageSize) {
        dp('successPagination', { successPageIndex: pageIndex, successPageSize: pageSize});
    }

    //报名成功改变pageIndex
    function funcSuccessPageIndexChange(pageIndex) {
        dp('successPagination', { successPageIndex: pageIndex, successPageSize: attrSuccessPageSize });
    }

    //关闭报名列表模态框
    function funcCloseSuccessApplyModal () {
        dp('updateState', {
            attrSuccessModalVisible: !attrSuccessModalVisible,
            attrSuccessDataSource: [],
            attrActivityId: '',
            attrSuccessResultCount: '',
            attrSuccessPageIndex: 0,
            attrSuccessPageSize: 10,
            attrSuccessLoading: false,

        });
    }

    function functUpdateActivity(id) {
        dp('updateActivity', {id});
    }

    //取消报名
    function funcCancelApply (id) {
        dp('cancelApply', { activityId: attrActivityId, id});
    }

    //优先等位
    function funcToBeNumberOne (id) {
        dp('toBeNumberOne', { activityId: attrActivityId, id});
    }

    //添加备注
    function funcAddRemark(id, remark) {
        dp('addRemark', { id, remark});
    } 

    //取消添加备注
    function funcCancelAddRemark() {
        dp('updateState', {
            attrRemark: '',
            attrApplyId: '',
            attrRemarkModalVisible: false,
        });
    }

    //确定添加备注
    function funcConfirmAddRemark(value) {
        dp('confirmAddRemark', { value });
    }

    //选择校区
    function functionSelectOrgIds() {
        dp('updateState', { attrCampusShowModal: !attrCampusShowModal});
    }

    //关闭校区model
    function functionCloseCampusParam() {
        dp('updateState', { attrCampusShowModal: !attrCampusShowModal});
    }

    //更新校区相关属性
    function functionUpdateCampusParam(vue) {
        dp('updateState', { attrCampusShowModal: !attrCampusShowModal, attrCampusSelectIds : vue });
    }

    //查看校区
    function functionRevireSelectCampus(e) {
        dp('updateState', { attrCampusShowModal: !attrCampusShowModal, attrCampusSelectIds: e.orgIds, attrModify: !attrModify});
    }

        //全选
    function selectAllLabel(selected,selectedRows, changeRows){
        dp('updateState', {
            attrSelectedRows: selectedRows,
        });
    }

    let props = {
        attrPageModal,
        attrQrCodeShow,
        attrQrUrl,
        attrTabActiveKey,
        attrModify,
        attrModifyData,
        attrSuccessModalVisible,
        attrSuccessDataSource,
        attrSuccessResultCount,
        attrSuccessPageIndex,
        attrSuccessPageSize,
        attrSuccessLoading,
        attrSuccessOrgId,
        attrApplyStatus,
        attrSuccessSearchVisible,
        attrRemark,
        attrRemarkModalVisible,
        attrSaveSuccess,
        attrHTMLValue,
        attrCampusShowModal,
        attrCampusSelectIds,

        funcHandleOnSubmit,
        funcHandleClose,
        funcChangeParam,
        funcCloseQrUrlModal,
        funcSuccessFilterFunction,
        funcSuccessSearchFunction,
        funcSuccessClearFunction,
        funcExportSuccess,
        funcSuccessPageSizeChange,
        funcSuccessPageIndexChange,
        funcCloseSuccessApplyModal,
        attrImageList,
        funcCancelApply,
        funcToBeNumberOne,
        funcAddRemark, 
        funcCancelAddRemark,
        funcConfirmAddRemark,
        functionSelectOrgIds,
        functionUpdateCampusParam,
        functionCloseCampusParam,
    }
    
    //列表展示
    let WxActivityComponentProps = {
        search: {
            searchAble: true,
            showSearch: attrSearchVisible,
            filterBtnText: '筛选',
            onFilterClick: funcFilterFunction,
            onSearch: funcSearchFunction,
            onClear: funcClearFunction,
            fields: [
                {
                    key: 'orgId',
                    type: 'orgSelect',
                    placeholder: '所属校区',
                    options: {
                        width: 300,
                    },
                },
                {
                    key: 'name',
                    type: 'text',
                    placeholder: '活动名称',
                }, {
                    key: 'status',
                    type: 'select',
                    placeholder: '活动状态',
                    options: [
                        { 'key': '1', 'label': '已上架' },
                        { 'key': '2', 'label': '已下架' }
                    ],
                },
            ]
        },
        leftBars: {
            label: '操作 : ',
            btns: [
                {
                    type: 'text',
                    label: '删除',
                    handle: () => updateActivityStatus('0'),
                    disabled: attrSelectedRows.length == 0 || attrSelectedRows.length > 1,
                    confirm: true,
                }, {
                    type: 'text',
                    label: '上架',
                    handle: () => updateActivityStatus('1'),
                    disabled: attrSelectedRows.length == 0,
                    confirm: true,
                }, {
                    type: 'text',
                    label: '下架',
                    handle: () => updateActivityStatus('2'),
                    disabled: attrSelectedRows.length == 0,
                    confirm: true,
                },
            ]
        },
        rightBars: {
            btns: [
                {
                    type: 'btn',
                    label: '新增活动',
                    icon: 'plus',
                    handle: funcCreateActivity,
                }
            ]
        },
        table: {
            loading: attrListLoading || false,
            dataSource: attrActivityList || [],
            columns: [
                {
                    dataIndex: 'name',
                    key: 'name',
                    title: '活动名称',
                    width: 200,
                    render: (text, record) => (
                        <div>
                            <div style={{ width: '80%', display: 'inline-block' }}>
                                <a style={{ marginRight: '10px' }} onClick={() => functUpdateActivity(record.id)}>{text}</a>
                            </div>
                            <div style={{ width: '20%', display: 'inline-block', textAlign: 'right' }}>
                                <Icon style={{ cursor: 'pointer' }} onClick={() => funcShowActivityUrl(record.orgIds, record.id)} type='erweima' />
                            </div>
                        </div>
                    )
                }, {
                    dataIndex: 'applyTime',
                    key: 'applyTime',
                    title: '活动报名时间',
                    width: 300,
                    render: (text, record) => (
                        <span>
                            {record.applystartTime || ''}
                            ~
                            {record.applyendTime || ''}
                        </span>
                    )
                }, {
                    dataIndex: 'success',
                    key: 'success',
                    title: '报名成功/等位',
                    width: 100,
                    render: (text, record) => (
                        <a onClick={() => funcApplySuccess(record.id)} >
                            {record.sucNum || '0'}/{record.waitNum || '0'}
                        </a>
                    )
                }, {
                    dataIndex: 'status',
                    key: 'status',
                    title: '活动状态',
                    width: 120,
                    render: (text, record) => (
                        <div style={{ color: text == '1' ? '#5d9cec' : 'red' }} >
                            {text && text == '1' ? '已上架' : text == '2' ? '已下架' : null}
                        </div>
                    )
                }, {
                    dataIndex: 'orgIds',
                    key: 'orgIds',
                    title: '开设校区',
                    width: 80,
                    render: (text, record) => (
                        <a onClick={() => functionRevireSelectCampus(record)}>{record.orgIds.length || 0}</a>
                    )
                }, {
                    dataIndex: 'sort',
                    key: 'sort',
                    title: '排序值',
                    width: 80,
                }, {
                    dataIndex: 'createTime',
                    key: 'createTime',
                    title: '创建日期',
                    width: 180,
                }
            ],
            emptyText: '暂时没有数据',
            rowSelection: {
                selectedRowKeys: attrSelectedRowKeys,
                onChange: funcRowSelectChange,
                onSelectAll: (selected, selectedRows, changeRows)=>selectAllLabel(selected, selectedRows, changeRows),
                hideDefaultSelections:false,
                getCheckboxProps: record => ({
                    disabled: (record.isHq === 0 || record.isHq === false),
                }),
            },
            pagination: {
                total: attrActivityData && attrActivityData.resultCount,
                pageIndex: attrPageIndex,
                pageSize: attrPageSize,
                showTotal: '',
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: funcPageSizeChange,
                onChange: funcPageIndexChange

            }
        }
    }

    return (
        <div className="create_micro_activity" style={{minWidth : '1000px'}}>
            <WxActivityComponent { ...WxActivityComponentProps } />
            <WxCreateActivityComponent {...props} />
        </div>
    )
};

function mapStateToProps({ NAMESPACECREATEACTIVITY }){
    return { NAMESPACECREATEACTIVITY };
};

export default connect( mapStateToProps )( WxActivityPage );
