import React from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { message } from 'antd';
import { getSsToken } from '../../../../utils/getSsToken';
import TimeMonthTop from '../../../../components/report-form/teaching-report/time-month-knot-sheet/TimeMonthTop';
import TimeMonthTable from '../../../../components/report-form/teaching-report/time-month-knot-sheet/TimeMonthTable';

function TimeMonthKnotSheet({ dispatch, timeMonthKnotSheet }){

    let {
        buttonLoading,            //按钮loading
        month,                    //月份
        orgIds,
        tenantIds,

        pageIndex,
        pageSize,
        resultCount,
        dataSource,
        loading,

    } = timeMonthKnotSheet;

    //选择校区
	function selectOrgName( obj ){
        let tenantIds = obj['tenantId-orgId'] && obj['tenantId-orgId'].split('-')[0];
        let orgIds = obj['tenantId-orgId'] && obj['tenantId-orgId'].split('-')[1];
		dispatch({
			type : 'timeMonthKnotSheet/updateState',
			payload : {
				orgIds,
				tenantIds,
			}
		})
	}

    //选择月份
	function changeMonth( date, dateString ){
		dispatch({
			type : 'timeMonthKnotSheet/updateState',
			payload : {
				month : dateString
			}
		})
    }

    //生成报表
	function generatingReports(){
		dispatch({
			type : 'timeMonthKnotSheet/queryList',
			payload : {
                month,
                tenantIds,
                orgIds,
			}
		})
    }

    //导出
    function exportReports(){
		let exportSearchContent = {
			month,
            orgIds,
            tenantIds
		}

        let exportPath = '/crm/hq/report/resultForMonth';
        if( dataSource.length <= 0 ){
            return message.warn('无查询结果可导出');
        }

		let sstoken = getSsToken();

        window.excelExport( exportPath, exportSearchContent );
	}

    //分页
	function paginationChange( pageIndex, pageSize ){
		dispatch({
			type : 'timeMonthKnotSheet/paginationChange',
			payload : {
				pageIndex, pageSize
			}
		})
	}

    //头部
    let TimeMonthTopProps = {
        buttonLoading,           //按钮loading

        //方法
        selectOrgName,           //选择校区
        changeMonth,             //选择月份
        generatingReports,       //生成报表
        exportReports,           //导出报表
    }

    //表格
    let TimeMonthTableProps = {
        pageIndex,
        pageSize,
        resultCount,
        dataSource,
        loading,

        //方法
        paginationChange,
    }

    return (
        <div className = 'wyp_classMonthKnotSheet_table'>
        	<TimeMonthTop {...TimeMonthTopProps} />
            <div style={{borderTop:'4px solid #5d9cec'}}>
                <TimeMonthTable { ...TimeMonthTableProps } />
            </div>
        </div>
    )
}

function mapStateToProps ({ timeMonthKnotSheet }){
	return { timeMonthKnotSheet };
};

export default connect( mapStateToProps )( TimeMonthKnotSheet );
