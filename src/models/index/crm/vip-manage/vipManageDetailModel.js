import {
	getBaseInfoParams,
	getStudentList,              //获取适用学员列表
	getParentList,               //获取适用家长列表
	getContractList,
	getRefundList,
	getSendClassList,
	getClassChangeList,
	getBalanceList,

	getContractSelectList,       //通过会员卡号获取合同下拉
	confirmAddSendClass,         //确认添加赠送课时

	getStudentSelectList,        //得到学员下拉

	confirmAddStudent,           //确认新增适用学员
	removeStudent,               //移除学员
    GetOrderList,                //获取合同下拉列表内容
    GetOutCourseDetail,          //合同下拉列表onChange事件查询合同包含的课时信息(合同内)
    GetInCourseDetail,           //合同下拉列表onChange事件查询合同包含的课时信息(全校区)
    TransCourseModalSubmit       //转课提交
} from '../../../../services/crm/vip-manage/vipManageDetailService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'vipManageDetailModel',

    state : {
		id                    : '',                  //会员卡号
		orgId                 : undefined,           //校区id
		detailVisible         : false,               //详情是否显示
		activeKey             : '1',                 //当前激活的tab

		/*基础信息*/
		baseInfo              : {},

		/*适用学员参数*/
		studentDataSource     : [],
		studentLoading        : false,

		addStudentModalVisible : false,
		studentList            : [],
		addStudentBtnLoading   : false,
		/*适用学员参数*/

		/*适用家长参数*/
		parentDataSource     : [],
		parentLoading        : false,
		/*适用家长参数*/

		/*合同列表参数*/
		contractDataSource   : [],
		contractResultCount  : 0,
		contractLoading      : false,
		contractPageIndex    : 0,
		contractPageSize     : 10,
		/*合同列表参数*/

		/*退费列表参数*/
		refundDataSource     : [],
		refundResultCount    : 0,
		refundPageSize       : 10,
		refundPageIndex      : 0,
		refundLoading        : false,
		/*退费列表参数*/

		/*赠课记录参数*/
		sendClassDataSource  : [],
		sendClassResultCount : 0,
		sendClassPageIndex   : 0,
		sendClassPageSize    : 10,
		sendClassLoading     : false,

		addSendClassModalVisible : false,
		contractSelectList   : [],
		addSendClassModalBtnLoading : false,
		/*赠课记录参数*/

		/*课时变动参数*/
		classChangeDataSource  : [],
		classChangeResultCount : 0,
		classChangePageSize    : 10,
		classChangePageIndex   : 0,
		classChangeLoading     : false,
		/*课时变动参数*/

		/*余额变动参数*/
		balanceDataSource      : [],
		balanceResultCount     : 0,
		balancePageIndex       : 0,
		balancePageSize        : 10,
		balanceLoading         : false,
		/*余额变动参数*/

        /*转课*/
        transCourseModalVisible : false,            //转课modal是否显示
        transCourseModalLoading : false,            //转课modal加载状态
        transCourseModalButtonLoading : false,      //转课modal按钮加载状态
        orderList : [],                             //合同下拉列表内容
        courseOutMessage : [],                      //合同下的转出课程信息
        courseInMessage : [],                       //合同下的转进课程信息
        courseInDetail : {},                        //转进课程的详细信息
        courseOutDetail : {},                       //转出课程的详细信息
        typeRadioItem : undefined,                  //选择类型(1平价/2补缴/3退费)
	},

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/vip_detail' ){

				}
            })
        }
    },

    effects : {
		*showDetail({ payload },{ call, put, select }){
			let { id, orgId } = payload;
			let state = yield select( state => state.vipManageDetailModel );
			let detailVisible = state.detailVisible;
			yield put({
				type : 'updateState',
				payload : {
					detailVisible : true,
					activeKey     : '8',
					orgId,
					id
				}
			});
			yield put({
				type : 'getBaseInfoParams',
				payload : {
				}
			})
		},

		/*改变tab*/
		*changeTab({ payload },{ call, put, select }){
			let { activeKey } = payload;
			yield put({
				type : 'updateState',
				payload : {
					activeKey
				}
			})
			if( activeKey == '1' ){
				yield put({
					type : 'getStudentList',
				})
			}else if( activeKey == '2' ){
				yield put({
					type : 'getParentList',
				})
			}else if( activeKey == '3' ){
				yield put({
					type : 'getContractListParams',
				})
			}else if( activeKey == '4' ){
				yield put({
					type : 'getRefundListParams',
				})
			}else if( activeKey == '5' ){
				yield put({
					type : 'getSendClassListParams',
				})
			}else if( activeKey == '6' ){
				yield put({
					type : 'getClassChangeListParams',
				})
			}else if( activeKey == '7' ){
				yield put({
					type : 'getBalanceListParams',
				})
			}else if( activeKey == '8' ){
				yield put({
					type : 'getBaseInfoParams',
				})
			}
		},

		/*得到会员卡基础信息*/
		*getBaseInfoParams({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let cardId = state.id;
			let { ret } = yield call( getBaseInfoParams, ({ cardId }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						baseInfo : ret
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取会员卡基础信息失败' )
			}
		},

		/*请求适用学员列表*/
		*getStudentList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					studentLoading : true
				}
			})
			let state = yield select( state => state.vipManageDetailModel );
			let id = state.id;
			let { ret } = yield call( getStudentList, ({ id : id }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						studentDataSource : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '请求列表数据失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					studentLoading : false
				}
			})
		},

		/*点击添加适用学员*/
		*createStudent({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let orgId = state.orgId;
			let { ret } = yield call( getStudentSelectList, ({ orgId : orgId }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						addStudentModalVisible : true,
						studentList            : ret.results,
					}
				})
			}
		},

		/*确认添加适用学员*/
		*confirmAddStudent({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					addStudentBtnLoading : true
				}
			})
			let { values } = payload;
			let state = yield select( state => state.vipManageDetailModel );
			let params = {
				id     : state.id,
				stuId  : values.stuId,
				orgId  : state.orgId
			}
			let { ret } = yield call( confirmAddStudent, ( params ));
			if( ret && ret.errorCode == 9000 ){
                message.success('添加成功');
				yield put({
					type : 'updateState',
					payload : {
						addStudentModalVisible : false,
						studentList            : []
					}
				})
				yield put({
					type : 'getStudentList',
					payload : {
					}
				})
			}else {
				message.error( ret && ret.errorMessage || '一名学员只能绑定一张会员卡，此学员已有绑定的会员卡！请先解绑再进行此操作' );
			}
			yield put({
				type : 'updateState',
				payload : {
					addStudentBtnLoading : false
				}
			})
		},

		/*移除适用学员*/
		*removeStudent({ payload },{ call, put, select }){
			let { stuId } = payload;
			let state = yield select( state => state.vipManageDetailModel );
			let params = {
				id : state.id,
				stuId,
			}
			let { ret } = yield call( removeStudent, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'getStudentList',
					payload : {
					}
				})
			}
		},

		/*请求适用家长列表*/
		*getParentList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					parentLoading : true,
				}
			})
			let state = yield select( state => state.vipManageDetailModel );
			let id = state.id;
			let { ret } = yield call( getParentList, ({ id : id }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						parentDataSource : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表数据失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					parentLoading : false
				}
			})
		},

		/*合同列表所需参数*/
		*getContractListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let params = {
				id        : state.id,
				pageIndex : 0,
				pageSize  : state.contractPageSize,
			}
			yield put({
				type : 'getContractList',
				payload : {
					params
				}
			})

		},
		/*请求合同列表*/
		*getContractList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					contractLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getContractList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						contractDataSource  : ret.results,
						contractResultCount : ret.data.resultCount,
						contractPageIndex   : params.pageIndex,
						contractPageSize    : params.pageSize,
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表数据失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					contractLoading : false
				}
			})
		},

		/*合同列表分页*/
		*contractPagination({ payload },{ call, put, select }){
			let { contractPageIndex, contractPageSize } = payload;
			let state = yield select( state => state.vipManageDetailModel );
			let params = {
				pageSize   : contractPageSize,
				pageIndex  : contractPageIndex - 1,
				id         : state.id,
			}
			yield put({
				type : 'getContractList',
				payload : {
					params
				}
			})
		},

		/*请求退费列表所需参数*/
		*getRefundListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let params = {
				id        : state.id,
				pageIndex : 0,
				pageSize  : state.refundPageSize,
			}
			yield put({
				type : 'getRefundList',
				payload : {
					params
				}
			})
		},
		/*请求退费列表*/
		*getRefundList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					refundLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getRefundList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						refundDataSource  : ret.results,
						refundResultCount : ret.data.resultCount,
						refundPageSize    : params.pageSize,
						refundPageIndex   : params.pageIndex
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表数据失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					refundLoading : false
				}
			})
		},

		/*退费列表分页*/
		*refundPagination({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let { refundPageIndex, refundPageSize } = payload;
			let params = {
				pageIndex : refundPageIndex - 1,
				pageSize  : refundPageSize,
				id        : state.id
			}
			yield put({
				type : 'getRefundList',
				payload : {
					params
				}
			})
		},

		/*请求赠课记录所需参数*/
		*getSendClassListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let params = {
				cardId    : state.id,
				pageSize  : state.sendClassPageSize,
				pageIndex : 0
			}
			yield put({
				type : 'getSendClassList',
				payload : {
					params
				}
			})
		},

		/*请求赠课记录*/
		*getSendClassList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					sendClassLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getSendClassList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						sendClassDataSource  : ret.results,
						sendClassResultCount : ret.data.resultCount,
						sendClassPageSize    : params.pageSize,
						sendClassPageIndex   : params.pageIndex
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表数据失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					sendClassLoading : false
				}
			})
		},
		/*赠课记录分页*/
		*sendClassPagination({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let { sendClassPageSize, sendClassPageIndex } = payload;
			let params = {
				cardId    : state.id,
				pageSize  : sendClassPageSize,
				pageIndex : sendClassPageIndex - 1,
			}
			yield put({
				type : 'getSendClassList',
				payload : {
					params
				}
			})
		},

		/*点击添加赠送课时*/
		*addSendClass({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let id = state.id;
			let params = {
				cardId : state.id,
				type   : '2'
			}
			let { ret } = yield call( getContractSelectList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						contractSelectList : ret.results,
						addSendClassModalVisible : true
					}
				})
			}
		},

		/*确认添加赠送课时*/
		*confirmAddSendClass({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					addSendClassModalBtnLoading : true
				}
			})
			let { values } = payload;
			let state = yield select( state => state.vipManageDetailModel );
			let values1 = {
				cardId         : values.id,
				purchaseId     : values.purchaseId,
				periodNum      : values.periodNum,
				extPeriodMoney : values.extPeriodMoney,
				extPeriodReason : values.extPeriodReason

			}
			let { ret } = yield call( confirmAddSendClass, ( values1 ));
			if( ret && ret.errorCode == 9000 ){
                message.success('添加成功');
				yield put({
					type : 'updateState',
					payload : {
						addSendClassModalVisible : false,
						contractSelectList       : []
					}
				})
				let params = {
					cardId    : state.id,
					pageSize  : state.sendClassPageSize,
					pageIndex : state.sendClassPageIndex
				}
				yield put({
					type : 'getSendClassList',
					payload : {
						params
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '新增失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					addSendClassModalBtnLoading : false
				}
			})
		},

		/*获得课时变动记录的参数*/
		*getClassChangeListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let params = {
				id        : state.id,
				pageIndex : 0,
				pageSize  : state.classChangePageSize,
			}
			yield put({
				type : 'getClassChangeList',
				payload : {
					params
				}
			})
		},

		/*获得课时变动记录*/
		*getClassChangeList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					classChangeLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getClassChangeList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						classChangeDataSource  : ret.results,
						classChangeResultCount : ret.data.resultCount,
						classChangePageIndex   : params.pageIndex,
						classChangePageSize    : params.pageSize,
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表数据失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					classChangeLoading : false
				}
			})
		},

		/*课时变动记录分页*/
		*classChangePagination({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let { classChangePageSize, classChangePageIndex } = payload;
			let params = {
				id        : state.id,
				pageSize  : classChangePageSize,
				pageIndex : classChangePageIndex - 1,
			}
			yield put({
				type : 'getClassChangeList',
				payload : {
					params
				}
			})
		},

		/*获取余额变动所需参数*/
		*getBalanceListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let params = {
				id        : state.id,
				pageSize  : state.balancePageSize,
				pageIndex : 0
			}
			yield put({
				type : 'getBalanceList',
				payload : {
					params
				}
			})
		},

		/*获取余额变动记录*/
		*getBalanceList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					balanceLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getBalanceList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						balanceDataSource  : ret.results,
						balanceResultCount : ret.data.resultCount,
						balancePageSize    : params.pageSize,
						balancePageIndex   : params.pageIndex
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表数据失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					balanceLoading : false
				}
			})
		},

		/*余额变动分页*/
		*balancePagination({ payload },{ call, put, select }){
			let state = yield select( state => state.vipManageDetailModel );
			let { balancePageSize, balancePageIndex } = payload;
			let params = {
				id        : state.id,
				pageSize  : balancePageSize,
				pageIndex : balancePageIndex - 1
			}
			yield put({
				type : 'getBalanceList',
				payload : {
					params
				}
			})
		},

        /*获取合同下拉列表内容*/
        *'GetOrderList'({ payload },{ call, put, select }){
            yield put({ type:'showTransCourseModalLoading' });
            let { ret } = yield call(GetOrderList,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type:'updateState',
                    payload:{
                        orderList : ret.results
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取合同列表失败')
            }
            yield put({ type:'closeTransCourseModalLoading' });
        },

        //合同下拉列表onChange事件查询合同包含的课时信息(合同内)
        *'GetOutCourseDetail'({ payload },{ call, put, select }){
            yield put({ type:'showTransCourseModalLoading' });
            let { ret } = yield call(GetOutCourseDetail,parse(payload));
            if(ret && ret.errorCode == '9000'){
                let courseOutMessage = [];
                for(let i in ret.results){
                    ret.results[i].display = true;
                    courseOutMessage.push(ret.results[i])
                }
                yield put({
                    type:'updateState',
                    payload:{
                        courseOutMessage
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取合同课时信息失败')
            }
            yield put({ type:'closeTransCourseModalLoading' });
        },

        //合同下拉列表onChange事件查询合同包含的课时信息(全校区)
        *'GetInCourseDetail'({ payload },{ call, put, select }){
            yield put({ type:'showTransCourseModalLoading' });
            let { ret } = yield call(GetInCourseDetail,parse(payload));
            if(ret && ret.errorCode == '9000'){
                let courseInMessage = [];
                for(let i in ret.results){
                    ret.results[i].display = true;
                    courseInMessage.push(ret.results[i])
                }
                yield put({
                    type:'updateState',
                    payload:{
                        courseInMessage
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取合同课时信息失败')
            }
            yield put({ type:'closeTransCourseModalLoading' });
        },

        //转课提交
        *'TransCourseModalSubmit'({ payload },{ call, put, select }){
            yield put({ type:'showTransCourseModalLoading' });
            yield put({ type:'showTransCourseModalButtonLoading' });
            let { ret } = yield call(TransCourseModalSubmit,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('转课成功');
                yield put({
                    type:'updateState',
                    payload:{
                        transCourseModalVisible : false,
                        orderList : [],                             //合同下拉列表内容
                        courseOutMessage : [],                      //合同下的转出课程信息
                        courseInMessage : [],                       //合同下的转进课程信息
                        courseInDetail : {},                        //转进课程的详细信息
                        courseOutDetail : {},                       //转出课程的详细信息
                        typeRadioItem : undefined,                  //选择类型(1平价/2补缴/3退费)
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('转课失败')
            }
            yield put({ type:'closeTransCourseModalLoading' });
            yield put({ type:'closeTransCourseModalButtonLoading' });
        },
    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        },
        showTransCourseModalLoading( state, action ){
            return { ...state, transCourseModalLoading : true };
        },
        closeTransCourseModalLoading( state, action ){
            return { ...state, transCourseModalLoading : false };
        },
        showTransCourseModalButtonLoading( state, action ){
            return { ...state, transCourseModalButtonLoading : true };
        },
        closeTransCourseModalButtonLoading( state, action ){
            return { ...state, transCourseModalButtonLoading : false };
        },
    }
}
