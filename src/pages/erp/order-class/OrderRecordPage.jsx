import React from 'react';
import QueueAnim from 'rc-queue-anim';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button, Modal } from 'antd';
import { StatusFlag, NewModal } from '../../../components/common/new-component/NewComponent';
import OrderRecordSearch from '../../../components/erp/order-class/order-record/OrderRecordSearch';
import OperationBar from '../../../components/erp/order-class/order-record/OperationBar';
import OrderRecordTable from '../../../components/common/new-component/manager-list/ManagerList';

//import UpdateStatusModal from '../../../components/erp/order-class/order-record/UpdateStatusModal';
import UpdateFixModal from '../../../components/erp/order-class/order-record/UpdateFixModal';

import styles from './OrderRecordPage.less';

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

function OrderRecordPage({ dispatch, orderRecordModel }){
    let {

		/*高级搜索*/
		searchVisible,

		courseList,
		classRoomList,
		teacherList,

		currentDate,
		startDate,
		endDate,
		radioGroupValue,
		selectedRowKeys,
		selectedRows,

		/*表格*/
		dataSource,
		loading,
		newColumns,
		resultCount,
		pageIndex,
		pageSize,


		updateStatusVisible,
		updateFixVisible,

    } = orderRecordModel;

	/*常用搜索*/
	function searchFunction(values){
        if(!!values && !!values.dept_org){
            values.tenantIds = values.dept_org.substr(0,values.dept_org.indexOf('-'));
            values.orgIds = values.dept_org.substr(values.dept_org.indexOf('-') + 1);
            values.orgId = values.dept_org.substr(values.dept_org.indexOf('-') + 1);
            delete values.dept_org;
        }
		dispatch({
			type : 'orderRecordModel/searchFunction',
			payload : {
				values
			}
		})
	}

	/*常用重置*/
	function clearFunction(){
		dispatch({
			type : 'orderRecordModel/searchFunction',
			payload : {
				values : {
					courseName  : undefined,
					mtName      : undefined,
                    orgId       : undefined,
					orgIds      : undefined,
                    tenantIds   : undefined
				}
			}
		})
	}

	/*点击高级搜索显示*/
	function superSearchClick(){
		dispatch({
			type : 'orderRecordModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	/*高级搜索*/
	function onSuperSearch( values ){
        console.info(values)
        let startTime = values && values.startTime && moment(values.startTime._d).format('HH:mm') || undefined;
        let endTime = values && values.endTime && moment(values.endTime._d).format('HH:mm')|| undefined;
        values.startTime = startTime;
        values.endTime = endTime;
		dispatch({
			type : 'orderRecordModel/onSuperSearch',
			payload : {
				values,
			}
		})
	}

	/*高级重置*/
	function onSuperClear(){
		dispatch({
			type : 'orderRecordModel/onSuperSearch',
			payload : {
				values : {
					roomName        : undefined,
					atName   : undefined,
				}
			}
		})
	}

	/*改变表格显示项*/
	function changeColumns( newColumns ){
		dispatch({
			type : 'orderRecordModel/updateState',
			payload : {
				newColumns
			}
		})
	}

	/*选择表格项*/
	function rowSelectChange( selectedRowKeys, selectedRows ){
		dispatch({
			type : 'orderRecordModel/updateState',
			payload : {
				selectedRowKeys,
				selectedRows
			}
		})
	}

	/*分页*/
	function pageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'orderRecordModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
	}
	function pageIndexChange( pageIndex ){

		dispatch({
			type : 'orderRecordModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
	}

	/*修改状态*/
	function updateStatus(){
		dispatch({
			type : 'orderRecordModel/updateStatus',
			payload : {
			}
		})
	}

	/*修改固定位*/
	function updateFix(){
		dispatch({
			type : 'orderRecordModel/updateState',
			payload : {
				updateFixVisible : true
			}
		})
	}

	function getCurrentDate( date ){
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if( month < 10 ){
			month = '0' + String( month );
		}
		if( day < 10 ){
			day = '0' + String( day );
		}
		return (  year + '-' + month + '-' + day );
	}

	/*上一天 上一周*/
	function searchByLastDay(){
		let newStartDate = new Date( startDate );
		let newEndDate = new Date( endDate );
		let newStartTime = newStartDate.getTime();
		let newEndTime = newEndDate.getTime();
		if( radioGroupValue == 'day' ){
			newStartTime = newStartTime - 1000*60*60*24;
			newEndTime = newEndTime - 1000*60*60*24;
			newStartDate = getCurrentDate( new Date(newStartTime) );//new Date( newStartTime ).toLocaleDateString();
			newEndDate = getCurrentDate( new Date(newEndTime) );//new Date( newEndTime ).toLocaleDateString();
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate
				}
			})
		}else if( radioGroupValue == 'week' ){
			newStartTime = newStartTime - 1000*60*60*24*7;
			newEndTime = newEndTime - 1000*60*60*24*7;
			newStartDate = getCurrentDate( new Date(newStartTime) );//new Date( newStartTime ).toLocaleDateString();
			newEndDate = getCurrentDate( new Date(newEndTime) );//new Date( newEndTime ).toLocaleDateString();
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate
				}
			})
		}else if( radioGroupValue == 'month' ){
			newStartDate = moment( startDate ).subtract(1, 'month').format('YYYY-MM-DD');
			newEndDate = moment( endDate ).subtract(1, 'month').format('YYYY-MM-DD');
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate
				}
			})
		}
	}

	/*下一天 下一周*/
	function searchByNextDay(){
		let newStartDate = new Date( startDate );
		let newEndDate = new Date( endDate );
		let newStartTime = newStartDate.getTime();
		let newEndTime = newEndDate.getTime();
		if( radioGroupValue == 'day' ){
			newStartTime = newStartTime + 1000*60*60*24;
			newEndTime = newEndTime + 1000*60*60*24;
			newStartDate = getCurrentDate( new Date(newStartTime) );// new Date( newStartTime ).toLocaleDateString();
			newEndDate = getCurrentDate( new Date(newEndTime) ); //new Date( newEndTime ).toLocaleDateString();
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate
				}
			})
		}else if( radioGroupValue == 'week' ){
			newStartTime = newStartTime + 1000*60*60*24*7;
			newEndTime = newEndTime + 1000*60*60*24*7;
			newStartDate = getCurrentDate( new Date(newStartTime) );// new Date( newStartTime ).toLocaleDateString();
			newEndDate = getCurrentDate( new Date(newEndTime) ); //new Date( newEndTime ).toLocaleDateString();
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate
				}
			})
		}else if( radioGroupValue == 'month' ){
			newStartDate = moment( startDate ).add(1, 'month').format('YYYY-MM-DD');
			newEndDate = moment( endDate ).add(1, 'month').format('YYYY-MM-DD');
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate
				}
			})
		}
	}

	function OperationQuery( status ){
		if( status == 'backToday' ){
			let startDate = currentDate;
			let endDate = currentDate;
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate,
					endDate,
				}
			})
		}else if( status == 'backToWeek' ){
			let newStartDate = new Date(currentDate);
			let newEndDate = new Date(currentDate);
			let weekday = newStartDate.getDay();
			let newStartTime = newStartDate.getTime();
			let newEndTime = newEndDate.getTime();
			if( weekday == 0 ){
				newStartTime = newStartTime - 1000*60*60*24*6;
				newEndTime = newEndTime;
			}else{
				newStartTime = newStartTime - 1000*60*60*24*( weekday - 1 );
				newEndTime = newEndTime + 1000*60*60*24*( 7 - weekday );
			}
			newStartDate = getCurrentDate( new Date(newStartTime) );
			newEndDate = getCurrentDate( new Date(newEndTime) );
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate,
				}
			})
		}else if( status = 'backToMonth' ){
			let newStartDate = moment( currentDate ).startOf( 'month' ).format('YYYY-MM-DD');
			let newEndDate = moment( currentDate ).endOf('month' ).format('YYYY-MM-DD');
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate
				}
			})
		}
	}

	function RadioGroupOnChange( e ){
		let radioGroupValue = e.target.value;
		if(  radioGroupValue == 'week' ){
			let newStartDate = moment( currentDate ).startOf( 'week' ).format('YYYY-MM-DD');
			let newEndDate = moment( currentDate ).endOf( 'week' ).format('YYYY-MM-DD');
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate,
					radioGroupValue
				}
			})
		}else if( radioGroupValue == 'day' ){
			let startDate = currentDate;
			let endDate = currentDate;
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate,
					endDate,
					radioGroupValue
				}
			})
		}else if( radioGroupValue == 'month' ){
			let newStartDate = moment( currentDate ).startOf( 'month' ).format('YYYY-MM-DD');
			let newEndDate = moment( currentDate ).endOf( 'month' ).format('YYYY-MM-DD');
			dispatch({
				type : 'orderRecordModel/searchByTime',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate,
					radioGroupValue
				}
			})
		}
	}

	/*确认修改固定位*/
	function confirmUpdateFix( values ){
		dispatch({
			type : 'orderRecordModel/confirmUpdateFix',
			payload : {
				values
			}
		})
	}

	/*取消修改固定位*/
	function cancelUpdateFix(){
		dispatch({
			type : 'orderRecordModel/updateState',
			payload : {
				updateFixVisible : false
			}
		})
	}

	let orderRecordSearchProps = {
		searchFunction,
		clearFunction,

		courseList,
		classRoomList,
		teacherList,

		/*高级搜索*/
		searchVisible,
		superSearchClick,
		onSuperSearch,
		onSuperClear
	}

	let OperationBarProps = {
		currentDate,                        //当前日期(只做保存，不做修改)

		startDate,                          //操作改变开始时间
		endDate,                            //操作改变结束时间

		radioGroupValue,                    //radiogroup的值

		selectedRowKeys,                    //复选框选中对象的key数组
		selectedRows,                       //复选框选中对象的数组

		OperationQuery,                     //查询上一天/下一天 上一周/下一周数据

		searchByLastDay,
		searchByNextDay,

		RadioGroupOnChange,

		updateStatus,
		updateFix

	}

	let OrderRecordTableProps = {
		table : {
            loading       : loading,
            dataSource    : dataSource,
			xScroll       : 1350,
			height        : 295,
			newColumns    : newColumns,
			changeColumns : changeColumns,
            columns : [
                {
					dataIndex : 'stuName',
					key       : 'stuName',
					title     : '学员名称',
					width     : 160,
					render    : ( text, record ) => (
						<span>
						{ text || '' }
						{ !!record && record.isBirthday == '1' &&
							<span style = {{ marginLeft : '10px', display : 'inline-block', width : '14px', height : '14px', background : 'url("https://img.ishanshan.com/gimg/img/ac568b9d045c4b79dd24a1958b44e993")', position : 'relative', top : '1px' }}></span>
						}
						{ !!record && record.isFirst == '1' &&
							<span style = {{ marginLeft : '10px', display : 'inline-block', width : '14px', height : '14px', background : 'url("https://img.ishanshan.com/gimg/img/f969de45f4b30cd0abf0f767d83a453b")', position : 'relative', top : '2px' }}></span>
						}
						</span>
					)

				},{
					dataIndex : 'cpTitle',
					key       : 'cpTitle',
					title     : '标题',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'courseName',
					key       : 'courseName',
					title     : '课程',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'clsName',
					key       : 'clsName',
					title     : '约课班级',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'studyDate',
					key       : 'studyDate',
					title     : '日期',
					width     : 154,
					render    : ( text, record ) => (
						<span>
							{ (!!record.studyDate && !!record.weekDay && record.studyDate + ' ' + record.weekDay) || '' }
						</span>
					)
				},{
					dataIndex : 'time',
					key       : 'time',
					title     : '时间段',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ !!record.startTime && !!record.endTime && record.startTime + '~' + record.endTime }</span>
					)
				},{
					dataIndex : 'mtNames',
					key       : 'mtNames',
					title     : '主教',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'roomName',
					key       : 'roomName',
					title     : '教室',
					width     : 96,
				},{
					dataIndex : 'cost',
					key       : 'cost',
					title     : '消耗课时',
					width     : 96,
				},{
					dataIndex : 'fix',
					key       : 'fix',
					title     : '固定位',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ text == '1' ? '是' : '否' }</span>
					)
				},{
					dataIndex : 'signType',
					key       : 'signType',
					title     : '状态',
					width     : 96,
					render    : ( text, record ) => (
                        <div>
                            <p>{ !!text && text == '1' ? '预约' : text == '2' ? '排队' : text == '3' ? '出勤' : text == '4' ? '请假' : text == '5' ? '旷课' : text == '6' ? '取消' : '' }</p>
                            {!!text && text == '6' ?
                            <div style={{color:'#666'}}>
                                { !!record.reason && record.reason=='1'?
                                        <span>操作有误</span>
                                    :
                                    !!record.reason && record.reason=='2'?
                                        <span>节假日放假</span>
                                    :
                                    !!record.reason && record.reason=='3'?
                                        <span>老师请假</span>
                                    :
                                    !!record.reason && record.reason=='4'?
                                        <span>学员调班</span>
                                    :
                                    !!record.reason && record.reason=='5'?
                                        <span>从班级移除</span>
                                    :
                                    !!record.reason && record.reason=='6'?
                                        <span>老师离职</span>
                                    :
                                    null
                                }
                            </div>
                            :null
                          }

                        </div>

					)
				},{
					dataIndex : 'orgName',
					key       : 'orgName',
					title     : '所属校区',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				}
            ],
//			rowSelection : {
//                selectedRowKeys  : selectedRowKeys,
//                onChange         : rowSelectChange,
//            }
         },
		pagination : {
			total            : resultCount,
			pageIndex        : pageIndex,
			pageSize         : pageSize,
			showTotal        : total => `总共 ${total} 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : pageSizeChange,
			onChange         : pageIndexChange
		}
	}


	let updateFixModalProps = {
		updateFixVisible,
		selectedRowKeys,

		cancelUpdateFix,
		confirmUpdateFix
	}

    return (
		<div style = {{ overflow : 'hidden', height : '100%' }} >
			<OrderRecordSearch { ...orderRecordSearchProps } />
			<OperationBar { ...OperationBarProps } />
            <OrderRecordTable { ...OrderRecordTableProps } />
			<UpdateFixModal { ...updateFixModalProps } />
		</div>
    )
};

function mapStateToProps ({ orderRecordModel }){
	return { orderRecordModel };
};

export default connect( mapStateToProps )( OrderRecordPage );
