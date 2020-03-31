import React from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import StuAttendanceSheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import StuAttendanceSheetTable from '../../../../components/report-form/teaching-report/stu-attendance-sheet/StuAttendanceSheetTable';
import moment from 'moment';
function StuAttendanceSheet({ dispatch, stuAttendanceSheet }){

    let {
        modalBoxAppears, //模块数据
        updateshow,     //判断哪个按钮出现
        content,        //时间出现
        updateDate,     //更新云数据
        startDate,      //开始时间
        endDate,        //结束时间
        firstEnter,                     //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        /*列表*/
        tableLoading,                   //列表加载状态
        tableDataSource,                //列表数据
        tableTotal,                     //列表条数
        tablePageIndex,                 //列表页码
        tablePageSize,                  //列表每页条数
        sortParams,                     //下拉列表内容
        tabKey,                         //tab默认值
        exportSearchContent,            //报表导出条件(没有分页信息)

        buttonLoading,                  //生成报表按钮加载状态
        newColumns,                     //用来筛选显示行的数组

    } = stuAttendanceSheet;

    function dp(path, obj){
		dispatch({
			type : path,
			payload : {
				...obj
			}
		});
	}

    /*改变表格显示项*/
	function changeColumns( newColumns ){
		dp('stuAttendanceSheet/updateState',{
            newColumns : newColumns
		})
	}
//获取开始时间
function getEndDate(dateString) {
        dispatch({
            type:'stuAttendanceSheet/updateDate',
            payload:{
                endDate: dateString
            }
        });
    }
     //点击云数据触发时
     function onconfirmDeptOrg(coleback,shutback) {
        dispatch({
            type: 'stuAttendanceSheet/onconfirmDeptOrgSelect',
            payload: {
             coleback,shutback
			}
        })
    }
//获取结束时间
    function getStartDate(dateString) {
        dispatch({
            type:'stuAttendanceSheet/updateDate',
            payload:{
                startDate: dateString
            }
        });
    }
    //点击弹框确定
    function affirmBtn(params, colback) {
        dp('stuAttendanceSheet/ConfirmDeptOrgSelect', {
            params, colback
        })
    }
    //点击生成报表
    function GeneratingReports(data){
        dp('stuAttendanceSheet/QueryList',{
            pageIndex : 0,
            pageSize : tablePageSize,
            tabKey : data.tabKey,
            exportSearchContent : data
        })
    }

    //列表分页改变
    function TablePageOnChange(pageIndex,pageSize){
        dp('stuAttendanceSheet/QueryList',{
            pageIndex : pageIndex - 1 ,
            pageSize,
            tabKey,
            exportSearchContent
        });
    }

    let StuAttendanceSheetTopProps = {
        onconfirmDeptOrg,
        modalBoxAppears,//模态框出现
        affirmBtn, //点击确认的方法
        content,    //云数据时间
        getStartDate,//更新开始时间的方法
		getEndDate,  //更新结束时间的方法
        startDate,//开始时间参数
		endDate,    //结束时间参数
        updateDate,//开始时间参数
        updateshow,//判断哪个按钮出现
        dataTotal : tableTotal,
        exportPath : `/crm/hq/report/exportBy${tabKey}`,
        exportObj : exportSearchContent,
        GeneratingReports,      //点击生成报表
        searchContent : [
            {
                type : 'select' ,
                key : 'tabKey',
                placeholder : '排序方式',
                render_key : 'key',
                render_value : 'label',
                options : sortParams
            }
        ],
        buttonLoading,          //生成报表按钮加载状态
        firstEnter,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    }

    //table整体属性
    let StuAttendanceSheetTableProps = {
        tabKey,
        //小屏下table
        sTable : {
            loading : tableLoading,
            dataSource : tableDataSource,
            progressContent : '统计中',
            height : 297,
            xScroll : tabKey =='Plan'? 2000 :900,
            newColumns    : newColumns,
			changeColumns : changeColumns,
        },
        //大屏下table
        lTable : {
            loading : tableLoading,
            dataSource : tableDataSource,
            progressContent : '统计中',
            height : 253,
            xScroll : tabKey =='Plan'? 2000 :900,
            newColumns    : newColumns,
			changeColumns : changeColumns,
        },
        pagination : {
            total : tableTotal,
            pageIndex : tablePageIndex,
            pageSize : tablePageSize,
            onChange : TablePageOnChange,
            onShowSizeChange : TablePageOnChange,
            showSizeChanger : true,
            showQuickJumper : true,
            showTotal : () => (`共${tableTotal}条`),
        }
    };

    return (
        <div style = {{ overflow : 'hidden' , height : '100%' }}>
            <StuAttendanceSheetTop { ...StuAttendanceSheetTopProps } />
            <StuAttendanceSheetTable {...StuAttendanceSheetTableProps} />
        </div>
    )
};

function mapStateToProps ({ stuAttendanceSheet }){
	return { stuAttendanceSheet };
};

export default connect( mapStateToProps )( StuAttendanceSheet );
