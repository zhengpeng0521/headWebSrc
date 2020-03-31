import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button, Modal } from 'antd';
import { StatusFlag, NewModal } from '../../../components/common/new-component/NewComponent';
import OrderClassSearch from '../../../components/erp/order-class/OrderClassSearch';
import OrderClassTable from '../../../components/common/new-component/manager-list/ManagerList';
import OrderClassDetail from './OrderClassDetailPage';
import ClassScheduleContentComponent from '../../../components/erp/order-class/ClassScheduleContentComponent';

import styles from './OrderClassPage.less';

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

function OrderClassPage({ dispatch, orderClassModel }){
    let {
		orgId,

		courseList,
		classRoomList,
		studentList,
		teacherList,

		startDate,
		endDate,

		startTime,
		endTime,

		startBeginTime,
		startEndTime,

		currentDate,
		currentTime,

		/*高级搜索*/
		searchVisible,
		classPerformance,
		timePerformance,


		/*列表形式*/
		loading,
		dataSource,
		resultCount,
		pageSize,
		pageIndex,
		newColumns,

    } = orderClassModel;

	/*tab页切换*/
	function changeTab( activeKey ){

	}

	/*常用搜索*/
	function searchFunction( values ){
		dispatch({
			type : 'orderClassModel/searchFunction',
			payload : {
				values
			}
		})
	}

	/*常用重置*/
	function clearFunction(){
		dispatch({
			type : 'orderClassModel/searchFunction',
			payload : {
				values : {
					courseId  : undefined,
					isfull    : undefined,
				}
			}
		})
	}

	/*点击高级搜索显示*/
	function superSearchClick(){
		dispatch({
			type : 'orderClassModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	/*高级搜索*/
	function onSuperSearch( values ){
		dispatch({
			type : 'orderClassModel/onSuperSearch',
			payload : {
				values
			}
		})
	}

	/*高级重置*/
	function onSuperClear(){
		dispatch({
			type : 'orderClassModel/onSuperSearch',
			payload : {
				values : {
					roomId        : undefined,
					mtid           : undefined,
					stuId         : undefined,
					tryStuId      : undefined,
					tryLeadsName  : undefined,
				}
			}
		})
	}

	/*改变表格显示项*/
	function changeColumns( newColumns ){
		dispatch({
			type : 'orderClassModel/updateState',
			payload : {
				newColumns
			}
		})
	}

	/*分页*/
	function pageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'orderClassModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
	}
	function pageIndexChange( pageIndex, pageSize ){
		dispatch({
			type : 'orderClassModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
	}

	let orderClassSearchProps = {
		searchFunction,
		clearFunction,

		courseList,
		classRoomList,
		studentList,
		teacherList,

		/*高级搜索*/
		searchVisible,
		superSearchClick,
		onSuperSearch,
		onSuperClear
	}

	/*点击课表形式*/
	function jumpToClassSchedule(){
		if( startDate == endDate ){
			let newStartDate = new Date( startDate );
			let newEndDate = new Date ( endDate );
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
			newStartDate = getCurrentDate( new Date(newStartTime) );// new Date( newStartTime ).toLocaleDateString();
			newEndDate = getCurrentDate( new Date(newEndTime) ); // new Date( newEndTime ).toLocaleDateString();
			dispatch({
				type : 'orderClassModel/jumpToClassSchedule',
				payload : {
					startDate : newStartDate,
					endDate   : newEndDate,
				}
			})
		}else{
			dispatch({
				type : 'orderClassModel/jumpToClassSchedule',
				payload : {
					startDate,
					endDate,
				}
			})
		}

	}

	/*点击列表形式*/
	function jumpToClassTable(){
		dispatch({
			type : 'orderClassModel/jumpToClassTable',
			payload : {

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

	/*按天*/
	function searchByDay(){
		let startDate = currentDate;
		let endDate = currentDate;
		let timePerformance = 'day';
		dispatch({
			type : 'orderClassModel/searchByTime',
			payload : {
				startDate,
				endDate,
				timePerformance
			}
		})

	}

	/*上一天 上一周*/
	function searchByLastDay(){
		let newStartDate = new Date( startDate );
		let newEndDate = new Date( endDate );
		let newStartTime = newStartDate.getTime();
		let newEndTime = newEndDate.getTime();
		if( timePerformance == 'day' ){
			newStartTime = newStartTime - 1000*60*60*24;
			newEndTime = newEndTime - 1000*60*60*24;
		}else if( timePerformance == 'week' ){
			newStartTime = newStartTime - 1000*60*60*24*7;
			newEndTime = newEndTime - 1000*60*60*24*7;
		}
		newStartDate = getCurrentDate( new Date(newStartTime) );//new Date( newStartTime ).toLocaleDateString();
		newEndDate = getCurrentDate( new Date(newEndTime) );//new Date( newEndTime ).toLocaleDateString();
		dispatch({
			type : 'orderClassModel/searchByTime',
			payload : {
				startDate : newStartDate,
				endDate   : newEndDate
			}
		})
	}

	/*下一天 下一周*/
	function searchByNextDay(){
		let newStartDate = new Date( startDate );
		let newEndDate = new Date( endDate );
		let newStartTime = newStartDate.getTime();
		let newEndTime = newEndDate.getTime();
		if( timePerformance == 'day' ){
			newStartTime = newStartTime + 1000*60*60*24;
			newEndTime = newEndTime + 1000*60*60*24;
		}else if( timePerformance == 'week' ){
			newStartTime = newStartTime + 1000*60*60*24*7;
			newEndTime = newEndTime + 1000*60*60*24*7;
		}

		newStartDate = getCurrentDate( new Date(newStartTime) );// new Date( newStartTime ).toLocaleDateString();
		newEndDate = getCurrentDate( new Date(newEndTime) ); //new Date( newEndTime ).toLocaleDateString();
		dispatch({
			type : 'orderClassModel/searchByTime',
			payload : {
				startDate : newStartDate,
				endDate   : newEndDate
			}
		})
	}

	/*按周*/
	function searchByWeek(){
		let timePerformance = 'week';
		let newStartDate = new Date( startDate );
		let newEndDate = new Date ( endDate );
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
		newStartDate = getCurrentDate( new Date(newStartTime) );// new Date( newStartTime ).toLocaleDateString();
		newEndDate = getCurrentDate( new Date(newEndTime) ); // new Date( newEndTime ).toLocaleDateString();

		dispatch({
			type : 'orderClassModel/searchByTime',
			payload : {
				startDate : newStartDate,
				endDate   : newEndDate,
				timePerformance
			}
		})
	}


	/*显示详情*/
	function showDetail( item ){
		dispatch({
			type : 'orderClassDetailModel/showDetail',
			payload : {
				item,
				orgId,
			}
		})
	}

	function onCreateSchedule(){

	}

	/*课程列表形式参数*/
	let orderClassTableProps = {
		table : {
            loading       : loading,
            dataSource    : dataSource,
			xScroll       : 1250,
			height        : 289,
			newColumns    : newColumns,
			changeColumns : changeColumns,
            columns : [
                {
					dataIndex : 'studyDate',
					key       : 'studyDate',
					title     : '日期',
					width     : 154,
					render    : ( text, record ) => (
                        <Popover placement = "top" content = { record.studyDate + ' ' + record.weekDay } trigger = 'hover' >
							{ record.studyDate + ' ' + record.weekDay }
                        </Popover>
					)
				},{
					dataIndex : 'time',
					key       : 'time',
					title     : '时间段',
					width     : 112,
					render    : ( text, record ) => (
						<span>
							{ record.startTime + '~' + record.endTime }
						</span>
					)
				},{
					dataIndex : 'title',
					key       : 'title',
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
					title     : '课程名称',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'process',
					key       : 'process',
					title     : '进度',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
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
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'cost',
					key       : 'cost',
					title     : '消耗课时',
					width     : 96,
				},{
					dataIndex : 'num',
					key       : 'num',
					title     : '上课人数',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ record.num + '/' + record.maxNum }</span>
					)
				},{
					dataIndex : 'lineNum',
					key       : 'lineNum',
					title     : '排队人数',
					width     : 96,
				},{
					dataIndex : 'mulNum',
					key       : 'mulNum',
					title     : '补课人数',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ record.mulNum + '/' + record.maxMulNum }</span>
					)
				},{
					dataIndex : 'tryNum',
					key       : 'tryNum',
					title     : '试听人数',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ record.tryNum + '/' + record.maxTryNum }</span>
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

	let disabled = currentDate == startDate && currentDate == endDate;

    return (
		<div style = {{ overflowX : 'hidden', height : '100%' }}>
			<OrderClassSearch { ...orderClassSearchProps } />
			<div className = { styles.order_class_header }>
                <div className = { styles.order_class_header_left }></div>
				<div className = { styles.order_class_header_time }>
					<a className = { styles.last_day } onClick = { () => searchByLastDay() }>{ timePerformance == 'day' ? '上一天' : '上一周' } </a>
					<span className = { styles.current_day }>
						{ startDate == endDate ? startDate : startDate + '~' + endDate }
						{ classPerformance == 'table' &&
							<a onClick = { searchByDay } disabled = { disabled } className = 'back_current_day'>( 返回今天 )</a>
						}
					</span>
					<a className = { styles.next_day } onClick = { searchByNextDay }>{ timePerformance == 'day' ? '下一天' : '下一周' }</a>
				</div>
				{ classPerformance == 'table' &&
					<ButtonGroup className = { styles.order_class_header_right }>
						<Button style = {{ padding : '0 14px' }} type = { timePerformance == 'day' ? 'primary' : '' } onClick = { searchByDay } >按天</Button>
						<Button style = {{ padding : '0 14px' }} type = { timePerformance == 'week' ? 'primary' : '' } onClick = { searchByWeek } >按周</Button>
					</ButtonGroup>
				}
			</div>
			{ classPerformance == 'table' &&
				<div>
					<OrderClassTable { ...orderClassTableProps } />
				</div>
			}
			<OrderClassDetail />
		</div>
    )
};

function mapStateToProps ({ orderClassModel }){
	return { orderClassModel };
};

export default connect( mapStateToProps )( OrderClassPage );
