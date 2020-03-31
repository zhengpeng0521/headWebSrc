import React, { PropTypes } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import StuUseClassChartTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import StuUseClassChartComponent from '../../../../components/report-form/teaching-report/stu-use-class-sheet/StuUseClassCharts';
import { getSsToken } from '../../../../utils/getSsToken';

function StuUseClassChartPage({ dispatch, stuUseClassChartModel }) {
    let {
		firstEnter,

		loading,

		courseList,
        organList,
		birthdayList,
		teacherList,
		salesList,
		counselorList,
		customerList,

		searchContent,
        startTime,
        endTime,
        dataSelectValue,     //是否自定义选择时间格式

    } = stuUseClassChartModel;

	/*点击生成报表*/
	function GeneratingReports( values ){
		dispatch({
			type : 'stuUseClassChartModel/updateState',
			payload : {
				startTime : values.startDate,
            	endTime : values.endDate,
			}
		})
		dispatch({
			type : 'stuUseClassChartModel/generatingReports',
			payload : {
				values
			}
		})
	}

	function exportData( exportPath ){
        if( !searchContent.startDate || !searchContent.endDate ){
            return message.warn('请选择时间范围');
        }
		window.excelExport( exportPath, searchContent )
	}

	/*按课程导出数据*/
	function exportRecordByCourse(){
		let exportPath = '/crm/hq/exportByCourse';
        if( courseList.length == '0' ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

    /*按机构导出数据*/
    function exportByOrgan(){
        let exportPath = '/crm/hq/exportByOrg';
        if( organList.length == '0' ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
    }

	/*按老师导出数据*/
	function exportByTeacher(){
		let exportPath = '/crm/hq/exportByTeacher';
        if( teacherList.length == '0' ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	/*按负责销售导出数据*/
	function exportBySales(){
		let exportPath = '/crm/hq/exportBySeller';
        if( salesList.length == '0' ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	/*按负责顾问导出数据*/
	function exportByCounselor(){
		let exportPath = '/crm/hq/exportByCounselor';
        if( counselorList.length == '0' ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	/*按负责客服导出数据*/
	function exportByCustomer(){
		let exportPath = '/stat/tmk/cerp/costByWait/export';
        if( customerList.length === 0 ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	/*头部 参数*/
	let stuUseClassChartTopProps = {
		firstEnter,

        GeneratingReports,      //点击生成报表
		buttonLoading : loading,
        dataSelectValue,            //是否自定义选择
        rangerPicker : {
            startTime,
            endTime,
        }
	}

	/*报表主体 参数*/
	let stuUseClassChartComponnetProps = {
		loading,

		courseList,
        organList,
		birthdayList,
		teacherList,
		salesList,
		counselorList,
		customerList,

		exportRecordByCourse,            /*按课程导出数据*/
        exportByOrgan,                   /*按机构导出数据*/
		exportByTeacher,                 /*按老师导出数据*/
		exportBySales,                   /*按负责销售导出数据*/
		exportByCounselor,               /*按负责顾问导出数据*/
		exportByCustomer,							   /*按负责客服导出数据*/

	}

    return (
        <div style = {{ height : '100%' }} >
			<StuUseClassChartTop { ...stuUseClassChartTopProps } />
			<StuUseClassChartComponent { ...stuUseClassChartComponnetProps } />
        </div>
  );
}


function mapStateToProps({ stuUseClassChartModel }) {
  return { stuUseClassChartModel };
}

export default connect(mapStateToProps)(StuUseClassChartPage);
