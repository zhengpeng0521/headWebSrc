import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button, Modal } from 'antd';
import { StatusFlag, NewModal } from '../../../components/common/new-component/NewComponent';
import DetailHeader from '../../../components/erp/order-class/order-class-detail/DetailHeader';

import ToClassStuPage from '../../../components/erp/order-class/order-class-detail/ToClassStudent';
import LineStudentPage from '../../../components/erp/order-class/order-class-detail/LineStudent';
import TryStudentPage from '../../../components/erp/order-class/order-class-detail/TryStudent';
import MulStudentList from '../../../components/erp/order-class/order-class-detail/MulStudentList';

import OnceOrderClassModal from '../../../components/erp/order-class/order-class-detail/OnceOrderClassModal';            //单次预约
import OnceOrderTipModal from '../../../components/erp/order-class/order-class-detail/OnceOrderTipModal';                //单次预约提示
import BatchOrderClassModal from '../../../components/erp/order-class/order-class-detail/BatchOrderClassModal';          //批量预约
import BatchOrderClassTipModal from '../../../components/erp/order-class/order-class-detail/BatchOrderClassTipModal';    //批量预约提示
import OrderMissClassModal from '../../../components/erp/order-class/order-class-detail/OrderMissClassModal';            //预约补课
import SubscribeClassModal from '../../../components/erp/order-class/order-class-detail/SubscribeClassModal';            //预约试听

import BatchOrderErrorModal from '../../../components/erp/order-class/order-class-detail/BatchOrderErrorModal';                    //预约异常提示
import BatchOrderClassErrorModal from '../../../components/erp/order-class/order-class-detail/BatchOrderClassErrorModal';          //预约异常提示 ( 批量 )


import styles from './OrderClassDetailPage.less';

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

function OrderClassDetailPage({ dispatch, orderClassDetailModel, refreshSchedule }){
    let {
		detailVisible,               //详情是否显示
		activeKey,                   //当前tab页

		currentDate,
		currentItem,


		/*上课学员*/
		toClassStuDataSource,
		toClassStuLoading,

		/*排队学员*/
		lineStuDataSource,
		lineStuLoading,

		/*补课学员*/
		mulStudentDataSource,
		mulStudentLoading,

		/*试听学员*/
		tryStuDataSource,
		tryStuLoading,

		/*单次约课*/
		onceOrderClassVisible,
		studentList,
		classList,
		classStuNum,
		clsName,
		clsId,
        onceOrderClassLoading,              //单次约课加载状态
		OnceOrderTipModalVisible,

		/*批量约课*/
		batchOrderClassVisible,
		startDate,
		endDate,
		batchVipDetailInfo,
		batchCourseList,
		batchLoading,

		selectedRows,
		selectedRowKeys,

		batchOrderClassStuList,
		batchOrderClassArrs,
		batchClsName,

		periodExpend,
		periodLeft,

		/*批量预约班级 冲突提示*/
		batchOrderClassTipModalVisible,

		/*预约补课*/
		orderMissClassVisible,

		/*预约试听*/
		subscribeClassVisible,
        subscribeClassLoading,
		subscribeStuList,


		//单次预约班级 出错
		onceOrderErrorModalVisible,
		onceOrderErrorArrs,
		onceOrderLabel,

		batchOrderErrorModalVisible,
		batchOrderErrorArrs,
		batchOrderLabel,

    } = orderClassDetailModel;

	/*切换tab*/
	function changeTab( activeKey ){
		dispatch({
			type : 'orderClassDetailModel/changeTab',
			payload : {
				activeKey
			}
		})
	}

	/*关闭详情*/
	function closeDetail(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				detailVisible : false,
				currentItem   : {},
				studentList   : [],
				classList     : []
			}
		})
	}

	/*单次约课*/
	function onceOrderClassClick(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				onceOrderClassVisible : true
			}
		})
	}

	/*批量约课*/
	function batchOrderClassClick(){
		dispatch({
			type : 'orderClassDetailModel/batchOrderClassClick',
			payload : {
			}
		})
	}

	/*预约补课*/
	function orderMissClassClick(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				orderMissClassVisible : true
			}
		})
	}

	/*预约试听*/
	function subscribeClassClick(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				subscribeClassVisible : true
			}
		})
	}

	/*确认单次约课*/
	function confirmOrderClass( values ){
		dispatch({
			type : 'orderClassDetailModel/confirmOrderClass',
			payload : {
				values,
				refreshSchedule,              //刷新课程表
			}
		})
	}

	/*取消单次约课*/
	function cancelOrderClass(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				onceOrderClassVisible : false,
                onceOrderClassLoading : false,
				clsId                 : undefined,
				classStuNum           : 0,
				clsName               : undefined
			}
		})
	}

	/*改变约课类型*/
	function changeOnceOrderType(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				clsId                 : undefined,
				classStuNum           : 0,
				clsName               : undefined
			}
		})
	}

	/*选择班级得到 班级人数 班级名称*/
	function selectClass( value, option ){
		let num = option.props.num;
		let clsName = option.props.children;
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				classStuNum : num,
				clsName     : clsName,
				clsId       : value
			}
		})
	}

	/*关闭班级单次约课提示框*/
	function closeOrderTipModal(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				OnceOrderTipModalVisible : false
			}
		})
	}

	/*继续约课*/
	function confirmOrderTipModal( clsId ){
		dispatch({
			type : 'orderClassDetailModel/confirmOrderTipModal',
			payload : {
				clsId,
				refreshSchedule,              //刷新课程表
			}
		})
	}

	/*确认预约补课*/
	function confirmOrderMissClass( values ){
		dispatch({
			type : 'orderClassDetailModel/confirmOrderMissClass',
			payload : {
				values,
				refreshSchedule
			}
		})
	}

	/*取消预约补课*/
	function cancelOrderMissClass(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				orderMissClassVisible : false
			}
		})
	}

	/*确认预约试听*/
	function confirmSubscribeClass( values ){
		dispatch({
			type : 'orderClassDetailModel/confirmSubscribeClass',
			payload : {
				values,
				refreshSchedule,              //刷新课程表
			}
		})
	}

	/*取消预约试听*/
	function cancelSubscribeClass(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				subscribeClassVisible : false,
				subscribeStuList      : [],
			}
		})
	}

	/*预约后取消*/
	function cancelTryOrderClass( id ){
		dispatch({
			type : 'orderClassDetailModel/cancelTryOrderClass',
			payload : {
				id,
				refreshSchedule,              //刷新课程表
			}
		})
	}

	/*改变类型*/
	function changeType( value ){
		dispatch({
			type : 'orderClassDetailModel/changeType',
			payload : {
				value
			}
		})
	}

	/*取消批量约课*/
	function cancelbatchOrderClass(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				batchOrderClassVisible : false,
				startDate              : undefined,
				endDate                : undefined,
				batchCourseList        : [],
				batchVipDetailInfo     : {},
				selectedRows           : [],
				selectedRowKeys        : [],
				periodExpend           : 0,

				batchOrderClassStuList : [],
				batchOrderClassArrs    : [],
				batchClsName           : undefined,
				batchOrderClassTipModalVisible : false,
			}
		})
	}


	/*批量约课开始时间*/
	function startTimeChange( value ){
		let startDate = value.format('YYYY-MM-DD');
		dispatch({
			type : 'orderClassDetailModel/timeChange',
			payload : {
				startDate,
				status : 'start'
			}
		})

	}

	/*批量约课结束时间*/
	function endTimeChange( value ){
		let endDate = value.format('YYYY-MM-DD');
		dispatch({
			type : 'orderClassDetailModel/timeChange',
			payload : {
				endDate,
				status : 'end'
			}
		})
	}

	/*学员改变*/
	function studentChange( value ){
		dispatch({
			type : 'orderClassDetailModel/studentChange',
			payload : {
				value
			}
		})
	}

	/*批量约班级 班级变化*/
	function batchSelectClass( value, option ){
		dispatch({
			type : 'orderClassDetailModel/selectClass',
			payload : {
				value,
				batchClsName : option.props.children
			}
		})
	}

	/*确认批量约课*/
	function confirmBatchOrderClass( values ){
		dispatch({
			type : 'orderClassDetailModel/confirmBatchOrderClass',
			payload : {
				values,
				refreshSchedule,              //刷新课程表
			}
		})
	}

	/*关闭批量约课 冲突*/
	function closeBatchOrderTipModal(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				batchOrderClassVisible : false,
				startDate              : undefined,
				endDate                : undefined,
				batchCourseList        : [],
				batchVipDetailInfo     : {},
				selectedRows           : [],
				selectedRowKeys        : [],
				periodExpend           : 0,

				batchOrderClassStuList : [],
				batchOrderClassArrs    : [],
				batchClsName           : undefined,
				batchOrderClassTipModalVisible : false,
			}
		})
	}

	/*选择约课课程*/
	function rowSelectChange( selectedRowKeys, selectedRows ){
		let periodExpend = 0;
		let periodLeft = 0;
		!!selectedRows && selectedRows.map(function( item, index ){
			periodExpend += item.cost;
		})
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				selectedRowKeys,
				selectedRows,
				periodExpend
			}
		})
	}

	/*取消排队*/
	function cancelLineStudent( id, signType ){
		dispatch({
			type : 'orderClassDetailModel/changeStudentStatus',
			payload : {
				id,
				signType
			}
		})
	}

	/*排队转上课学员*/
	function turnToClass( id ){
		dispatch({
			type : 'orderClassDetailModel/turnToClass',
			payload : {
				id,
				refreshSchedule,              //刷新课程表
			}
		})
	}

	/*取消上课*/
	function cancelToClassStudent( id, signType ){
		dispatch({
			type : 'orderClassDetailModel/changeStudentStatus',
			payload : {
				id,
				signType
			}
		})
	}

	/*请假*/
	function leaveClass( id, signType ){
		dispatch({
			type : 'orderClassDetailModel/changeStudentStatus',
			payload : {
				id,
				signType,
				refreshSchedule,              //刷新课程表
			}
		})
	}

	/*回访确认*/
	function isCheckUpdate( id ){
		dispatch({
			type : 'orderClassDetailModel/isCheckUpdate',
			payload : {
				id,
				refreshSchedule,              //刷新课程表
			}
		})
	}


	//关闭 约课提示框
	function closeBatchOrderErrorModal(){
		dispatch({
			type : 'orderClassDetailModel/closeBatchOrderErrorModal',
		})
	}

	//关闭批量约课提示框
	function closeBatchOrderClassErrorModal(){
		dispatch({
			type : 'orderClassDetailModel/updateState',
			payload : {
				batchOrderErrorModalVisible  : false,
				batchOrderErrorArrs          : [],
				batchOrderLabel              : undefined
			}
		})
	}

	let headDeatilProps = {
		closeDetail,
		onceOrderClassClick,             //单次约课
		batchOrderClassClick,            //批量约课
		orderMissClassClick,             //预约补课
		subscribeClassClick,             //预约试听

		currentItem,
		currentDate

	}

	/*上课学员*/
	let toClassStuProps = {
		toClassStuDataSource,
		toClassStuLoading,

		cancelToClassStudent,
		leaveClass,

		isCheckUpdate,
		currentDate,
		currentItem
	}

	/*排课学员*/
	let lineStuProps = {
		lineStuDataSource,
		lineStuLoading,

		cancelLineStudent,
		turnToClass
	}

	/*补课学员*/
	let mulStudentListProps = {
		mulStudentDataSource,
		mulStudentLoading,
	}

	/*试听学员*/
	let tryStuProps = {
		tryStuDataSource,
		tryStuLoading,

		cancelTryOrderClass,          //取消预约试听
	}

	/*单次约课*/
	let onceOrderClassProps = {
		currentItem,
		onceOrderClassVisible,
        onceOrderClassLoading,              //单次约课加载状态
		studentList,
		classList,

		confirmOrderClass,
		cancelOrderClass,
		selectClass,
		changeOnceOrderType
	}

	/*班级单次预约提示*/
	let onceOrderTipModalProps = {
		OnceOrderTipModalVisible,
		clsName,
		clsId,
		currentItem,

		confirmOrderTipModal,
		closeOrderTipModal
	}

	/*批量约课*/
	let batchOrderClassProps = {

		batchOrderClassVisible,
		batchCourseList,
		batchLoading,
		startDate,
		endDate,
		studentList,
		classList,
		batchVipDetailInfo,
		currentItem,
		selectedRows,
		selectedRowKeys,

		cancelbatchOrderClass,
		confirmBatchOrderClass,
		startTimeChange,
		endTimeChange,
		studentChange,

		batchSelectClass,                   //批量选择 班级
		batchOrderClassStuList,             //批量班级约课 班级学员列表

		rowSelectChange,

		periodExpend,
		periodLeft,
	}

	/*批量预约班级 冲突提示*/
	let batchOrderClassTipModalProps = {
		batchOrderClassTipModalVisible,
		currentItem,
		selectedRows,

		batchOrderClassArrs,
		batchClsName,
		closeBatchOrderTipModal,
	}

	/*预约补课*/
	let orderMissClassProps = {
		orderMissClassVisible,
		studentList,
		currentItem,
		confirmOrderMissClass,
		cancelOrderMissClass,

	}

	/*预约试听*/
	let subscribeClassProps = {
		subscribeClassVisible,
        subscribeClassLoading,
		subscribeStuList,

		confirmSubscribeClass,
		cancelSubscribeClass,
		currentItem,

		changeType
	}


	//预约班级 报错
	let batchOrderErrorModalProps = {
		onceOrderErrorModalVisible,
		onceOrderErrorArrs,
		onceOrderLabel,

		closeBatchOrderErrorModal
	}

	//批量预约班级报错
	let batchOrderClassErrorModalProps = {
		batchOrderErrorModalVisible,
		batchOrderErrorArrs,
		batchOrderLabel,

		closeBatchOrderClassErrorModal
	}

    return (
		<div className = 'common_detail' >
			<NewModal
				visible = { detailVisible }
				width = '900px'
				headVisible = { false }
				footer = '' >
				<DetailHeader { ...headDeatilProps } />
				<Tabs onChange = { changeTab } size = "small" activeKey = { activeKey } >
					<TabPane tab = '上课学员' key = "1">
						<div className = 'vip_detail_content_item' >
							<ToClassStuPage { ...toClassStuProps } />
						</div>
					</TabPane>
					<TabPane tab = '排队学员' key = "2">
						<div className = 'vip_detail_content_item' >
							<LineStudentPage { ...lineStuProps } />
						</div>
					</TabPane>
					<TabPane tab = '补课学员' key = "3">
						<div className = 'vip_detail_content_item' >
							<MulStudentList { ...mulStudentListProps } />
						</div>
					</TabPane>
					<TabPane tab = '试听学员' key = "4">
						<div className = 'vip_detail_content_item' >
							<TryStudentPage { ...tryStuProps } />
						</div>
					</TabPane>
				  </Tabs>
			</NewModal>
			<OnceOrderClassModal { ...onceOrderClassProps } />
			<OnceOrderTipModal { ...onceOrderTipModalProps } />
			<BatchOrderClassModal { ...batchOrderClassProps } />
			<BatchOrderClassTipModal { ...batchOrderClassTipModalProps } />
			<OrderMissClassModal { ...orderMissClassProps } />
			<SubscribeClassModal { ...subscribeClassProps } />

			<BatchOrderErrorModal { ...batchOrderErrorModalProps } />
			<BatchOrderClassErrorModal { ...batchOrderClassErrorModalProps } />
		</div>
    )
};

function mapStateToProps ({ orderClassDetailModel }){
	return { orderClassDetailModel };
};

export default connect( mapStateToProps )( OrderClassDetailPage );
