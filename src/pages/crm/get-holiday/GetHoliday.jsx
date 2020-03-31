import React from 'react';
import { message} from 'antd';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import GetHolidaySearchBar from '../../../components/crm/get-holiday/GetHolidaySearchBar';
import GetHolidayTable from '../../../components/crm/get-holiday/GetHolidayTable';
import GetHolidayDealModal from '../../../components/crm/get-holiday/GetHolidayDealModal';

/*请假列表*/
function GetHoliday({dispatch, getHoliday}) {

	let {

        /*searchBar*/
        getHolidaySearchVisible,                //搜索栏是否显示
        getHolidaySearchContent,                //搜索栏搜素内容

        /*table*/
        getHolidayPageIndex,                    //表格页码
        getHolidayPageSize,                     //表格一页多少数据
        getHolidayTableLoading,                 //表格加载状态
        getHolidayTableContent,                 //表格数据
        getHolidayTableTotal,                   //表格数据总数
        getHolidayTableSelectedRowKeys,         //表格多选选中的数组
        getHolidayTableSelectedRow,             //表格多选中的对象数组

        /*请假处理modal*/
        getHolidayDealModalVisible,             //modal是否显示
        getHolidayDealModalButtonLoading,       //modal按钮是否加载状态
        getHolidayDealModalContent,             //modal回填数据(主要用到校区ID和校区name)

    } = getHoliday;

    //请假列表search点击搜索或清除条件
    let GetHolidaySearchSubmit = function(data){
        dispatch({
            type:'getHoliday/GetHolidayList',
            payload:{
                pageIndex : 0,
                pageSize : getHolidayPageSize,
                ...data,
            }
        });
    }

    //分页等信息改变
    let GetHolidayTableOnChangePage = function(pagination, filters, sorter){
        dispatch({
            type:'getHoliday/GetHolidayList',
            payload:{
                pageIndex : pagination.current-1,
                pageSize : pagination.pageSize,
                ...getHolidaySearchContent
            }
        });
    }

    //表格多选状态改变时方法
    let GetHolidayTableRowSelectChange = function(selectedRowKeys, selectedRows){
        dispatch({
            type: 'getHoliday/updateState',
            payload: {
                getHolidayTableSelectedRowKeys : selectedRowKeys,
                getHolidayTableSelectedRow : selectedRows,
            },
        });
    }

    //表格点击筛选
    let ShowOrHideSearchBar = function(){
        dispatch({
            type: 'getHoliday/updateState',
            payload: {
                getHolidaySearchVisible : !getHolidaySearchVisible,
            },
        });
    }

    //表格点击确认处理
    let OpenDealModal = function(){
        if(getHolidayTableSelectedRow.length == 1 && getHolidayTableSelectedRow[0].status == '1'){
            dispatch({
                type: 'getHoliday/updateState',
                payload: {
                    getHolidayDealModalVisible : true,
                    getHolidayDealModalContent : getHolidayTableSelectedRow[0],
                },
            });
        }else if(getHolidayTableSelectedRow.length != 1){
            message.warn('确认时应选中一项');
        }else if(getHolidayTableSelectedRow[0].status != '1'){
            message.warn('请选择"未处理状态"项确认');
        }
    }

    //批量删除请假申请
    let DeleteRequest = function(){
        if(getHolidayTableSelectedRow.length > 0){
            let idArray = [];
            for(let i in getHolidayTableSelectedRow){
                idArray.push(getHolidayTableSelectedRow[i].id)
            }
            dispatch({
                type:'getHoliday/DeleteReq',
                payload:{
                    ids : idArray.join(',')
                }
            });
        }else{
            message.warn('删除时应至少选中一项')
        }
    }

    //请假处理表单提交
    let GetHolidayDealModalSubmit = function(data){
        dispatch({
            type: 'getHoliday/HolidayReqDeal',
            payload: {
                ...data
            },
        });
    }

    //请假处理表单关闭
    let GetHolidayDealModalCancel = function(){
        dispatch({
            type: 'getHoliday/updateState',
            payload: {
                getHolidayDealModalVisible : false,
                getHolidayTableSelectedRowKeys : [],
                getHolidayTableSelectedRow : [],
            },
        });
    }

    /*搜索栏属性*/
    let getHolidaySearchBarProps = {
        GetHolidaySearchSubmit,             //请假列表search点击搜索
    }

    /*table属性*/
    let getHolidayTableProps = {
        getHolidayPageIndex,                    //表格页码
        getHolidayPageSize,                     //表格一页多少数据
        getHolidayTableLoading,                 //表格加载状态
        getHolidayTableContent,                 //表格数据
        getHolidayTableTotal,                   //表格数据总数
        getHolidayTableSelectedRowKeys,         //表格多选选中的数组
        getHolidayTableSelectedRow,             //表格多选中的对象数组

        GetHolidayTableRowSelectChange,         //表格多选状态改变时方法
        GetHolidayTableOnChangePage,            //表格分页等改变时方法
        ShowOrHideSearchBar,                    //表格点击筛选
        OpenDealModal,                          //表格点击确认处理
        DeleteRequest,                          //批量删除请假申请
    }

    /*请假确认表单属性*/
    let getHolidayDealModalProps = {
        getHolidayDealModalVisible,             //modal是否显示
        getHolidayDealModalButtonLoading,       //modal按钮是否加载状态
        getHolidayDealModalContent,             //modal回填数据(主要用到校区ID和校区name)

        GetHolidayDealModalSubmit,              //请假处理表单提交
        GetHolidayDealModalCancel,              //请假处理表单关闭
    }

    return (
        <div>
            <QueueAnim
                type={['top', 'top']}
                ease={['easeOutQuart', 'easeInOutQuart']}
                className="common-search-queue" >
                {getHolidaySearchVisible ?
                    [ <GetHolidaySearchBar {...getHolidaySearchBarProps} key='GetHolidaySearchBar'/>] : null}
            </QueueAnim>
            <GetHolidayTable {...getHolidayTableProps} />
            { getHolidayDealModalVisible == true ? <GetHolidayDealModal {...getHolidayDealModalProps} /> : null }
        </div>
    );
}

function mapStateToProps({ getHoliday }) {
  	return { getHoliday };
}

export default connect(mapStateToProps)(GetHoliday);
