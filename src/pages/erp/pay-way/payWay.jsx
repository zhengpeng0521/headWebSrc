import React from 'react';
import PayWayList from '../../../components/erp/pay-way/payWay';
import PayWayAdd from '../../../components/erp/pay-way/newAdd';
import PayWayEdit from '../../../components/erp/pay-way/editPayWay';
import PayWaySearch from '../../../components/erp/pay-way/payWaySearch';

import QueueAnim from 'rc-queue-anim';

import { connect } from 'dva';

function PayWay({ dispatch, payWay }) {

    let {
        pageIndex,
        pageSize,
        searchVisible,  //搜索框是否显示
        loading,          //表格加载
        searchData,       //搜索时的参数
        lists,            //列表数据
        listTotal,        //列表数据总数
        selectedRowKeys,  //指定选中项的 key 数组
        selectedRows,     //指定选中项
        selectRowIds,     //选中项的id;
        formLoading,      //表单按钮加载
        formVisible,      //编辑表单展示
        addFormVisible,   //新增页面是否显示
        editFormVisible,  //编辑页面是否显示
        detailList,       //新增页面数据展示
        formData,          //表单数据
        selectContent,     //下拉框列表数据

        editSelectContent,  //编辑下拉框列表数据
        selectModalVisible, //覆盖校区多选框是否可见
        selectOrgs,


        modalValue,          //下拉框改变时获得当前下拉框的值
        modalValueId,             //每次改变下拉框获得名称
        modalAllContent,     //进入编辑页面时获取的信息
        itemId,             //编辑时当前项的ID
    } = payWay;

     //有关校区选择框
    function onOpenSelectOrgModal() {
        dispatch({
            type: 'payWay/updateState',
            payload:{
                selectModalVisible : true,
            }
        });
    }
    function onSelectOrgModalClose() {
        dispatch({
            type: 'payWay/updateState',
            payload : {
                selectModalVisible : false,
            }
        });
    }

    function afterSelectOrgModal(org_select) {
        dispatch({
            type: 'payWay/afterSelectOrgModalSubmit',
            payload : {
                selectOrgs: org_select,
            }
        });
    }

        //列表分页 变更
    let tablePageChange = function(current, pageSize=payWay.pageSize) {
        dispatch({
            type: 'payWay/updateState',
            payload: {
                pageIndex : current-1,
                pageSize,
            },
        });
        dispatch({
            type: 'payWay/afterOperation',
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
            type: 'payWay/updateState',
            payload:{
                searchVisible:!searchVisible,
            }
        });
    };


    //列表选中项变更时事件
    let tableRowSelectChange = function(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'payWay/updateState',
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


    //表格批量删除
    function deletePayWay() {
        let id = '';
        if(selectedRows && selectedRows.length > 0) {
            selectedRows.map(function(item) {
                id += item.id + ',';
            });
            id = id.substring(0,id.length-1)
        }
        if(id != '') {
            dispatch({
                type: 'payWay/deletePayWay',
                payload: {
                    id,
                },
            });
        }
    };


    //查询框清除条件
    let searchReset = function() {
        dispatch({
            type: 'payWay/updateState',
            payload: {
                searchData : {},
                pageIndex,
            },
        });
        dispatch({
            type: 'payWay/afterOperation',
            payload: {
                pageIndex,
                pageSize,
            },
        });
    };

   //查询框点击查询;
    let searchSubmit = function(data) {
        dispatch({
            type: 'payWay/updateState',
            payload: {
                searchData:data,
            },
        });
        dispatch({
            type: 'payWay/afterOperation',
            payload: {
                ...data,
                pageIndex : 0,
                pageSize,
            },
        });
    };


    let tableOnAdd = function() {           //新增表单显示
        dispatch({
            type: 'payWay/payWaySelect',    //获取下拉框内容成功后显示新增页面
        });

    };

    let payWaySubmit = function(data){        //新增提交
        dispatch({
            type:'payWay/updateState',
            payload:{
                formLoading : true,
            }
        });
        dispatch({
            type: 'payWay/newAddPayWay',       //调取新增
            payload: {
                ...data
            }
        });
    }

    let payWayCancel = function(){            //新增点击取消按钮
        dispatch({
            type:'payWay/updateState',
            payload:{
                addFormVisible : false,
                formLoading : false,
            }

        });

    }


     let editPayWay = function(id) {             //编辑表单显示
        dispatch({
            type:'payWay/updateState',
            payload:{
                itemId:id,
            }
        });
        dispatch({
            type: 'payWay/editpayWayConent',
            payload:{
                id,
            }
        });
     };


      let editPayWaySubmit = function(data){        //编辑提交
        data.id = itemId;
        dispatch({
            type:'payWay/updateState',
            payload:{
                formLoading : true,
            }
        });
        dispatch({
            type: 'payWay/editUpdatePayWay',
            payload: {
                ...data
            }
        });
    }

    let editPayWayCancel = function(record){    //编辑点击取消按钮
        dispatch({
            type:'payWay/updateState',
            payload:{
                editFormVisible : false,
                formLoading : false,
            }

        });

    }

    let selectChange = function(id){           //支付方式下拉框改变触发事件
        let title = '';
        let titleId = '';
        for(let i in selectContent){
            if(id == selectContent[i].key){
                title = selectContent[i].value;
                titleId = selectContent[i].key;
                break;
            }
        }
        dispatch({
            type:'payWay/updateState',
            payload:{
               modalValue : title,
               modalValueId : titleId,
            }
        });
    }

    let payWaySearchProps = {
        searchData,
        searchVisible,
        searchReset,
        searchSubmit,
    };


    let payWayListProps = {
        loading,
        lists,
        listTotal,
        pageIndex,
        pageSize,
        tablePageChange,
        tableOnFilter,
        tableRowSelectChange,
        tableRowCheckProps,
        deletePayWay,
        tableOnAdd,      //新增
        editPayWay,      //点击校区进行编辑
        selectedRowKeys,
    };

    let payWayAddProps = {     //新增
        loading,
        detailList,
        addFormVisible,        //新增弹框是否显示
        formLoading,

        payWayCancel,          //新增取消按钮
        payWaySubmit,          //新增提交按钮

        selectContent,         //下拉框列表数据
        selectChange,           //下拉框改变事件

        modalValue,             //每次改变下拉框获得名称
        modalValueId,             //每次改变下拉框获得名称

        onOpenSelectOrgModal,
        onSelectOrgModalClose,
        afterSelectOrgModal,
        selectModalVisible ,
        selectOrgs,
    };
   let payWayEditProps = {      //编辑
        loading,
        formLoading,

        editFormVisible,       //编辑弹框是否显示

        editPayWayCancel,      //编辑取消按钮
        editPayWaySubmit,      //编辑提交按钮

        onOpenSelectOrgModal,   //覆盖校区
        onSelectOrgModalClose,
        afterSelectOrgModal,
        selectModalVisible ,
        selectOrgs,

        selectContent,         //下拉框列表数据
        modalAllContent,        //进入编辑页面获得所有信息
        selectChange,           //下拉框改变事件
        modalValue,             //每次改变下拉框获得名称
        modalValueId,             //每次改变下拉框获得名称
        itemId,             //编辑时当前项的ID
    };


    return (
        <div style={{width:'100%',height:'100%',padding:'20px'}}>
           <QueueAnim
                type={['top', 'top']}
                ease={['easeOutQuart', 'easeInOutQuart']}
                className="common-search-queue" >

				{searchVisible ? [
                   <PayWaySearch {...payWaySearchProps} key="search_queue"/>
                ]:null}
            </QueueAnim>

            <PayWayList {...payWayListProps} />
            <PayWayAdd {...payWayAddProps} />
            <PayWayEdit {...payWayEditProps} />
        </div>
  );
}


function mapStateToProps({ payWay }) {
  return { payWay };
}

export default connect(mapStateToProps)(PayWay);
