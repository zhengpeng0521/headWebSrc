import {
	getCurrentDate,                //得到当前时间
	getStudentList,                //得到学员下拉
	getClassList,                  //得到班级下拉

	getSubStudentListByCrm,        //预约试听得到学员下拉crm
	getSubStudentListByLeader,     //预约试听得到学员下拉leader

	confirmOrderClass,             //确认约课
	confirmOrderClassByAll,        //确认预约班级
	confirmBatchOrderClassByAll,   //确认批量预约班级

	getDetailList,                 //得到上课学员, 排课学员

	confirmOrderMissClass,         //确认预约补课

	confirmSubscribeClass,         //确认预约试听
	cancelTryOrderClass,           //取消预约试听

	getBatchCourseList,            //得到批量约课的课程
	getVipDetailInfo,              //得到会员卡详情

	changeStudentStatus,           //改变学员状态
	turnToClass,                   //排队转上课

	isCheckUpdate,                 //回访确认

	getClassStuList,               //得到班级下的班级学员

} from '../../../../services/erp/order-class/orderClassDetailService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'orderClassDetailModel',

    state : {
		orgId                                 : undefined,          //校区

		detailVisible                         : false,              //详情是否显示
		activeKey                             : '1',                //当前tab页
		currentItem                           : undefined,          //当前选中项详情
		currentDate                           : undefined,          //当前时间

		/*上课学员*/
		toClassStuDataSource                  : [],
		toClassStuLoading                     : false,

		/*排队学员*/
		lineStuDataSource                     : [],
		lineStuLoading                        : false,

		/*补课学员*/
		mulStudentDataSource                  : [],
		mulStudentLoading                     : false,

		/*试听学员*/
		tryStuDataSource                      : [],
		tryStuLoading                         : false,

		/*单次约课*/
		onceOrderClassVisible                 : false,
		studentList                           : [],
		classList                             : [],
		classStuNum                           : 0,
		clsName                               : undefined,
        onceOrderClassLoading                 : false,              //单次约课加载状态

		OnceOrderTipModalVisible              : false,              //班级预约单次 提示框

		/*批量约课*/
		batchOrderClassVisible                : false,
		startDate                             : undefined,
		endDate                               : undefined,
		batchCourseList                       : [],
		batchLoading                          : false,
		selectedRows                          : [],
		selectedRowKeys                       : [],

		batchVipDetailInfo                    : {},

		periodExpend                          : 0,
		periodLeft                            : 0,
		batchOrderClassStuList                : [],                //批量班级约课班级学员
		batchOrderClassTipModalVisible        : false,             //约课冲突模态框
		batchClsName                          : undefined,
		batchOrderClassArrs                   : [],                //冲突列表

		/*预约补课*/
		orderMissClassVisible                 : false,

		/*预约试听*/
		subscribeClassVisible                 : false,
        subscribeClassLoading                 : false,
		subscribeStuList                      : [],

		onceOrderErrorModalVisible            : false,
		onceOrderErrorArrs                    : [],
		onceOrderLabel                        : undefined,

		batchOrderErrorModalVisible           : false,
		batchOrderErrorArrs                   : [],
		batchOrderLabel                       : undefined,

	},

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/cerp_yk_mgr' ){
				}
            })
        }
    },

    effects : {
		*showDetail({ payload },{ call, put, select }){
			let { item, orgId } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let detailVisible = state.detailVisible;
			yield put({
				type : 'updateState',
				payload : {
					detailVisible : true,
					currentItem   : item,
					orgId         : orgId
				}
			})
			let subscribeStuList = yield call( getSubStudentListByCrm, ({ orgId : orgId }));
			if( subscribeStuList && subscribeStuList.ret && subscribeStuList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						studentList      : subscribeStuList.ret.results
					}
				})
			}
			/*约课班级下拉列表*/
			let classList = yield call( getClassList, ({ orgId : orgId, courseId : item.courseId }));
			if( classList && classList.ret && classList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						classList      : classList.ret.results
					}
				})
			}

			let params = {
				cpdId : item.cpdId,
				cpmId : item.cpmId,
				orgId : orgId,
			}
			yield put({
				type : 'getDetailList',
				payload : {
					params
				}
			})
			let currentDate = yield call( getCurrentDate );
			yield put({
				type : 'updateState',
				payload : {
					currentDate : currentDate.ret.date
				}
			})
		},

		/*得到学员明细*/
		*getDetailList({ payload },{ call, put, select }){
			let { params } = payload;
			yield put({
				type : 'updateState',
				payload : {
					toClassStuLoading  : true,
					lineStuLoading     : true,
					tryStuLoading      : true,
					mulStudentLoading  : true
				}
			})
			let { ret } = yield call( getDetailList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						toClassStuDataSource : ret.stuList,
						lineStuDataSource    : ret.lineStuList,
						mulStudentDataSource : ret.mulStuList,
						tryStuDataSource     : ret.tryStuList,
						currentItem          : ret,
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '学员明细获取失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					toClassStuLoading  : false,
					lineStuLoading     : false,
					tryStuLoading      : false,
					mulStudentLoading  : false
				}
			})
		},

		/*切换tab页*/
		*changeTab({ payload },{ call, put, select }){
			let { activeKey } = payload;
			yield put({
				type : 'updateState',
				payload : {
					activeKey
				}
			})
		},

		/*确认单次约课学员*/
		*confirmOrderClass({ payload },{ call, put, select }){
            //yield put({ type : 'updateState' , payload : { onceOrderClassLoading : true } });
			let { values, refreshSchedule } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let values1 = {
				cpmId  : currentItem.cpmId,
				cpdIds : currentItem.cpdId,
				stuId  : values.stuId,             //学员约课有值
				orgId  : state.orgId,
			}
			let values2 = {
				cpmId  : currentItem.cpmId,
				cpdId  : currentItem.cpdId,
				orgId  : state.orgId,
				clsId  : values.clsId,             //班级约课有值
			}
			/*判断班级约课 时 班级人数是否超过上限*/
			let num = currentItem.num;
			let maxNum = currentItem.maxNum;
			let classStuNum = state.classStuNum;
			if( maxNum - num < classStuNum && !!values.clsId ){
				yield put({
					type : 'updateState',
					payload : {
						OnceOrderTipModalVisible  : true
					}
				})
				return;
			}
			let ret = {};
			if( values.type == '1' ){
				ret = yield call( confirmOrderClass, ( values1 ));
			}else{
				ret = yield call( confirmOrderClassByAll, ( values2 ))
			}
			ret = ret.ret;
			if( ret && ret.errorCode == 9000 ){
				if( !!ret.message && Object.keys( ret.message ).length > 0 ){
					yield put({
						type : 'updateState',
						payload : {
							onceOrderErrorModalVisible : true,
							onceOrderErrorArrs         : ret.message,
							onceOrderLabel             : values.type == '2' ? '以下学员约课失败' : values.type == '1' ? '学员约课失败' : (ret.cutType == 1 && values.type == '2') ? '该课程只能使用专用课时, 以下学员约课失败' : '该课程只能使用专用课时, 学员约课失败'
						}
					})
				}
				yield put({
					type : 'updateState',
					payload : {
						onceOrderClassVisible : false
					}
				})
				if( !!ret.message && Object.keys( ret.message ).length == 0 ){
					message.success( ret && ret.errorMessage || '成功' );
				}
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
						payload : {}
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})

			}else{
				message.error( ret && ret.errorMessage || '约课失败' )
			}
            //yield put({ type : 'updateState' , payload : { onceOrderClassLoading : false } });
		},

		/*继续单次预约班级*/
		*confirmOrderTipModal({ payload },{ call, put, select }){
			let { clsId, refreshSchedule } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let params = {
				cpmId  : currentItem.cpmId,
				cpdId  : currentItem.cpdId,
				orgId  : state.orgId,
				clsId,                    //班级约课有值
			}
			let { ret } = yield call( confirmOrderClassByAll, ( params ))
			if( ret && ret.errorCode == 9000 ){
				if( !!ret.message && Object.keys( ret.message ).length > 0 ){
					yield put({
						type : 'updateState',
						payload : {
							onceOrderErrorModalVisible : true,
							onceOrderErrorArrs         : ret.message,
							onceOrderLabel             : ret.cutType == 1 ? '该课程只能使用专用课时，以下学员约课失败：' : '以下学员约课失败：'
						}
					})
				}
				yield put({
					type : 'updateState',
					payload : {
						onceOrderClassVisible    : false,
						OnceOrderTipModalVisible : false,
						clsId                    : undefined,
						classStuNum              : 0,
						clsName                  : undefined
					}
				})
				if( !!ret.message && Object.keys( ret.message ).length == 0 ){
					message.success( ret && ret.errorMessage || '成功' );
				}
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '约课失败' )
			}
		},

		//关闭 约课错误提示框
		*closeBatchOrderErrorModal({ payload },{ call, put, select } ){
			yield put({
				type : 'updateState',
				payload : {
					onceOrderErrorModalVisible  : false,
					onceOrderErrorArrs          : [],
					onceOrderLabel              : undefined
				}
			})
		},

		/*点击批量约课*/
		*batchOrderClassClick({ payload },{ call, put, select }){
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let startDate = currentItem.studyDate;
			let endDate = currentItem.studyDate;
			let batchOrderClassVisible = state.batchOrderClassVisible;
			let params = {
				orgId    : state.orgId,
				courseId : currentItem.courseId,
				cpmId    : currentItem.cpmId,
				startDate,
				endDate,
			}
			yield put({
				type : 'getBatchCourseList',
				payload : {
					params
				}
			})
			yield put({
				type : 'updateState',
				payload : {
					startDate,
					endDate,
					batchOrderClassVisible : true
				}
			})
		},

		/*查询批量约课的课程*/
		*getBatchCourseList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					batchLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getBatchCourseList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						batchCourseList : ret.results,
						...params
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表数据失败' );
			}
			yield put({
				type : 'updateState',
				payload : {
					batchLoading : false
				}
			})
		},

		/*改变学员*/
		*studentChange({ payload },{ call, put, select }){
		 	let { value } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let params = {
				courseId : currentItem.courseId,
				orgId    : state.orgId,
				stuId    : value
			}
			let { ret } = yield call( getVipDetailInfo , ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						batchVipDetailInfo : ret.data
					}
				})
			}else{
				yield put({
					type : 'updateState',
					payload : {
						batchVipDetailInfo : {}
					}
				})
				message.error( ret && ret.errorMessage || '此学员没有会员卡' )
			}
		},

		/*改变开始时间和结束时间*/
		*timeChange({ payload },{ call, put, select }){
			let { startDate, endDate, status } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let params = {};
			if( status == 'start' ){
				params = {
					startDate,
					endDate  : state.endDate,
					orgId    : state.orgId,
					courseId : currentItem.courseId,
					cpmId    : currentItem.cpmId,
				}
			}else if( status == 'end' ){
				params = {
					endDate,
					startDate : state.startDate,
					orgId     : state.orgId,
					courseId  : currentItem.courseId,
					cpmId     : currentItem.cpmId
				}
			}
			yield put({
				type : 'getBatchCourseList',
				payload : {
					params
				}
			})
		},

		/*确认批量约课*/
		*confirmBatchOrderClass({ payload },{ call, put, select }){
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let selectedRows = state.selectedRows;
			let cpdIds = [];
			if( selectedRows.length > 0 ){
				!!selectedRows && selectedRows.map(function( item, index ){
					cpdIds.push( item.cpdId );
				})
			}else {
				return message.error( '未选中课程' );
			}
			let { values, refreshSchedule } = payload;
			let params = {
				orgId     : state.orgId,
				cpmId     : currentItem.cpmId,
				cpdIds    : !!cpdIds && cpdIds.join(','),
				stuId     : values.stuId,
				fix       : values.fix,
				clsId     : values.clsId
			}
			let type = values.type;
			let ret = {};
			if( type == '1' ){
				//学员批量约课
				ret = yield call( confirmOrderClass, ( params ));
			}else if( type == '2' ){
				ret = yield call( confirmBatchOrderClassByAll, ( params ) );
			}
			ret = ret.ret;
			if( ret && ret.errorCode == 9000 ){
				if( !!ret.message && Object.keys( ret.message ).length > 0 ){
					yield put({
						type : 'updateState',
						payload : {
							batchOrderErrorModalVisible : true,
							batchOrderErrorArrs         : ret.message,
							batchOrderLabel             : ret.cutType == 1 ? `该课程只能使用专用课时, 所需课时${ currentItem.cost}，学员约课失败情况：` : `本次约课需课时${ currentItem.cost}, 学员约课失败情况：`
						}
					})
				}
				yield put({
					type : 'updateState',
					payload : {
						batchOrderClassVisible          : false,
						startDate                       : undefined,
						endDate                         : undefined,
						batchCourseList                 : [],
						batchVipDetailInfo              : {},
						selectedRows                    : [],
						selectedRowKeys                 : [],
						periodExpend                    : 0,
						batchOrderClassStuList          : [],
						batchOrderClassStuList          : [],
						batchOrderClassTipModalVisible  : false,
					}
				})
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
						payload : {}
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})
			} else if( ret && ret.errorCode == 5000 ){
				let batchOrderClassSuccessArr = Object.keys( ret.errorMap );
				let dataSource = [];
				!!selectedRows && selectedRows.map(function( item, index ){
					if( batchOrderClassSuccessArr.indexOf( item.cpdId ) != -1 ){
						item.errorTips = ret.errorMap[ item.cpdId ];
						dataSource.push( item )
					}
				})
				yield put({
					type : 'updateState',
					payload : {
						batchOrderClassTipModalVisible : true,
						batchOrderClassArrs            : dataSource
					}
				})
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
						payload : {}
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '选中学员无会员卡' )
			}
		},

		/*确认预约补课*/
		*confirmOrderMissClass({ payload },{ call, put, select }){
			let { values, refreshSchedule } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let params = {
				cpmId   : currentItem.cpmId,
				cpdIds  : currentItem.cpdId,
				stuId   : values.stuId,
				orgId   : state.orgId,
			}
			let { ret } = yield call( confirmOrderMissClass, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						orderMissClassVisible : false,
					}
				})
				message.success( ret && ret.errorMessage || '成功' );
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
						payload : {}
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '预约补课失败' )
			}

		},

		/*确认预约试听*/
		*confirmSubscribeClass({ payload },{ call, put, select }){
            yield put({ type : 'updateState' , payload : { subscribeClassLoading : true } });
			let { values, refreshSchedule } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let params = {
				orgId        : state.orgId,
				stuId        : values.stuId,
				courseId     : currentItem.courseId,
				auditionTime : currentItem.studyDate + ' ' + currentItem.startTime + ':00',
				auditionEndTime : currentItem.studyDate + ' ' + currentItem.endTime + ':00',
				source       : values.type,
				courseName   : currentItem.courseName,
				cpmId        : currentItem.cpmId,
				cpdId        : currentItem.cpdId,
			}
			let { ret } = yield call( confirmSubscribeClass, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						subscribeClassVisible : false,
						subscribeStuList      : []
					}
				})
				message.success( ret && ret.errorMessage || '成功' );
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
						payload : {}
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})
			}else {
				message.error( ret && ret.errorMessage || '预约失败' )
			}
            yield put({ type : 'updateState' , payload : { subscribeClassLoading : false } });
		},

		/*取消预约试听*/
		*cancelTryOrderClass({ payload },{ call, put, select }){
			let { id, refreshSchedule } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let orgId = state.orgId;
			let { ret } = yield call( cancelTryOrderClass, ({ ids : id, orgId : orgId, status : '0' }));
			let currentItem = state.currentItem;
			if( ret && ret.errorCode == 9000 ){
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
						payload : {}
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '取消失败' )
			}
		},

		/*改变学员状态*/
		*changeStudentStatus({ payload },{ call, put, select }){
			let { id, signType, refreshSchedule } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let params = {
				orgId    : state.orgId,
				cpStuId  : id,
				signType : signType
			}
			let { ret } = yield call( changeStudentStatus, ( params ));
			if( ret && ret.errorCode == 9000 ){
                message.success(ret.errorMessage || '成功')
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
						payload : {}
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})
			}
		},

		/*回访确认*/
		*isCheckUpdate({ payload },{ call, put, select }){
			let { id, refreshSchedule } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let params = {
				orgId    : state.orgId,
				cpStuId  : id,
			}
			let { ret } = yield call( isCheckUpdate, ( params ));
			if( ret && ret.errorCode == 9000 ){
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
						payload : {}
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})
			}
		},

		/*排队转学员*/
		*turnToClass({ payload },{ call, put, select }){
			let { id, refreshSchedule } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let currentItem = state.currentItem;
			let params = {
				orgId    : state.orgId,
				cpStuId  : id,
			}
			let { ret } = yield call( turnToClass, ( params ));
			if( ret && ret.errorCode == 9000 ){
				if( !!refreshSchedule ){
					refreshSchedule()
				}else{
					yield put({
						type : 'orderClassModel/getParams',
						payload : {}
					})
				}
				let params1 = {
					cpdId : currentItem.cpdId,
					cpmId : currentItem.cpmId,
					orgId : state.orgId,
				}
				yield put({
					type : 'getDetailList',
					payload : {
						params : params1
					}
				})
			}else{
				message.error( ret && ret.errorMessage )
			}
		},

		/*改变类型*/
		*changeType({ payload },{ call, put, select }){
			let { value } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let ret = {};
			if( value == '1' ){
				ret = yield call( getSubStudentListByCrm, ({ orgId : state.orgId }))
			}else if( value == '2' ){
				ret = yield call( getSubStudentListByLeader, ({ orgId : state.orgId, condition : 'all' }));
			}
			if( ret && ret.ret && ret.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						subscribeStuList : ret.ret.results
					}
				})
			}
		},

		/*批量约班级 改变班级*/
		*selectClass({ payload },{ call, put, select }){
			let { value, batchClsName } = payload;
			let state = yield select( state => state.orderClassDetailModel );
			let orgId = state.orgId;
			let { ret } = yield call( getClassStuList, ({ clsId : value, orgId, pageIndex : 0, pageSize : 9999 }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						batchOrderClassStuList : ret.results,
						batchClsName
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取班级学员失败' )
			}
		}
	},

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
