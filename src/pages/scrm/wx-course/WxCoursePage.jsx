import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Icon, Popover } from 'antd';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import { routerRedux } from 'dva/router';
import WxCourseComponent from '../../../components/common/manager-list/ManagerListMgr';
import WxCourseCreateForm from '../../../components/scrm/wx-course/WxCourseCreateForm';
import TenantOrgSelect from '../../common/tenant-org-select/TenantOrgSelect';            //引进校区公共组件

import WxActivityCodeUrlModal from '../../../components/scrm/wx-activity/WxActivityCodeUrlModal';


function WxCoursePage({ dispatch, wxCourseModel }){
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
        wxCourseCreateVisible,
        courseInfo,
        dict,

        selectModalVisible,
        selectOrgs,

        //查看校区
        selectedOrgModalVisible,
        selectedOrgIds,

        //二维码
        url,
        urlOrgId,
        urlOrgIds,
        codeUrlModalVisible,
        codeId,

        id

    } = wxCourseModel;


    //有关校区选择框
    function onOpenSelectOrgModal() {
        dispatch({
            type: 'wxCourseModel/onOpenSelectOrgModal',
            payload : {
                selectModalVisible
            }
        });
    };

    function onSelectOrgModalClose() {
        dispatch({
            type: 'wxCourseModel/onSelectOrgModalClose',
            payload : {
                selectModalVisible
            }
        });
    }

    function afterSelectOrgModal( org_select ) {
        dispatch({
            type: 'wxCourseModel/afterSelectOrgModalSubmit',
            payload : {
                selectOrgs : org_select,
            }
        });
    };


    //筛选是否可见
    function filterFunction(){
        dispatch({
            type : 'wxCourseModel/updateState',
            payload : {
                searchVisible : !searchVisible
            }
        })
    };

    //点击搜索
    function searchFunction( values ){
        dispatch({
            type : 'wxCourseModel/searchAndClearFunction',
            payload : {
                values
            }
        })
    };

    //点击清除条件
    function clearFunction(){
        dispatch({
            type : 'wxCourseModel/searchAndClearFunction',
            payload : {
                values : {
                    orgId        : '',
                    courseName   : '',
                    status       : '',
                }
            }
        })
    };

    //选中表格项
    function rowSelectChange( selectedRowKeys, selectedRows ){
        dispatch({
            type : 'wxCourseModel/updateState',
            payload : {
                selectedRows,
                selectedRowKeys,
            }
        })
    }

    //删除课程、上架下架
    function updateCourseStatus( status ){
        dispatch({
            type : 'wxCourseModel/updateCourseStatus',
            payload : {
                selectedRows,
                status
            }
        });
    }

    //查看二维码
    function showCourseUrl( orgIds, id ){        
        let orgId = orgIds.split(',')[0];
        dispatch({
            type : 'wxCourseModel/showCourseUrl',
            payload : {
                urlOrgId             : '',//orgId,
                codeId               : id,
                urlOrgIds            : orgIds.split(','),
            }
        })
    };

    //选择校区改变二维码链接
    function TenantOrgFilterAction( orgId ){
        dispatch({
            type : 'wxCourseModel/TenantOrgFilterAction',
            payload : {
                urlOrgId             : orgId,
            }
        });
    };
    //关闭二维码
    function closeWxActivityCodeUrlModal(){
        dispatch({
            type : 'wxCourseModel/updateState',
            payload : {
                url                 : '',
                urlOrgId            : '',
                urlOrgIds           : [],
                codeUrlModalVisible : false,
                codeId              : '',
            }
        })
    }

    //查看已选中的校区
    function showSelectedOrgIds( text ){
        dispatch({
            type : 'wxCourseModel/updateState',
            payload : {
                selectedOrgIds          : text.split(','),
                selectedOrgModalVisible : true,
                modifyCourse            : true,
            }
        })
    };

    //关闭校区查看框
    function selectedOrgModalClose(){
        dispatch({
            type : 'wxCourseModel/updateState',
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
        init_org_select : selectedOrgIds,
        no_select_campus: modifyCourse,
    };

    //新增课程
    function createCourse(){
        dispatch({
            type : 'wxCourseModel/createCourse',
            payload : {
                wxCourseCreateVisible,
            }
        })
        dispatch({
            type: 'wxCourseModel/updateState',
            payload: {
                modifyCourse : false,
            }
        })
    };

    //修改课程
    function updateCourse( id ){
        dispatch({
            type : 'wxCourseModel/updateCourse',
            payload : {
                id,
            }
        })
        dispatch({
            type: 'wxCourseModel/updateState',
            payload: {
                modifyCourse: true,
            }
        })
    }
	
    //确认新增
    function confirmAddWxCourse( values ){
        dispatch({
            type : 'wxCourseModel/confirmAddWxCourse',
            payload : {
                values
            }
        })
    };

    //取消新增
    function cancelAddWxCourse(){
		clearInterval( window.wActivityTimer );
        dispatch({
            type : 'wxCourseModel/updateState',
            payload : {
                id                    : '',
                wxCourseCreateVisible : !wxCourseCreateVisible,
                courseInfo            : {},
                selectOrgs            : [],
            }
        })
    };

    //改变pageSize
    function pageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'wxCourseModel/pagination',
            payload : {
                pageIndex, pageSize,
            }
        })
    }

    //改变pageIndex
    function pageIndexChange( pageIndex ){
        dispatch({
            type : 'wxCourseModel/pagination',
            payload : {
                pageIndex, pageSize,
            }
        })
    };
	
    let WxCourseComponentProps = {
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
                    key         : 'courseName',
                    type        : 'text',
                    placeholder : '课程名称',
                },{
                    key         : 'status',
                    type        : 'select',
                    placeholder : '课程状态',
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
                    handle   : () => updateCourseStatus('0'),
                    disabled : selectedRowKeys.length !== 1,
                    confirm  : true,
                },{
                    type     : 'text',
                    label    : '上架',
                    handle   : () => updateCourseStatus('1'),
                    disabled : selectedRowKeys.length !== 1,
                    confirm  : true,
                },{
                    type     : 'text',
                    label    : '下架',
                    handle   : () => updateCourseStatus('2'),
                    disabled : selectedRowKeys.length !== 1,
                    confirm  : true,
                },
            ]
        },
        rightBars : {
            btns : [
                {
                    type     : 'btn',
                    label    : '新增课程',
                    icon     : 'plus',
                    handle   : createCourse,
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
                    title     : '课程名称',
                    width     : 150,
                    render    : ( text, record ) => (
                        <div>
                            <div style = {{ width : '80%', display : 'inline-block' }}>
                                <a style = {{ marginRight : '10px' }} onClick = { () => updateCourse( record.id ) }>{ text }</a>
                            </div>
                            <div style = {{ width : '20%', display : 'inline-block', textAlign : 'right' }}>
                                <Icon style = {{ cursor : 'pointer' }} onClick = { () => showCourseUrl( record.orgIds, record.id ) } type = 'erweima' />
                            </div>
                        </div>
                    )
                },{
                    dataIndex : 'adAge',
                    key       : 'adAge',
                    title     : '适合年龄',
                    width     : 250,
                },{
                    dataIndex : 'status',
                    key       : 'status',
                    title     : '课程状态',
                    width     : 120,
                    render    : ( text, record ) => (
                        <span style = {{ color : text == '1' ? '#5d9cec' : 'red' }} >
                            { text && text == '1' ? '已上架' : text == '2' ? '已下架' : null }
                        </span>
                    )
                },{
                    dataIndex : 'orgIds',
                    key       : 'orgIds',
                    title     : '开课校区',
                    width     : 120,
                    render    : ( text, record ) => (
                        <a onClick = { () => showSelectedOrgIds( text ) }>
                            { text && text.split(',').length || '' }
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

    let WxCourseCreateFormProps = {

        //打开校区选择框
        selectOrgs,
        onOpenSelectOrgModal,
        selectModalVisible,
        onSelectOrgModalClose,
        afterSelectOrgModal,
        modifyCourse,
        wxCourseCreateVisible,
        courseInfo,
        dict,

        cancelAddWxCourse,
        confirmAddWxCourse,

        id,

    }

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
        <div>
            <WxCourseComponent { ...WxCourseComponentProps } />
            <WxCourseCreateForm { ...WxCourseCreateFormProps } />
            <TenantOrgSelect { ...tenantOrgSelectProps } />
            <WxActivityCodeUrlModal { ...WxActivityCodeUrlModalProps } />
        </div>
    )
};

function mapStateToProps ({ wxCourseModel }){
	return { wxCourseModel };
};

export default connect( mapStateToProps )( WxCoursePage );
// .ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td
