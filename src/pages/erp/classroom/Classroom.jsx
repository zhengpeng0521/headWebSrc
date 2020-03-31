import React from 'react';
import { connect } from 'dva';
import Classroom from '../../../components/erp/classroom/Classroom';
function Classroomfun({dispatch, classroomModel}) {

	let {
        //教室列表
        classRoomDataSource,   //教室数据数组
        classRoomDataCount,    //教室数据总数
        classRomeTableLoading, //教室列表加载状态
        selectedRowKeys,       //选中项中的key数组
        selectedRows,          //

         //分页
        pageIndex,
        pageSize,


        //筛选教室
        showSearch,         //显示筛选框

        searchData,         //搜索栏数据

        //新增教室
        classRomeSelectOrgId,   //默认选中的校区
        modalType,              //新增或者编辑modal类型('create'/'update')
        showAdd,                //显示新增班级
        classroomInfo,          //班级信息
        formButtonLoading,      //新增编辑教室按钮加载状态
        updateContent,          //编辑时回填数据

    } = classroomModel;

    //显隐搜索框
    function showSearchFunction () {
        dispatch({
			type : "classroomModel/updateState",
			payload : {
				showSearch : !showSearch
			}
		});
    }

    //筛选中的搜索和清除条件
    function searchClassroom (data) {
        dispatch({
            type: 'classroomModel/updateState',
            payload: {
                searchData : data,
                pageIndex : 0,
                selectedRowKeys : [],
                selectedRows : [],
            }
        })
        dispatch({
            type: 'classroomModel/GetClassRoomList',
            payload: {
                pageSize,
                pageIndex : 0,
                ...data
            }
        })
    }

    //选择表格行
	function rowSelectChange ( selectedRowKeys,selectedRows ){
		dispatch({
            type : 'classroomModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
	};

    //批量删除操作
	function deleteClassroom(){
		let id = [];
        for(let i in selectedRows){
            id.push(selectedRows[i].id)
        }
        id = id.join(',');
        dispatch({
            type : 'classroomModel/DeleteClassroom',
            payload : {
                id,
                orgId : selectedRows[0].orgId
            }
        })
	};

    //显隐新增班级方法
    function createClassroom () {
        //classRomeSelectOrgId

        // let org;
        // /*取到第一个校区(默认校区)ID*/
        // if(window._init_data.firstOrg != undefined){
        //     org = window._init_data.firstOrg;                //获取选择校区下的第一间校区
        //
        //     // dispatch({
        //     //     type : 'scrmStudentManageModel/TenantSelectOnSelect',
        //     //     payload : {
        //     //         value:org.key,
        //     //     }
        //     // })
        //     dispatch({
        //         type:'classroomModel/updateState',
        //         payload:{
        //             classRomeSelectOrgId : org.key,
        //         }
        //     });
        // }

        dispatch ({
            type : "classroomModel/updateState",
            payload : {
                showAdd : true,
                modalType : 'create',
            }
        })
    }

    //新增班级  保存
    function classroomAddOk (data) {
        dispatch({
            type : 'classroomModel/updateState',
            payload : {
                formButtonLoading : true ,
            }
        });
        if( modalType == 'create' ){
            dispatch({
                type : "classroomModel/CreateClassRoom",
                payload : {
                    ...data
                }
            });
        }else if( modalType == 'update' ){
            dispatch({
                type : "classroomModel/UpdateClassRoom",
                payload : {
                    id : updateContent.id,
                    ...data
                }
            });
        }
    }

    //新增班级  取消
    function classroomAddCancel () {
        dispatch ({
            type : "classroomModel/updateState",
            payload : {
                showAdd : false,
                formButtonLoading : false ,
            }
        });
    }

    //教室信息  修改
    function classroomAddUpdate (data) {
        dispatch ({
            type : "classroomModel/updateState",
            payload : {
                showAdd : true,
                modalType : 'update',
                updateContent : data
            }
        });
    }


    //列表分页
    let tablePageChange = function(pagination, filters, sorter) {
         dispatch({
            type: 'classroomModel/updateState',
            payload: {
                pageIndex : pagination.current-1,
                pageSize : pagination.pageSize,
                selectedRowKeys : [],
                selectedRows : [],
            },
        });
        dispatch({
            type: 'classroomModel/GetClassRoomList',
            payload: {
                pageIndex : pagination.current-1,
                pageSize : pagination.pageSize,
                ...searchData
            },
        });
    };



    let props = {
        classroom : {
            classRoomDataSource,     //教室数据数组
            classRoomDataCount,      //教师数据总数
            classRomeTableLoading,   //教室列表加载状态
            rowSelectChange,         //选择表格行
            deleteClassroom,         //删除选中行
            tablePageChange,         //页码及每页条数
            selectedRowKeys,         //选中项中的key数组
            selectedRows,            //
            pageIndex,
            pageSize,
        },
        classroomAdd : {
            classRomeSelectOrgId,    //默认选中的校区
            modalType,               //新增或者编辑modal类型('create'/'update')
            showAdd,                 //显隐新增班级
            updateContent,           //编辑时回填数据
            formButtonLoading,       //新增编辑教室按钮加载状态
            createClassroom,         //新增班级的方法
            classroomAddCancel,      //新增教室  取消 X
            classroomAddOk,          //新增教室  保存
            classroomInfo,           //教室信息
            classroomAddUpdate,      //教室信息  修改
        },
        classroomSearch : {
            showSearchFunction,      //显示筛选框
            showSearch,
            searchClassroom,         //筛选搜索方法
        }
    }

    return (
        <Classroom {...props} />
    );
}

function mapStateToProps({ classroomModel }) {
  	return { classroomModel };
}

export default connect(mapStateToProps)(Classroomfun);
