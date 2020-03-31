import React from 'react';
import { Popover ,message } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import style from './CourseManage.less';

import CourseManageTable from '../../../components/common/new-component/manager-list/ManagerList';
import CourseManageCreate from '../../../components/cerp/course-manage/course-manage-add-or-edit/CourseManageCreate';
import CourseManageDetail from '../../../components/cerp/course-manage/course-manage-detail/CourseManageDetail';
import CourseManageEdit from '../../../components/cerp/course-manage/course-manage-add-or-edit/CourseManageEdit';
import CourseManageAddSchdule from '../../../components/cerp/course-manage/course-manage-add-schedule/CourseManageAddSchedule';
import CourseOrderSystem from '../../../components/cerp/course-manage/course-order-system/CourseOrderSystem';       //课系课阶modal
import { AlertModal } from '../../../components/common/new-component/NewComponent';

function CourseManagePage ({ dispatch , cerpCourseManageModel }){
	let {
        searchVisible,
       // orgOptionsList,
        createFormVisible,
        dataSource,
        newColumns,
        selectedRecordIds,
        selectedRecordOrgIds,

        selectedRowKeys,
        selectedRows,
        courseInfo,
        selectOrgs,
        selectModalVisible,
        pageIndex,
        pageSize,
        resultCount,
        orgId,
        loading,
        //开课校区查看
        selectedOrgIds,
        selectedOrgModalVisible,

        ageType,   //新增编辑年龄类型

        //打开详情
       createFormModelVisible,
       modalAllDetailContent,  //获取全部详情数据
       leadsFollowDetailModalTabKey,
       editFormVisible,
       addSchduleVisible,     //添加上课安排

       remindCreateStatus,
       remindEditStatus,

       yuelingCreateStatus,
       yuelingEditStatus,

       costCreateStatus ,
       costEditStatus,
       maxMaCreateStatus,
       maxMaEditStatus,

        modalButtonLoading,     //新增编辑课程表单确认按钮加载状态

        classOrder,             //新增编辑时课阶课系内容

        /*删除确认modal*/
        removeCourseModalAlertVisible,              //删除二次确认modal是否显示
        removeCourseModalAlertTitle,                //删除二次确认modal表单头部
        removeCourseModalAlertContent,              //删除二次确认modal表单内容
        removeCourseModalAlertButtonLoading,        //删除二次确认确认按钮加载状态
        removeCourseModalAlertMessage,              //删除二次确认点击确定需要提交的信息

        /*课系课阶modal*/
        initOrgId,                                  //当前校区
        courseOrderSystemModalVisible,              //modal是否显示
        courseOrderSystemModalLoading,              //modal加载状态
        courseOrderSystemModalData,                 //modal数据

        //新增编辑课阶课系
        courseOrderSystemAddOrEditModalVisible,     //modal是否显示
        courseOrderSystemAddOrEditModalType,        //类型(add/edit)
        courseOrderSystemAddOrEditModalLoading,     //表单加载状态
        courseOrderSystemAddOrEditModalData,        //编辑回填数据
        //课系删除失败
        classCeletionFailed,                        //model是否显示

    } = cerpCourseManageModel;
    //有关校区选择框
    function onOpenSelectOrgModal() {
        dispatch({
            type: 'cerpCourseManageModel/onOpenSelectOrgModal',
            payload : {
                selectModalVisible
            }
        });
    };

    function onSelectOrgModalClose() {
        dispatch({
            type: 'cerpCourseManageModel/onSelectOrgModalClose',
            payload : {
                selectModalVisible
            }
        });
    }

    function afterSelectOrgModal(org_select) {
        dispatch({
            type: 'cerpCourseManageModel/afterSelectOrgModalSubmit',
            payload : {
                selectOrgs: org_select,
            }
        });
    };

    //选择表格项
	function rowSelectChangeAction( selectedRowKeys,selectedRows ){
		dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
	};
    /*改变表格显示项*/
	function changeColumns( newColumns ){
		dispatch({
			type : 'cerpCourseManageModel/updateState',
			payload : {
				newColumns : newColumns
			}
		})
	}

    //点击搜索按钮查询
	function onCourseSearch( values ){
		dispatch({
            type : 'cerpCourseManageModel/onCourseSearch',
            payload : {
                values
            }
        })
	};

    //点击重置按钮清空查询条件
	function onCourseReset(){
		dispatch({
            type : 'cerpCourseManageModel/onCourseReset',
            payload : {
                ids         : '',
                title      : '',
            }
        });
	};

    //新增课程
	function createCourse (){
		dispatch({
			type : 'cerpCourseManageModel/createCourse',
			payload : {
				createFormVisible
			}
		});
        dispatch({
            type:'cerpCourseManageModel/CourseOrderSystemOpen',
            payload:{
                orgId : initOrgId
            }
        });
	};



    //批量操作删除
	function deleteCourse(){
		selectedRecordIds = [];
		selectedRows.map(function(item){
            selectedRecordIds.push(item.id);
        });
        if(selectedRecordIds.length>1){
             message.error('不能进行批量删除');
        }else{
            dispatch({
                type : 'cerpCourseManageModel/deleteCourse',
                payload : {
                    selectedRecordIds,
                }
            })
        }

	};

    //删除详情数据
    function deleteDetailCourse(detail){
        dispatch({
            type:'cerpCourseManageModel/updateState',
            payload:{
                removeCourseModalAlertVisible : true,                 //删除二次确认modal是否显示
                removeCourseModalAlertTitle : '删除确认',               //删除二次确认modal表单头部
                removeCourseModalAlertContent : '确定删除此课程吗',      //删除二次确认modal表单内容
                removeCourseModalAlertButtonLoading : false,          //删除二次确认确认按钮加载状态
                removeCourseModalAlertMessage : { ids : detail.id , orgId : detail.orgId , status : '0' },
            }
        });
	};

    //提示框点击确认
    function RemoveCourseModalAlertOnOk(){
        dispatch({
            type : 'cerpCourseManageModel/deleteCourseDetail',
            payload : {
                ...removeCourseModalAlertMessage
            }
        })
    }

    //提示框点击取消
    function RemoveCourseModalAlertOnCancel(){
        dispatch({
            type:'cerpCourseManageModel/updateState',
            payload:{
                removeCourseModalAlertVisible : false,                //删除二次确认modal是否显示
                removeCourseModalAlertTitle : '删除确认',               //删除二次确认modal表单头部
                removeCourseModalAlertContent : '确定删除此课程吗',      //删除二次确认modal表单内容
                removeCourseModalAlertButtonLoading : false,          //删除二次确认确认按钮加载状态
                removeCourseModalAlertMessage : {},
            }
        });
    }

    //选择校区
    function onOpenSelectOrgModal(){
        dispatch({
            type : 'cerpCourseManageModel/onOpenSelectOrgModal',
            payload : {
                selectModalVisible
            }
        })
    };
    //确认新增
	function confirmCreateForm( params ){

        let maxValue = params.maxMa;
        let minValue = params.minMa;
        let costValue = params.cost;

        if(Number(maxValue) <= Number(minValue)){
            dispatch({
                type : 'cerpCourseManageModel/updateState',
                payload : {
                   remindCreateStatus : true
                }
            })
        }else{
            dispatch({
                type : 'cerpCourseManageModel/confirmCreateForm',
                payload : {
                   ...params
                }
            })
            dispatch({
                type : 'cerpCourseManageModel/updateState',
                payload : {
                   remindCreateStatus  : false,

                }
            })
        }
	};
    //确认修改
    function confirmEditFrom(params){
        let maxValue = params.maxMa;
        let minValue = params.minMa;
        let costValue = params.cost;
        if(Number(maxValue)<=Number(minValue)){
            dispatch({
                type : 'cerpCourseManageModel/updateState',
                payload : {
                   remindEditStatus : true
                }
            })
        }else{
            dispatch({
                type : 'cerpCourseManageModel/confirmEditFrom',
                payload : {
                   ...params
                }
            })
            dispatch({
                type : 'cerpCourseManageModel/updateState',
                payload : {
                   remindEditStatus  : false,
                }
            })
        }
	};

    //取消新增
	function cancelCreateForm(){
		dispatch({
			type : 'cerpCourseManageModel/updateState',
			payload : {
				createFormVisible :!createFormVisible
			}
		})
	};
    //编辑页面取消
    function cancelEditForm(){
		dispatch({
			type : 'cerpCourseManageModel/updateState',
			payload : {
				editFormVisible :!editFormVisible
			}
		})
	};
    //点击分页
    function pageIndexChange(pageIndex){
        dispatch({
            type : 'cerpCourseManageModel/paginationChange',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };
    //改变pageSize
    function pageSizeChange(pageIndex,pageSize){
        dispatch({
            type : 'cerpCourseManageModel/paginationChange',
            payload : {
                pageIndex, pageSize
            }
        })
    };

    //点击查看开课的校区
    function checkOrgInfo( orgIds ){
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
                selectedOrgIds : orgIds,
                selectedOrgModalVisible : !selectedOrgModalVisible
            }
        })
    };

    //关闭开课校区框
    function selectedOrgModalClose(){
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
                selectedOrgModalVisible : !selectedOrgModalVisible,
                selectedOrgIds : [],
            }
        })
    }

    //打开详情页面
    function courseDetailModel(ids,orgid){
        dispatch({
            type : 'cerpCourseManageModel/getCourseDetail',
            payload : {
               id : ids,
               orgId : orgid,

            }
        })

    }
    //点击修改课程
    function updateCourse( modalAllDetailContent){
        dispatch({
           type : 'cerpCourseManageModel/EditCourse',
			payload : {
                id : modalAllDetailContent.id,
                orgId : modalAllDetailContent.orgId,
			}
        })
        dispatch({
            type:'cerpCourseManageModel/CourseOrderSystemOpen',
            payload:{
                orgId : initOrgId
            }
        });
    };

    function cancelCreateFormModel(){
         dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
               createFormModelVisible :false,
            }
        })
    }

    //排课显示
    function addNewSchdule(){
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
               addSchduleVisible :true,
            }
        })
    }
     //排课显示
    function cancelAddSchdule(){
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
               addSchduleVisible :false,
            }
        })
    }

    //课系课阶modal打开
    function CourseOrderSystemOpen(){
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
                courseOrderSystemModalVisible : true,
            }
        });
        dispatch({
            type:'cerpCourseManageModel/CourseOrderSystemOpen',
            payload:{
                orgId : initOrgId
            }
        });
    }

    //课系课阶modal关闭
    function CourseOrderSystemModalClose(){
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
                courseOrderSystemModalVisible : false,
            }
        })
    }
    //课系失败时的触发的方法
    function ClassSystemFailureModel() {
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
                classCeletionFailed:false
            }
        })
    }
    //modal点击新增
    function CourseOrderSystemModalAdd(){
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
                courseOrderSystemAddOrEditModalVisible : true,
                courseOrderSystemAddOrEditModalType : 'add'
            }
        })
    }

    //年龄类型onChange事件
    function ChangeAgeType(value){
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
                ageType : value
            }
        })
    }

    //新增编辑提交
    function CourseOrderSystemAddOrEditModalSubmit(data){
        let params = { orgId : initOrgId , ...data };
        let path = '';
        if(courseOrderSystemAddOrEditModalType == 'add'){
            path = 'cerpCourseManageModel/CourseOrderSystemAdd'
        }else if(courseOrderSystemAddOrEditModalType == 'edit'){
            params.id = courseOrderSystemAddOrEditModalData.id;
            path = 'cerpCourseManageModel/CourseOrderSystemEdit'
        }else{
            return message.error('未知状态')
        }
        dispatch({
            type:path,
            payload:{
                ...params
            }
        });
    }

    //modal编辑课系
    function CourseOrderSystemModalEdit(data){
        dispatch({
            type:'cerpCourseManageModel/updateState',
            payload:{
                courseOrderSystemAddOrEditModalType : 'edit',
                courseOrderSystemAddOrEditModalData : data,
                courseOrderSystemAddOrEditModalVisible : true
            }
        })
    }

    //modal删除课系
    function CourseOrderSystemModalDelete(id){
        console.log(id)
        let params = { orgId : initOrgId , id };
        dispatch({
            type:'cerpCourseManageModel/CourseOrderSystemDelete',
            payload:{
                ...params
            }
        })
    }

    //关闭新增编辑课系modal
    function CourseOrderSystemAddOrEditModalCancel(){
        dispatch({
            type : 'cerpCourseManageModel/updateState',
            payload : {
                courseOrderSystemAddOrEditModalVisible : false,
                courseOrderSystemAddOrEditModalType : undefined,
                courseOrderSystemAddOrEditModalData : {}
            }
        })
    }

    //详情
    let CourseManageDetailProps={
        createFormModelVisible,
        cancelCreateFormModel,
        updateCourse,
        modalAllDetailContent,
        deleteDetailCourse,
        leadsFollowDetailModalTabKey,
        addSchduleVisible,
        addNewSchdule,
    }
    //新增  或  修改
	let courseManageCreateProps = {
        classOrder,             //新增编辑时课阶课系内容
		createFormVisible,
		confirmCreateForm,
        cancelCreateForm,
        ageType,   //新增编辑年龄类型
        courseInfo,
        onOpenSelectOrgModal,
        onSelectOrgModalClose,
        afterSelectOrgModal,
        selectModalVisible,
        selectOrgs,
        modalButtonLoading,
        ChangeAgeType,          //年龄类型onChange事件

        editFormVisible,
        confirmEditFrom,
        cancelEditForm,
        modalAllDetailContent,
        remindCreateStatus,
        remindEditStatus,

	}
    //添加排课弹窗
    let courseManageAddSchduleProps = {
		addNewSchdule,
        addSchduleVisible,
        cancelAddSchdule,
	}

    //表格
    let courseManageTableProps = {
        search: {
            searchAble: true,
            onSearch:onCourseSearch,
            onClear:onCourseReset,
            fields: [

                {
                    key: 'title',
                    type: 'input',
                    placeholder: '课程名称',
                    width: '120px',
                },
            ],
            initSearchValues: [],
        },
        table: {
            loading:loading,
            rowKey: 'id',
            newColumns    : newColumns,
			changeColumns : changeColumns,
            xScroll       : 1200,
            columns: [
                {
                    title     : '课程名称',
                    dataIndex : 'title',
                    key       : 'title',
                    width     : 160,
                    render    : ( text , record ) => (
                        <Popover placement = 'top' content = { text } >
                            <a onClick = { () => courseDetailModel( record.id , record.orgId ) }>{ text }</a>
                        </Popover>
                    )
                },{
                    title     : '课系',
                    dataIndex : 'groupName',
                    key       : 'groupName',
                    width     : 160,
                    render    : ( text , record ) => (
                        <Popover placement = 'top' content = { text } >
                            { text }
                        </Popover>
                    )
                },{
                    title     : '每节消耗',
                    dateIndex : 'cost',
                    key       : 'cost',
                    width     : 96,
                    render    : ( text , record ) => (
                        <Popover placement='top' content={record && record.cost}>
                            { record && record.cost }
                        </Popover>
                    )
                },{
                    title     : '上课月龄/年龄',
                    dataIndex : 'month',
                    key       : 'month',
                    width     : 112,
                    render    : ( text, record ) => (
                        <Popover
							placement = 'top'
							content = { record.ageType == '1' ? ( record.minMa + '~' + record.maxMa + '月' ) : record.ageType == '2' ? ( record.minMa/12 + '~' + record.maxMa/12 + '岁' ) : '' } >
                            { record.ageType == '1' ? ( record.minMa + ' ~ ' + record.maxMa + ' 月' ) : record.ageType == '2' ? ( record.minMa/12 + ' ~ ' + record.maxMa/12 + ' 岁' ) : '' }
                        </Popover>
                    )
                },{
                    title     : '课程介绍',
                    dateIndex : 'intro',
                    key       : 'intro',
					width     : 160,
                    render    : ( text , record ) => (
                       <Popover placement='top' content={record && record.intro}>
                            { record && record.intro }
                        </Popover>
                    )
                },{
                    title     : '创建时间',
                    dataIndex : 'createTime',
                    key       : 'createTime',
                    width     : 140,
                    render    : ( text , record ) => (
                        <Popover placement='top' content={record && record.createTime}>
                            { record && record.createTime }
                        </Popover>
                    )
                },{
                    title     : '所属校区',
                    dataIndex : 'orgName',
                    key       : 'orgName',
                }
            ],
            dataSource,
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : rowSelectChangeAction,
            },


        },
        pagination : {
             total             : resultCount,
             pageIndex         : pageIndex,
             pageSize          : pageSize,
             showTotal         : total => `总共 ${total} 条` ,
             showSizeChanger   : true,
             showQuickJumper   : true,
             onChange          : pageIndexChange,
             onShowSizeChange  : pageSizeChange,
             size              : 'large'
        },
        leftBars : {
            label : '已选',
			labelNum : selectedRowKeys.length,
            btns : [
                {
                    label    : '删除',
                    handle   : deleteCourse,
                    confirm  : true,
                }
            ]
        },

        rightBars : {
            btns : [
                { label : '管理课系' , handle : CourseOrderSystemOpen },
                { label : '新增课程' , handle : createCourse },
            ],
			isSuperSearch : false,
        },
    };

    //课系课阶modal属性
    let CourseOrderSystemProps = {
        //课系删除失败
        classCeletionFailed,                        //modal是否显示
        ClassSystemFailureModel,
        //课阶课系
        courseOrderSystemModalVisible,              //modal是否显示
        courseOrderSystemModalLoading,              //modal加载状态
        courseOrderSystemModalData,                 //modal数据

        CourseOrderSystemModalAdd,                  //modal点击新增
        CourseOrderSystemModalEdit,                 //modal编辑课系
        CourseOrderSystemModalDelete,               //modal删除课系
        CourseOrderSystemModalClose,                //modal关闭

        //新增编辑课阶课系
        courseOrderSystemAddOrEditModalVisible,     //modal是否显示
        courseOrderSystemAddOrEditModalType,        //类型(add/edit)
        courseOrderSystemAddOrEditModalLoading,     //表单加载状态
        courseOrderSystemAddOrEditModalData,        //编辑回填数据

        CourseOrderSystemAddOrEditModalSubmit,      //新增编辑提交
        CourseOrderSystemAddOrEditModalCancel,      //关闭modal
    }

    let AlertModalProps = {
        visible : removeCourseModalAlertVisible,                   //提示框是否显示
        title : removeCourseModalAlertTitle,                       //提示框标题
        content : removeCourseModalAlertContent,                   //提示框内容
        buttonLoading : removeCourseModalAlertButtonLoading,       //提示框按钮是否加载状态
        onOk : RemoveCourseModalAlertOnOk,                         //提示框点击确认
        onCancel : RemoveCourseModalAlertOnCancel,                 //提示框点击取消
    }

	return (
		<div style = {{ overflowX : 'hidden', height : '100%' }}>
			<CourseManageTable { ...courseManageTableProps } />
            { !!createFormVisible ? <CourseManageCreate { ... courseManageCreateProps } /> : null }
            <CourseManageDetail { ... CourseManageDetailProps } />
            { !!editFormVisible ? <CourseManageEdit { ... courseManageCreateProps} /> : null }
            <CourseManageAddSchdule {...courseManageAddSchduleProps}/>
            <CourseOrderSystem {...CourseOrderSystemProps}/>
            <AlertModal { ...AlertModalProps }/>
		</div>
	)
};

function mapStateToProps ({ cerpCourseManageModel }){
	return { cerpCourseManageModel };
};

export default connect(mapStateToProps)(CourseManagePage);
