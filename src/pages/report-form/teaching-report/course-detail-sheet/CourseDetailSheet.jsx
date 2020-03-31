import React from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import CourseDetailSheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import CourseDetailSheetTable from '../../../../components/report-form/teaching-report/course-detail-sheet/CourseDetailSheetTable';

function CourseDetailSheet({ dispatch, courseDetailSheet }){

    let {
        firstEnter,                     //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        /*列表*/
        tableLoading,                   //列表加载状态
        tableDataSource,                //列表数据
        tableTotal,                     //列表条数
        tablePageIndex,                 //列表页码
        tablePageSize,                  //列表每页条数
        exportSearchContent,            //报表导出条件(没有分页信息)

        buttonLoading,                  //生成报表按钮加载状态

    } = courseDetailSheet;

    function dp(path, obj){
		dispatch({
			type : path,
			payload : {
				...obj
			}
		});
	}

    //点击生成报表
    function GeneratingReports(data){
        dp('courseDetailSheet/QueryList',{
            pageIndex : 0,
            pageSize : tablePageSize,
            exportSearchContent : data
        })
    }

    //列表分页改变
    function TablePageOnChange(pageIndex,pageSize){
        dp('courseDetailSheet/QueryList',{
            pageIndex : pageIndex - 1,
            pageSize : pageSize,
            exportSearchContent
        })
    }

    let CourseDetailSheetTopProps = {
        dataTotal : tableTotal,
        exportPath : '/crm/hq/stuCardDetail/detailExport',
        exportObj : exportSearchContent,
        GeneratingReports,              //点击生成报表
        buttonLoading,                  //生成报表按钮加载状态
        firstEnter,                     //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    }

    //table整体属性
    let CourseDetailSheetTableProps = {
        //小屏下table
        sTable: {
            loading : tableLoading,
            dataSource : tableDataSource,
            rowKey : 'cardId',
            height : 297,
            xScroll : 1204,
        },
        //大屏下table
        lTable : {
            loading : tableLoading,
            dataSource : tableDataSource,
            rowKey : 'cardId',
            height : 253,
            xScroll : 1204,
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
            <CourseDetailSheetTop { ...CourseDetailSheetTopProps } />
            <CourseDetailSheetTable {...CourseDetailSheetTableProps} />
        </div>
    )
};

function mapStateToProps ({ courseDetailSheet }){
	return { courseDetailSheet };
};

export default connect( mapStateToProps )( CourseDetailSheet );
