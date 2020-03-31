import React from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ClassRoomRatioSheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import ClassRoomRatioSheetTable from '../../../../components/report-form/teaching-report/class-room-ratio-sheet/ClassRoomRatioSheetTable';

function ClassRoomRatioSheet({ dispatch, classRoomRatioSheetModel }){
    let {
		firstEnter,

		tableLoading,
		tablePageSize,
		tablePageIndex,
		tableTotal,
		tableDataSource,
        buttonLoading,                  //生成报表按钮加载状态

		exportSearchContent

    } = classRoomRatioSheetModel;

	//生成报表 显示列表
	function GeneratingReports(data){
		dispatch({
			type : 'classRoomRatioSheetModel/queryList',
			payload : {
				pageIndex : 0,
                pageSize : tablePageSize,
                exportSearchContent : data
			}
		})
	}

	//分页生成报表 显示列表
	function paginationChange(pageIndex,pageSize){
		dispatch({
			type : 'classRoomRatioSheetModel/queryList',
			payload : {
				pageIndex : pageIndex - 1,
                pageSize : pageSize,
                exportSearchContent
			}
		})
	}

	/*教室利用率报表 头部*/
    let ClassRoomRatioSheetTopProps = {
		firstEnter,
        exportPath : '/crm/hq/erp/stats/SQRoom/exportRoom',
        exportObj : exportSearchContent,
        GeneratingReports,      //点击生成报表
		dataTotal  : tableTotal,
		buttonLoading,                  //生成报表按钮加载状态
    }

	/*教室利用表 列表数据*/
	let ClassRoomRatioSheetTableProps = {
		tableLoading,
		tablePageSize,
		tablePageIndex,
		tableTotal,
		tableDataSource,

		paginationChange
	}

    return (
        <div style = {{ overflow : 'hidden' , height : '100%'}}>
            <ClassRoomRatioSheetTop { ...ClassRoomRatioSheetTopProps } />
			<ClassRoomRatioSheetTable { ...ClassRoomRatioSheetTableProps } />
        </div>
    )
};

function mapStateToProps ({ classRoomRatioSheetModel }){
	return { classRoomRatioSheetModel };
};

export default connect( mapStateToProps )( ClassRoomRatioSheet );
