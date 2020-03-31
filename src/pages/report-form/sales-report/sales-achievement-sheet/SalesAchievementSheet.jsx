import React from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import SalesAchievementSheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import SalesAchievementSheetTable from '../../../../components/report-form/sales-report/sales-achievement-sheet/SalesAchievementTable';
function SalesAchievementSheet({ dispatch, salesAchievementSheet }){

    let {
        modalBoxAppears,
        updateshow,
        content,
        firstEnter,                     //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        /*列表*/
        tableLoading,                   //列表加载状态
        topAllData,                     //总计列表数据
        tableDataSource,                //列表数据
        tableTotal,                     //列表条数
        tablePageIndex,                 //列表页码
        tablePageSize,                  //列表每页条数
        sortParams,                     //排序方式
        exportSearchContent,            //报表导出条件(没有分页信息)

        buttonLoading,                  //生成报表按钮加载状态
        startTime,
        endTime,
        dataSelectValue,     //是否自定义选择时间格式
        updateDate,
        startDate,
        endDate,
    } = salesAchievementSheet;

    function dp(path, obj){
		dispatch({
			type : path,
			payload : {
				...obj
			}
		});
    }
    //获取开始时间
  function getEndDate(dateString) {
        dispatch({
            type:'salesAchievementSheet/updateDate',
            payload:{
                endDate: dateString
            }
        });
    }
    //点击云数据触发时
    function onconfirmDeptOrg(coleback,shutback) {
        dispatch({
            type: 'salesAchievementSheet/onconfirmDeptOrgSelect',
            payload: {
             coleback,shutback
			}
        })
    }
//获取结束时间
    function getStartDate(dateString) {
        dispatch({
            type:'salesAchievementSheet/updateDate',
            payload:{
                startDate: dateString
            }
        });
    }
    //点击弹框确定
    function affirmBtn(params, colback) {
        dp('salesAchievementSheet/ConfirmDeptOrgSelect', {
            params, colback
        })
    }
    //点击生成报表
    function GeneratingReports(data){
        dp('salesAchievementSheet/updateState', {
            startTime : data.startDate,
            endTime : data.endDate,
        })
        dp('salesAchievementSheet/QueryList',{
            pageIndex : 0,
            pageSize : tablePageSize,
            exportSearchContent : data
        })
    }

    //table分页改变
    function TablePageOnChange(pagination, filters, sorter){
        dp('salesAchievementSheet/QueryList',{
                pageIndex : pagination.current - 1,
                pageSize : pagination.pageSize,
                exportSearchContent,
            }
        );
    }

    let SalesAchievementSheetTopProps = {
        onconfirmDeptOrg,
        content,
        getStartDate,
		getEndDate,
        startDate,
		endDate,
        modalBoxAppears,
        updateDate,
        updateshow,
        dataTotal : tableTotal,
        exportPath : '/crm/hq/report/exportSellerPerforList',
        exportObj : exportSearchContent,
        GeneratingReports,          //点击生成报表
        affirmBtn,
        searchContent : [
            {
                type : 'select' ,
                key : 'sortParam',
                placeholder : '排序方式',
                options : sortParams
            }
        ],
        firstEnter,                 //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        buttonLoading,              //生成报表按钮加载状态
        dataSelectValue,            //是否自定义选择
        rangerPicker : {
            startTime,
            endTime,
        }
    }

    //table整体属性
    let SalesAchievementSheetTableProps = {
        tableLoading,                   //列表加载状态
        topAllData,                     //总计列表数据
        tableDataSource,                //列表数据
        tableTotal,                     //列表条数
        tablePageIndex,                 //列表页码
        tablePageSize,                  //列表每页条数
        TablePageOnChange               //分页改变
    }

    return (
        <div style={{ overflow: 'hidden', height: '100%' }}>
            <SalesAchievementSheetTop {...SalesAchievementSheetTopProps} style={{ marginBottom: 20 }} />
            <SalesAchievementSheetTable {...SalesAchievementSheetTableProps} />
        </div>
    )
};

function mapStateToProps ({ salesAchievementSheet }){
	return { salesAchievementSheet };
};

export default connect( mapStateToProps )( SalesAchievementSheet );
