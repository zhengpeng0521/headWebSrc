import React from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import TeacherSalatySheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import TeacherSalatySheetTable from '../../../../components/report-form/teaching-report/teacher-salary-sheet/TeacherSalatySheet';
import moment from 'moment';
function TeacherSalatySheet({ dispatch, teacherSalatySheet }){

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
        exportSearchContent,            //报表导出条件(没有分页信息)

        buttonLoading,                  //生成报表按钮加载状态

    } = teacherSalatySheet;

    function dp(path, obj){
		dispatch({
			type : path,
			payload : {
				...obj
			}
		});
    }
    //点击云数据触发时
    function onconfirmDeptOrg(coleback,shutback) {
        dispatch({
            type: 'teacherSalatySheet/onconfirmDeptOrgSelect',
            payload: {
             coleback,shutback
			}
        })
    }
      //获取开始时间
      function getStartDate(dateString) {
        dispatch({
            type:'teacherSalatySheet/updateDate',
            payload:{
                startDate: dateString
            }
        });
    }
//获取结束时间
function getEndDate(dateString) {
        dispatch({
            type:'teacherSalatySheet/updateDate',
            payload:{
                endDate: dateString
            }
        });
}
    //点击弹框确定
    function affirmBtn(params, colback) {
        dp('teacherSalatySheet/ConfirmDeptOrgSelect', {
            params, colback
        })
    }
    //点击生成报表
    function GeneratingReports(data){
        dp('teacherSalatySheet/QueryList',{
            pageIndex : 0,
            pageSize : tablePageSize,
            exportSearchContent : data
        })
    }

    //table分页改变
    function TablePageOnChange(pageIndex,pageSize){
        dp('teacherSalatySheet/QueryList',{
            pageIndex : pageIndex - 1,
            pageSize : pageSize,
            exportSearchContent
        })
    }

    let TeacherSalatySheetTopProps = {
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
        exportPath : '/crm/hq/exportTeacherSalary',
        exportObj : exportSearchContent,
        GeneratingReports,              //点击生成报表
        buttonLoading,                  //生成报表按钮加载状态
        firstEnter,                     //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    }

    //table整体属性
    let TeacherSalatySheetTableProps = {
        //小屏下table
        sTable: {
            loading : tableLoading,
            dataSource : tableDataSource,
            rowKey : 'uid',
            height : 297,
            xScroll : 1200,
        },
        //大屏下table
        lTable : {
            loading : tableLoading,
            dataSource : tableDataSource,
            rowKey : 'uid',
            height : 253,
            xScroll : 1200,
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
    }

    return (
        <div style = {{ overflow : 'hidden' , height : '100%' }}>
            <TeacherSalatySheetTop { ...TeacherSalatySheetTopProps } style = {{ marginBottom : 20 }}/>
            <TeacherSalatySheetTable {...TeacherSalatySheetTableProps} />
        </div>
    )
};

function mapStateToProps ({ teacherSalatySheet }){
	return { teacherSalatySheet };
};

export default connect( mapStateToProps )( TeacherSalatySheet );
