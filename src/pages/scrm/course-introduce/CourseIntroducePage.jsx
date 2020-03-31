import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Popconfirm } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import KoubeiOrgSelect from '../koubei/common/koubei-org-select/KoubeiOrgSelect';
import CourseIntroduceComponent from '../../../components/common/manager-list/ManagerListMgr';
import CourseIntroduceCreateForm from '../../../components/scrm/course-introduce/CourseIntroduceCreateForm';
import CourseIntroduceEditor from '../../../components/scrm/course-introduce/CourseIntroduceEditor';
import KoubeiAuthValidateModal from '../koubei/common/KoubeiAuthValidateModal';

function CourseIntroducePage({ dispatch, courseIntroduceModel }){
    let {
        searchVisible,
        courseId,
        courseName,
        status,

        pageIndex,
        pageSize,
        dataSource,
        loading,
        resultCount,
        selectedRowKeys,
        selectedRows,
        selectedRecordIds,

        //新增修改框
        createCourseIntroduceVisible,
        singleCourseInfo,
        selectModalVisible,
        selectOrgs,

        //富文本编辑器
        courseIntroduceEditorVisible,
        htmlDetail,


        //已选适用门店
        selectedOrgIds,
        selectedOrgModalVisible,


    } = courseIntroduceModel;

    dataSource && dataSource.map(function(item,index){
        item.key = index;
    })

    //时间格式化
	function charge( DateType, Number ){
        if( DateType < Number ){
            return '0' + DateType;
        }else{
            return DateType;
        }
    };
	function FormatDate( strTime ){
		let date = new Date( strTime );
        let Months, Day, Hours, Minutes, Seconds;
        Months  = charge(date.getMonth()+1,10);
        Day     = charge(date.getDate(),10);
        Hours   = charge(date.getHours(),10);
        Minutes = charge(date.getMinutes(),10);
        Seconds = charge(date.getSeconds(),10);
        return date.getFullYear() + "-" + Months + "-" + Day + " " + Hours + ":" + Minutes + ":" + Seconds;
	};

    //有关校区选择框
    function onOpenSelectOrgModal() {
        dispatch({
            type: 'courseIntroduceModel/onOpenSelectOrgModal',
            payload : {
                selectModalVisible
            }
        });
    };

    function onSelectOrgModalClose() {
        dispatch({
            type: 'courseIntroduceModel/onSelectOrgModalClose',
            payload : {
                selectModalVisible
            }
        });
    }

    function afterSelectOrgModal(org_select) {
        dispatch({
            type: 'courseIntroduceModel/afterSelectOrgModalSubmit',
            payload : {
                selectOrgs: org_select,
            }
        });
    };

    //筛选是否可见
    function filterFunction(){
        dispatch({
            type : 'courseIntroduceModel/updateState',
            payload : {
                searchVisible : !searchVisible
            }
        })
    };

    //搜索
    function searchFunction( values ){
        dispatch({
            type : 'courseIntroduceModel/searchFunction',
            payload : {
                values
            }
        })
    };
    //清除条件
    function clearFunction(){
        dispatch({
            type : 'courseIntroduceModel/searchFunction',
            payload : {
                values : {
                    courseId   : '',
                    courseName : '',
                    status     : '',
                }
            }
        })
    };

    //选择表格项
    function rowSelectChange( selectedRowKeys, selectedRows ){
        dispatch({
            type : 'courseIntroduceModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows,
            }
        })
    };

    //批量上架课程
    function batchPutawayCourse(){
        let selectedRecordIds = [];
        selectedRows.map(function(item,index){
            selectedRecordIds.push( item.id );
        })
        dispatch({
            type : 'courseIntroduceModel/batchOperation',
            payload : {
                selectedRecordIds,
                status : '1',
            }
        })
    };

    //批量下架课程
    function batchdDisabledCourse(){
        let selectedRecordIds = [];
        selectedRows.map(function(item,index){
            selectedRecordIds.push( item.id );
        })
        dispatch({
            type : 'courseIntroduceModel/batchOperation',
            payload : {
                selectedRecordIds,
                status : '2',
            }
        })
    };

    //批量删除课程
    function batchDeleteCourse(){
        let selectedRecordIds = [];
        selectedRows.map(function(item,index){
            selectedRecordIds.push( item.id );
        })
        dispatch({
            type : 'courseIntroduceModel/batchOperation',
            payload : {
                selectedRecordIds,
                status : '0',
            }
        })
    };

    //点击新增课程
    function createCourse(){
        dispatch({
            type : 'courseIntroduceModel/updateState',
            payload : {
                createCourseIntroduceVisible : !createCourseIntroduceVisible
            }
        })
    };
    //确认新增
    function confirmAddCourse( values ){
        dispatch({
            type : 'courseIntroduceModel/confirmAddCourse',
            payload : {
                values,
                selectOrgs   : [],
            }
        })
    };
    //取消新增
    function cancelAddCourse(){
        dispatch({
            type : 'courseIntroduceModel/updateState',
            payload : {
                createCourseIntroduceVisible : !createCourseIntroduceVisible,
                selectOrgs                   : [],
                singleCourseInfo             : {},
            }
        })
    };

    //删除课程
    function deleteCourse( id ){
        dispatch({
            type : 'courseIntroduceModel/deleteAndUpdateCourse',
            payload : {
                cids    : id,
                status  : '0',
            }
        })
    };

    //上下架操作
    function putAwayAndDisabledCourse( id, status ){
        if( status == '1' ){
            dispatch({
                type : 'courseIntroduceModel/deleteAndUpdateCourse',
                payload : {
                    cids    : id,
                    status  : '2',
                }
            })
        }else if( status == '2' ){
            dispatch({
                type : 'courseIntroduceModel/deleteAndUpdateCourse',
                payload : {
                    cids    : id,
                    status  : '1',
                }
            })
        }
    };

    //点击修改课程
    function updateCourse( id ){
        dispatch({
            type : 'courseIntroduceModel/updateCourse',
            payload : {
                id
            }
        })
    };

    //课程详情
    function tableOnUpdateHtmldetailItem( id ){
        dispatch({
            type : 'courseIntroduceModel/tableOnUpdateHtmldetailItem',
            payload : {
                id
            }
        })
    };

    //确认课程详情
    function confirmAddCourseEditor( values ){
        dispatch({
            type : 'courseIntroduceModel/confirmAddCourseEditor',
            payload : {
                values
            }
        })
    };

    //取消课程详情
    function cancelAddCourseEditor(){
        dispatch({
            type : 'courseIntroduceModel/updateState',
            payload : {
                htmlDetail   : '',
                htmlCourseId : '',
                courseIntroduceEditorVisible : !courseIntroduceEditorVisible
            }
        })
    };

    //改变pageSize
    function pageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'courseIntroduceModel/pagination',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };

    //改变pageIndex
    function pageIndexChange( pageIndex ){
        dispatch({
            type : 'courseIntroduceModel/pagination',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };

    //查看口碑适用门店
    function showSelectedOrgModal( id ){
        dispatch({
            type : 'courseIntroduceModel/showSelectedOrgModal',
            payload : {
                id
            }
        })
    };

    //关闭口碑适用门店
    function selectedOrgModalClose(){
        dispatch({
            type : 'courseIntroduceModel/updateState',
            payload : {
                selectedOrgModalVisible : !selectedOrgModalVisible,
                selectedOrgIds          : [],
            }
        })
    }
    let CourseIntroduceComponentProps = {
        search : {
            searchAble    : true,
            showSearch    : searchVisible,
            filterBtnText : '筛选',
            onFilterClick : filterFunction,
            onSearch      : searchFunction,
            onClear       : clearFunction,
            fields : [
                        {
                            key         : 'courseId',
                            type        : 'text',
                            placeholder : '课程编号',
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
                                { 'key' : '2', 'label' : '待上架' }
                            ],
                        },
            ]
        },
        leftBars: {
            label : '操作 : ',
            btns : [
                {
                    type     : 'text',
                    label    : '上架',
                    handle   : batchPutawayCourse,
                    disabled : selectedRowKeys.length == 0,
                },{
                    type     : 'text',
                    label    : '下架',
                    handle   : batchdDisabledCourse,
                    disabled : selectedRowKeys.length == 0,
                },{
                    type     : 'text',
                    label    : '删除',
                    handle   : batchDeleteCourse,
                    disabled : selectedRowKeys.length == 0,
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
                    title     : '操作',
                    width     : 200,
                    render    : ( text, record ) => (
                        <div>
                            <Popconfirm placement = "top" title = { "确认要删除么？" } okText = "确认" cancelText = "取消" onConfirm = { () => deleteCourse( record.id ) }>
                                <a href="#">删除</a>
                            </Popconfirm>
                            <Popconfirm placement = "top" title = { record.status == "1" ? "确认要下架么？" : "确认要上架么？" } okText = "确认" cancelText = "取消" onConfirm = { () => putAwayAndDisabledCourse( record.id, record.status ) }>
                                <a href = "#" style={{ color : (record.status == "1" ? "red" : ""), marginLeft : '10px' }}>{record.status == "1" ? '下架' : '上架' }</a>
                            </Popconfirm>
                            <a style = {{ marginLeft : '10px' }} onClick = { () => updateCourse( record.id ) }>修改</a>
                            <a style = {{ marginLeft : '10px' }} onClick = { () => tableOnUpdateHtmldetailItem( record.id ) }>课程详情</a>
                        </div>
                    )
                },{
                    dataIndex : 'id',
                    key       : 'id',
                    title     : '编号',
                    width     : 200,
                },{
                    dataIndex : 'courseName',
                    key       : 'courseName',
                    title     : '课程名称',
                    width     : 150,
                },{
                    dataIndex : 'adage',
                    key       : 'adage',
                    title     : '适用年龄',
                    width     : 180,
                },{
                    dataIndex : 'status',
                    key       : 'status',
                    title     : '课程状态',
                    width     : 100,
                    render    : ( text , record ) => (
                        <span>{ record.status ? ( record.status == '1' ? '已上架' : '待上架' ) : '' }</span>
                    )
                },{
                    dataIndex : 'cnt',
                    key       : 'cnt',
                    title     : '适用门店',
                    width     : 160,
                    render    : ( text, record ) => (
				        <a onClick = { () => showSelectedOrgModal( record.id ) }>口碑&nbsp;{ text || 0 }家门店</a>
			         )
                },{
                    dataIndex : 'sort',
                    key       : 'sort',
                    title     : '排序值',
                    width     : 100,
                },{
                    dataIndex : 'createTime',
                    key       : 'createTime',
                    title     : '创建时间',
                    width     : 220,
                    render    :( text, record ) => (
                        <span>{ text ? FormatDate( text ) : '' }</span>
                    )
                }
            ],
            emptyText : '暂时没有数据',
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : rowSelectChange,
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

    let CourseIntroduceCreateFormProps = {
        createCourseIntroduceVisible,
        singleCourseInfo,

        onOpenSelectOrgModal,
        onSelectOrgModalClose,
        afterSelectOrgModal,
        selectModalVisible,
        selectOrgs,

        confirmAddCourse,
        cancelAddCourse
    };

    let CourseIntroduceEditorProps = {
        courseIntroduceEditorVisible,
        htmlDetail,
        confirmAddCourseEditor,
        cancelAddCourseEditor
    };

    //适用门店
    let TenantOrgSelectProps = {
        visible         : selectedOrgModalVisible,
        onClose         : selectedOrgModalClose,
        disabled        : true,
        init_org_select : selectedOrgIds,
		commodityId     : '201612060244770111',        //口碑商品的插件服务号
    }
    return (
        <div>
            <CourseIntroduceComponent { ...CourseIntroduceComponentProps } />
            <CourseIntroduceCreateForm { ...CourseIntroduceCreateFormProps } />
            <CourseIntroduceEditor { ...CourseIntroduceEditorProps } />
            <KoubeiOrgSelect { ...TenantOrgSelectProps } />
            <KoubeiAuthValidateModal signType="2" />
        </div>
    )
};

function mapStateToProps ({ courseIntroduceModel }){
	return { courseIntroduceModel };
};

export default connect( mapStateToProps )( CourseIntroducePage );
