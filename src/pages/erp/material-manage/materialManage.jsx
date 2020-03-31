import React from 'react';
import MaterialManageList from '../../../components/erp/materials-manage/materialsManage';
import MaterialManageSearch from '../../../components/erp/materials-manage/materialsManageSearch';
import AddMaterialManage from '../../../components/erp/materials-manage/addMaterialManage';
import EditMaterialManage from '../../../components/erp/materials-manage/editMaterialManage';


import QueueAnim from 'rc-queue-anim';

import { connect } from 'dva';

function MaterialManage({ dispatch, materialManage }) {

    let {
        pageIndex,
        pageSize,
        searchVisible,  //搜索框是否显示
        loading,          //表格加载
        searchData,
        lists,            //列表数据
        listTotal,        //列表数据总数
        selectedRowKeys,  //指定选中项的 key 数组
        selectedRows,     //指定选中项
        selectRowIds,     //选中项的id;
        formLoading,      //表单按钮加载
        formVisible,      //编辑表单展示
        addFormVisible,   //新增页面是否显示
        editFormVisible,
        detailList,       //新增页面数据展示
        modalAllContent,
    } = materialManage;

        //列表分页 变更
    let tablePageChange = function(current, pageSize=payWay.pageSize) {
        dispatch({
            type: 'materialManage/updateState',
            payload: {
                pageIndex : current-1,
                pageSize,
            },
        });
        dispatch({
            type: 'materialManage/query',
            payload: {
                pageIndex : current-1,
                pageSize,
                ...searchData,
            },
        });
    };

    //表格点击筛选
    let tableOnFilter = function() {
        dispatch({
            type: 'materialManage/updateState',
            payload:{
                searchVisible:!searchVisible,
            }
        });
    };


    //列表选中项变更时事件
    let tableRowSelectChange = function(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'materialManage/updateState',
            payload: {
                selectedRowKeys,
                selectedRows
            },
        });
    };


    //列表行是否能选中
    let tableRowCheckProps = function(record ) {
        return true;
    };


    //查询框清除条件
    let searchReset = function() {
        dispatch({
            type: 'materialManage/updateState',
            payload: {
                searchData : {}
            },
        });
        dispatch({
            type: 'materialManage/queryMaterialsList',
            payload: {
                searchData : {}
            },
        });
    };

   //查询功能
   let searchSubmit = function(data) {    //查询框点击查询;
        dispatch({
            type: 'payWay/updateState',
            payload: {
                searchData:data,
            },
        });
        dispatch({
            type: 'materialManage/queryMaterialsList',
            payload: {
                ...data,
                pageIndex : 0,
                pageSize,
            },
        });

    };

     //表格批量删除
    function deleteMaterialList() {
        let id = '';
        let status = '0';
        //let tenantId = '127';
        if(selectedRows && selectedRows.length > 0) {
            selectedRows.map(function(item) {
                id += item.id + ',';
            });
            id = id.substring(0,id.length-1);
        }
        if(id != '') {
            dispatch({
                type: 'materialManage/deleteMaterialsList',
                payload: {
                    id,
                    status,
                },
            });
        }
    };

    //新增数据
    function tableOnAdd(){
        dispatch({
            type: 'materialManage/updateState',
            payload : {
                formLoading : false,
                addFormVisible : true,
            }
        })

    }

      let addMaterialCancel = function(){            //新增点击取消按钮
        dispatch({
            type:'materialManage/updateState',
            payload:{
                addFormVisible : false,
                formLoading : false,
            }

        });

    }
     let addMaterialSubmit = function(data){        //新增提交
        dispatch({
            type:'materialManage/updateState',
            payload:{
                formLoading : true,
            }
        });
        dispatch({
            type: 'materialManage/addMaterialsList',
            payload: {
                ...data
            }
        });
    }


    let editMaterialManageList = function(data){        //打开编辑页面
        let content = {};
        content.id = data.id;
        content.orgId = data.orgId;
        dispatch({
            type: 'materialManage/getMaterialsMessage',
            payload:{
                ...content,
            }
        })
    }

    let editMaterialManageCancel= function(){            //编辑点击取消按钮
        dispatch({
            type:'materialManage/updateState',
            payload:{
                editFormVisible : false,
                formLoading : false,
            }

        });

    }

    let editMaterialManageSubmit = function(data){
         dispatch({
            type:'materialManage/updateState',
            payload:{
                formLoading : true,
            }
        });
        dispatch({
            type: 'materialManage/updateMaterialsList',
            payload: {
                ...data
            }
        });

    }



    let materialManageSearchProps = {
        searchData,
        searchVisible,
        searchReset,
        searchSubmit,
    };


    let materialManageListProps = {
        loading,
        lists,
        listTotal,
        pageIndex,
        pageSize,
        tablePageChange,
        tableOnFilter,
        tableRowSelectChange,
        tableRowCheckProps,
        selectedRowKeys,
        deleteMaterialList,
        tableOnAdd,
        editMaterialManageList,
    };



    let addMaterialsManageProps = {
        loading,
        addFormVisible,        //新增弹框是否显示
        formLoading,     //新增提交按钮
        addMaterialCancel,
        addMaterialSubmit,
    }

     let editMaterialsManageProps = {
        loading,
        editFormVisible,       //编辑弹框是否显示
        formLoading,
        editMaterialManageCancel,
        editMaterialManageSubmit,
        modalAllContent,       //获得页信息
    }

    return (
        <div style={{width:'100%',height:'100%',padding:'20px'}}>
           <QueueAnim
                type={['top', 'top']}
                ease={['easeOutQuart', 'easeInOutQuart']}
                className="common-search-queue" >

				{searchVisible ? [
                   <MaterialManageSearch {...materialManageSearchProps} key="search_queue"/>
                ]:null}
            </QueueAnim>

            <MaterialManageList {...materialManageListProps} />
            <AddMaterialManage {...addMaterialsManageProps} />
            <EditMaterialManage {...editMaterialsManageProps} />
        </div>
  );
}

function mapStateToProps({ materialManage }) {
  return { materialManage };
}

export default connect(mapStateToProps)(MaterialManage);
