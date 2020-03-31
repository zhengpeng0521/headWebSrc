import React from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getSsToken } from '../../../../utils/getSsToken';
import { uniqueArr } from '../../../../utils/arrayUtils';
import ClassMonthKnotTop from '../../../../components/report-form/teaching-report/class-month-knot-sheet/ClassMonthKnotTop';
import ClassMonthKnotSheetTable from '../../../../components/report-form/teaching-report/class-month-knot-sheet/ClassMonthKnotSheetTable';
import styles from './ClassMonthKnotSheet.less';

function ClassMonthKnotSheet({ dispatch, classMonthKnotModel }) {
	let {
		modalToVisible,	//模态框的隐藏
		menuOrgList,              //校区下拉列表
		isShowOrgName,            //是否选择了校区
		orgId,                    //所选校区Id
		orgName,                  //所选校区Name
		buttonLoading,            //按钮loading
		month,                    //月份
		queryPeriodMonthTotal,

		pageIndex,                //分页index
		pageSize,                 //分页大小
		resultCount,              //数据总量
		dataSource,               //数据 数组

		loading,
		orgIds,
		tenantIds,
		startDate,
		endDate,
		content,
		shadow

	} = classMonthKnotModel;

	//选择校区
	function selectOrgName(obj) {
		let tenantIds = obj['tenantId-orgId'] && obj['tenantId-orgId'].split('-')[0];
		let orgIds = obj['tenantId-orgId'] && obj['tenantId-orgId'].split('-')[1];
		dispatch({
			type: 'classMonthKnotModel/updateState',
			payload: {
				orgIds,
				tenantIds,
			}
		})
	}

	//点击清除所选orgName
	function clickToClearOrg() {
		dispatch({
			type: 'classMonthKnotModel/updateState',
			payload: {
				orgId: undefined,
				orgName: undefined,
				isShowOrgName: false
			}
		})
	}

	//选择月份
	function changeMonth(date, dateString) {
		dispatch({
			type: 'classMonthKnotModel/updateState',
			payload: {
				month: dateString
			}
		})
	}

	//生成报表
	function generatingReports() {
		dispatch({
			type: 'classMonthKnotModel/queryList',
			payload: {
				month
			}
		})
		dispatch({
			type: 'classMonthKnotModel/queryPeriodMonthTotal',
			payload: {
				month
			}
		})

	}

	//导出报表
	function exportReports() {
		//        let orgIds = [];
		//        let tenantIds = [];
		//
		//        !!window._init_data.orgIdList && window._init_data.orgIdList.map(( item, index ) => {
		//            orgIds.push( item.orgId );
		//            tenantIds.push( item.tenantId );
		//        })
		//        orgIds = uniqueArr( orgIds ).join(',');
		//        tenantIds = uniqueArr( tenantIds ).join(',');

		let exportSearchContent = {
			date: month,
			orgIds,
			tenantIds,
		}
		let exportPath = '/crm/hq/crm/cardReport/exportPeriodMonthList';
		if (dataSource.length <= 0) {
			return message.warn('无查询结果可导出');
		}

		window.excelExport(exportPath, exportSearchContent);
	}
	//更新云数据
	function exportReportsCloud() {
		dispatch({
			type: 'classMonthKnotModel/onconfirmDeptOrgSelect',
			payload: {
			}
		})
	}
	//获取最后时间
	function getEndDate(date, dateString) {
		dispatch({
			type: 'classMonthKnotModel/updateDate',
			payload: {
				endDate: dateString
			}
		})
	}
	//获取开始时间
	function getStartDate(date, dateString) {
		dispatch({
			type: 'classMonthKnotModel/updateDate',
			payload: {
				startDate: dateString
			}
		})
	}
	//确定按钮
	function setModalToVisible() {
		console.log(startDate)
		if (startDate==undefined) {
			dispatch({
				type : 'classMonthKnotModel/updateState',
				payload : {
					modalToVisible: true,
					shadow:true,
				}
			})
		} else {
			dispatch({
				type: 'classMonthKnotModel/confirmDeptOrgSelect',
				payload: {
				}
			})
			dispatch({
				type : 'classMonthKnotModel/updateState',
				payload : {
					modalToVisible: false,
					shadow:false,
				}
			})
		}
	}
	//取消按钮
	function setModalVisible() {
		dispatch({
			type : 'classMonthKnotModel/updateState',
			payload : {
				modalToVisible: false,
				shadow:false
			}
		})
	}
     //会员卡导出
    function exportReportsVip(){
//        let orgIds = [];
//        let tenantIds = [];
//
//        !!window._init_data.orgIdList && window._init_data.orgIdList.map(( item, index ) => {
//            orgIds.push( item.orgId );
//            tenantIds.push( item.tenantId );
//        })
//        orgIds = uniqueArr( orgIds ).join(',');
//        tenantIds = uniqueArr( tenantIds ).join(',');

		let exportSearchContent = {
			date : month,
            orgIds,
            tenantIds,
		}
        let exportPath = '/crm/hq/crm/cardReport/exportCoursePeriodMonthList';
        if( dataSource.length <= 0 ){
            return message.warn('无查询结果可导出');
        }

        window.excelExport( exportPath, exportSearchContent );
    }
	//分页
	function paginationChange( pageIndex, pageSize ){
		dispatch({
			type : 'classMonthKnotModel/paginationChange',
			payload : {
				pageIndex, pageSize
			}
		})
	}

	let classMonthKnotTopProps = {
		modalToVisible,
//		menuOrgList,
		isShowOrgName,            //是否选择了校区
		orgId,                    //所选校区Id
		orgName,                  //所选校区Name
		buttonLoading,            //按钮loading
		month,                    //月份
		shadow,
		selectOrgName,
		clickToClearOrg,          //点击清除所选orgName
		changeMonth,              //选择月份
		generatingReports,        //生成报表
		exportReports,            //导出报表
        exportReportsVip,
		exportReportsCloud,		 //云数据更新
		queryPeriodMonthTotal,
		setModalToVisible,			 //点击时模态框确定，确定按钮
		setModalVisible,
		startDate,
		endDate,	 //点击时模态框确定，取消按钮
		getStartDate,
		getEndDate,
		content

	}

	let classMonthKnotSheetProps = {
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
        	<ClassMonthKnotTop { ...classMonthKnotTopProps } />
            <div style={{borderTop:'4px solid #5d9cec'}}>
			     <ClassMonthKnotSheetTable { ...classMonthKnotSheetProps } />
            </div>
        </div>
    )
};

function mapStateToProps ({ classMonthKnotModel }){
	return { classMonthKnotModel };
};

export default connect( mapStateToProps )( ClassMonthKnotSheet );
