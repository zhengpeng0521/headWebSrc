import React from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm ,message, Popover } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from '../../../components/cerp/classroom/Classroom.less';
import ClassroomAdd from '../../../components/cerp/classroom/ClassroomAdd';
import ClassroomDetail from '../../../components/cerp/classroom/ClassroomDetail';
import ClassroomEdit from '../../../components/cerp/classroom/ClassroomEdit';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import ManagerListMgr from '../../../components/common/new-component/manager-list/ManagerList';
import ClassAddSchdule from '../../../components/cerp/classroom/ClassroomAddSchedule';
import { AlertModal } from '../../../components/common/new-component/NewComponent';

function Classroomfun({dispatch, cerpClassroomModel}) {

	let {
        //教室列表
        classRoomDataSource,   //教室数据数组
        classRoomDataCount,    //教室数据总数
        classRomeTableLoading, //教室列表加载状态
        selectedRowKeys,       //选中项中的key数组
        selectedRows,          //
        newColumns,
         //分页
        pageIndex,
        pageSize,
        resultCount,
        loading,
        //筛选教室
        showSearch,         //显示筛选框

        searchData,         //搜索栏数据

        //新增教室
        orgId,   //默认选中的校区
        modalType,              //新增或者编辑modal类型('create'/'update')
        showAdd,                //显示新增班级
        classroomInfo,          //班级信息
        formButtonLoading,      //新增编辑教室按钮加载状态
        updateContent,          //编辑时回填数据


        //教室详情
        createFormModelVisible,  //详情页面是否显示
        modalAllDetailContent,   //获取列表详情数据


        //编辑页面
        classroomEditVisible,    //编辑页面是否显示

        addSchduleVisible,

        /*删除确认modal*/
        removeClsRoomModalAlertVisible,          //删除二次确认modal是否显示
        removeClsRoomModalAlertTitle,            //删除二次确认modal表单头部
        removeClsRoomModalAlertContent,          //删除二次确认modal表单内容
        removeClsRoomModalAlertButtonLoading,    //删除二次确认确认按钮加载状态
        removeClsRoomModalAlertMessage,          //删除二次确认点击确定需要提交的信息
    } = cerpClassroomModel;



    function searchClassroom( values ){
		dispatch({
            type : 'cerpClassroomModel/onClassSearch',
            payload : {
                values
            }
        })
	};


    //选择表格行
	function rowSelectChange ( selectedRowKeys,selectedRows ){
		dispatch({
            type : 'cerpClassroomModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
	};
     /*改变表格显示项*/
	function changeColumns( newColumns ){
		dispatch({
			type : 'cerpClassroomModel/updateState',
			payload : {
				newColumns : newColumns
			}
		})
	}
    //批量删除操作
	function deleteClassroom(){
		let ids = [];
        for(let i in selectedRows){
            ids.push(selectedRows[i].id)
        }
        if(ids.length>1){
             message.error('不能进行批量删除');
        }else{
            ids = ids.join(',');
            dispatch({
                type : 'cerpClassroomModel/DeleteClassroom',
                payload : {
                    ids : ids,
                    orgId : selectedRows[0].orgId,
                    status : '0',
                }
            })
        }


	};

    //显隐新增班级方法
    function createClassroom () {
        dispatch ({
            type : "cerpClassroomModel/updateState",
            payload : {
                showAdd : true,
                modalType : 'create',
            }
        })
    }

    //新增班级  保存
    function classroomAdd(data) {
		dispatch({
			type : "cerpClassroomModel/CreateClassRoom",
			payload : {
				...data
			}
		});

    }

    //新增班级  取消
    function classroomAddCancel () {
        dispatch ({
            type : "cerpClassroomModel/updateState",
            payload : {
                showAdd           : false,
                formButtonLoading : false ,
            }
        });
    }

    //教室信息  编辑
    function classroomAddUpdate (data) {
        dispatch ({
            type : "cerpClassroomModel/updateState",
            payload : {
               classroomEditVisible:true,
               modalAllDetailContent:data,
            }
        });
    }


    //编辑页面关闭
    function classroomEditCancel () {
        dispatch ({
            type : "cerpClassroomModel/updateState",
            payload : {
                classroomEditVisible : false,
               // updateContent : data
            }
        });
    }
    //点击重置按钮清空查询条件
	function onClassReset(){
		dispatch({
            type : 'cerpClassroomModel/onCourseReset',
            payload : {
                name   : '',
                ids    : '',
                pageSize : 10,
                pageIndex : 0 ,
            }
        });
	};


     //点击分页
    function pageIndexChange(pageIndex){
        dispatch({
            type : 'cerpClassroomModel/paginationChange',
             payload : {
                pageIndex,
                pageSize,
            }
        })
    };


    //改变pageSize
    function pageSizeChange(pageIndex,pageSize){
        dispatch({
            type : 'cerpClassroomModel/paginationChange',
            payload : {
                pageIndex, pageSize
            }
        })
    };

    //打开详情
    function classroomDetail(ids,orgid){
         dispatch({
            type : 'cerpClassroomModel/classroomDetail',  //
            payload : {
               id : ids,
               orgId : orgid,
            }
        })
    }
    //关闭详情
    function cancelClassRoomDetail(){
         dispatch({
            type : 'cerpClassroomModel/updateState',
            payload : {
               createFormModelVisible :false,

            }
        })
    }
    //编辑保存
    function classroomAddOk(data){
        dispatch({
            type : 'cerpClassroomModel/editClassRoom',
            payload : {
               id : data.id,
               orgId : data.orgId,
               name : data.name,
               intro : data.intro,
            }
        })
    }

    //删除详情数据
    function deleteDetailClass(data){
        dispatch({
            type:'cerpClassroomModel/updateState',
            payload:{
                removeClsRoomModalAlertVisible : true,              //删除二次确认modal是否显示
                removeClsRoomModalAlertTitle : '删除确认',           //删除二次确认modal表单头部
                removeClsRoomModalAlertContent : '确定删除此教室吗',   //删除二次确认modal表单内容
                removeClsRoomModalAlertButtonLoading : false,       //删除二次确认确认按钮加载状态
                removeClsRoomModalAlertMessage : { ids : data.id , orgId : data.orgId , status : '0' },              //删除二次确认点击确定需要提交的信息
            }
        });
    }

    //提示框点击确认
    function RemoveClsRoomModalAlertOnOk(){
        dispatch({
            type : 'cerpClassroomModel/deleteDetailClass',
            payload : {
                ...removeClsRoomModalAlertMessage
            }
        })
    }

    //提示框点击取消
    function RemoveClsRoomModalAlertOnCancel(){
        dispatch({
            type:'cerpClassroomModel/updateState',
            payload:{
                removeClsRoomModalAlertVisible : false,                //删除二次确认modal是否显示
                removeClsRoomModalAlertTitle : '删除确认',               //删除二次确认modal表单头部
                removeClsRoomModalAlertContent : '确定删除此教室吗',      //删除二次确认modal表单内容
                removeClsRoomModalAlertButtonLoading : false,          //删除二次确认确认按钮加载状态
                removeClsRoomModalAlertMessage : {},
            }
        });
    }

    //排课显示
    function addNewSchdule(){
        dispatch({
            type : 'cerpClassroomModel/updateState',
            payload : {
               addSchduleVisible :true,
            }
        })
    }
     //排课显示
    function cancelAddSchdule(){
        dispatch({
            type : 'cerpClassroomModel/updateState',
            payload : {
               addSchduleVisible :false,
            }
        })
    }

    let managerListProps = {
        search: {
                searchAble: true,
                showSearch,
                onSearch : searchClassroom,
                onClear : onClassReset,
                fields: [

                    {
                        key: 'name',
                        type: 'input',
                        placeholder: '教室名称',
                        width: '120px',
                    },

                ],
                initSearchValues: [],
        },
        table: {
            loading : loading,
            rowKey : 'id',
            newColumns    : newColumns,
			changeColumns : changeColumns,
            xScroll : 1000,
            columns: [
                        {
                            title      : '教室名称',
                            dataIndex  : 'name',
                            key        : 'name',
                            width      : 160,
                            render     : (text,record)  => (
								<Popover placement = 'top' content = { text } >
									<a onClick = {() => classroomDetail( record.id , record.orgId)}>{ text }</a>
								</Popover>
                            ),
                        },{
                            title      : '大致方位',
                            dataIndex  : 'intro',
                            key        : 'intro',
                            width      : 160,
							render     : (text,record)  => (
								<Popover placement = 'top' content = { text } >
									{ text }
								</Popover>
							)
                        },{
                            key        : 'createTime',
                            title      : '创建日期',
                            dataIndex  : 'createTime',
                            width      : 160,
                        },{
                            title      : '所属校区',
                            dataIndex  : 'orgName',
                            key        : 'orgName',
                        }
                    ],
            dataSource :classRoomDataSource,
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : rowSelectChange,
            },

        },
        pagination : {
             total             : classRoomDataCount,
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
                    handle   : deleteClassroom,
                    confirm  : true,
                }
            ]
        },

        rightBars : {
            btns : [
                {
                    label    : '新增教室',
                    handle   : createClassroom,
                }
            ],
			isSuperSearch : false,
        },
    }

    let classroomAddprops = {
		modalType,               //新增或者编辑modal类型('create'/'update')
		showAdd,                 //显隐新增班级
		updateContent,           //编辑时回填数据
		formButtonLoading,       //新增编辑教室按钮加载状态
		createClassroom,         //新增班级的方法
		classroomAddCancel,      //新增教室  取消 X
		classroomAdd,            //新增教室  保存
		classroomInfo,           //教室信息
		classroomAddUpdate,      //教室信息  修改
		classroomDetail,         //打开详情
    }


    let classroomDetailProps = {
		cancelClassRoomDetail,   //关闭详情页面
		modalAllDetailContent,   //获取列表详情数据
		deleteDetailClass,       //删除详情数据
		createFormModelVisible,  //详情页面是否显示
		classroomAddUpdate,      //打开编辑页面
		addNewSchdule,           //添加排课
    }

    let classroomEditProps = {
		classroomEditVisible,      //编辑页面打开
		classroomEditCancel,       //编辑关闭
		modalAllDetailContent,     //详情数据
		classroomAddOk,            //编辑保存
    }

    //添加排课弹窗
    let classroomAddSchduleProps = {
		addNewSchdule,
		addSchduleVisible,
		cancelAddSchdule,
	}

    let AlertModalProps = {
        visible : removeClsRoomModalAlertVisible,                   //提示框是否显示
        title   : removeClsRoomModalAlertTitle,                     //提示框标题
        content : removeClsRoomModalAlertContent,                   //提示框内容
        buttonLoading : removeClsRoomModalAlertButtonLoading,       //提示框按钮是否加载状态
        onOk : RemoveClsRoomModalAlertOnOk,                         //提示框点击确认
        onCancel : RemoveClsRoomModalAlertOnCancel,                 //提示框点击取消
    }

    return (
        <div className={styles.teaching_material_manage_cont} style = {{ overflowX : 'hidden', height : '100%' }}>
            <ManagerListMgr { ...managerListProps } />
            <ClassroomAdd {...classroomAddprops } />
            <ClassroomDetail {...classroomDetailProps } />
            <ClassroomEdit {...classroomEditProps} />
            <ClassAddSchdule {...classroomAddSchduleProps}/>
            <AlertModal { ...AlertModalProps }/>
        </div>
    );


}

function mapStateToProps({ cerpClassroomModel }) {
  	return { cerpClassroomModel };
}

export default connect(mapStateToProps)(Classroomfun);
