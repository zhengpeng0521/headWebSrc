import {
	getOrderNum,                  //获取随机合同编号

	getParentIdList,              //校区得到家长下拉列表
	getVipCardList,               //家长得到会员卡下拉列表
	getStuIdList,                 //家长得到学员下拉列表
	getStuIdListByCard,           //通过会员卡得到学员下拉列表

	getProductList,               //得到产品下拉列表
	getTeachingList,              //得到教材下拉列表
	getSalesList,                 //得到销售下拉列表
	getPaywayList,                //得到收款下拉列表

	confirmAddContractOrder,      //确认新增充值
	confirmAddContractOrderProduct, //新增课时包

	updateContractOrder,             //确认修改合同
	updateContractOrderProduct,      //确认修改课时包合同


	getOrderInfo                   //得到订单详情

}from '../../../../services/crm/contract-order/contractOrderCreateService';
import { parse } from 'qs';
import { message } from 'antd';
export default {

  	namespace: 'contractOrderCreateModel',

  	state: {
		contractOrderCreateVisible             : false,
		parentIdList                           : [],       //家长下拉列表
		vipCardList                            : [],       //会员卡号下拉列表
		stuIdList                              : [],       //学员下拉列表
		productList                            : [],       //产品下拉列表
		teachingList                           : [],       //教材下拉列表
		salesList                              : [],       //销售下拉列表
		paywayList                             : [],       //收款方式下拉

		contractOrderInfo                      : {},       //合同订单详情
		totalPrice                             : 0,        //总合计
		totalMoney                             : 0,        //总实收

		orgId                                  : undefined,
		orderId                                : undefined, //合同编号

		btnLoading                             : false,

		orderNum                               : undefined,

	},

  	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if( pathname == '/contract_order' ) {

				}
          	});
      	},
  	},

  	effects: {
		/*打开合同新增模态框*/
		*openContractOrderModal({ payload },{ call, put, select }){
			let { orderId, updateOrgId } = payload;
			let state = yield select( state => state.contractOrderCreateModel );
			let contractOrderCreateVisible = state.contractOrderCreateVisible;
			let orgId = updateOrgId || window._init_data.firstOrg.key;
			if( !!orderId ){
				let { ret } = yield call( getOrderInfo, ({ orderId : orderId }));
				if( ret && ret.errorCode == 9000 ){
					yield put({
						type : 'updateState',
						payload : {
							contractOrderInfo : ret,
							orderId           : orderId,
							totalPrice        : ret.oriMoney + ret.taOriMoney,        //总合计
							totalMoney        : ret.dictMoney + ret.taMoney,          //总实收
						}
					})
					let vipCardList = yield call( getVipCardList, ({ parentId : ret.parentId, orgId : orgId }));
					if( vipCardList && vipCardList.ret && vipCardList.ret.errorCode == 9000 ){
						yield put({
							type : 'updateState',
							payload : {
								vipCardList : vipCardList.ret.results
							}
						})
					}else{
						message.error( vipCardList && vipCardList.ret && vipCardList.ret.errorMessage || '查询会员卡下拉失败' )
					}
					if( !!ret.stuId && !!ret.stuCardId ){
						let stuIdList = yield call( getStuIdListByCard, ({ id : ret.stuCardId }));
						if( stuIdList && stuIdList.ret && stuIdList.ret.errorCode == 9000 ){
							yield put({
								type : 'updateState',
								payload : {
									stuIdList : stuIdList.ret.results
								}
							})
						}else{
							message.error( stuIdList && stuIdList.ret && stuIdList.ret.errorMessage || '查询学员下拉失败' )
						}
					}else{
						let stuIdList = yield call( getStuIdList, ({ parentId : ret.parentId }));
						if( stuIdList && stuIdList.ret && stuIdList.ret.errorCode == 9000 ){
							yield put({
								type : 'updateState',
								payload : {
									stuIdList : stuIdList.ret.results
								}
							})
						}else{
							message.error( stuIdList && stuIdList.ret && stuIdList.ret.errorMessage || '查询学员下拉失败' )
						}
					}
				}
			}else{
				let { ret } = yield call( getOrderNum );
				if( ret && ret.errorCode == 9000 ){
					yield put({
						type : 'updateState',
						payload : {
							orderNum : ret.orderNum
						}
					})
				}else{
					message.error( ret && ret.errorMessage || '获取随机合同编号失败' )
				}
			}

			/*得到校区下的家长*/
			let parentIdList = yield call( getParentIdList, ({ orgId : orgId }));
			if( parentIdList && parentIdList.ret && parentIdList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						parentIdList : parentIdList.ret.results,
					}
				})
			}else{
				message.error( parentIdList && parentIdList.ret && parentIdList.ret.errorMessage || '家长下拉获取失败' )
			}

			/*得到产品下拉列表*/
			let productList = yield call( getProductList, ({ orgId : orgId, status : '1', pageSize : 99999 }));
			if( productList && productList.ret && productList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						productList : productList.ret.results
					}
				})
			}else{
				message.error( productList && productList.ret && productList.ret.errorMessage || '产品下拉获取失败' )
			}

			/*得到教材下拉列表*/
			let teachingList = yield call( getTeachingList, ({ orgId : orgId, status : '1', pageSize : 99999 }));
			if( teachingList && teachingList.ret && teachingList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						teachingList : teachingList.ret.results
					}
				})
			}else{
				message.error( teachingList && teachingList.ret && teachingList.ret.errorMessage || '教材下拉获取失败' )
			}

			/*得到销售下拉列表*/
			let salesList = yield call( getSalesList, ({ orgId : orgId }));
			if( salesList && salesList.ret && salesList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						salesList : salesList.ret.results
					}
				})
			}else{
				message.error( salesList && salesList.ret && salesList.ret.errorMessage || '销售下拉获取失败' )
			}

			/*得到收款下拉列表*/
			let paywayList = yield call( getPaywayList, ({ orgId : orgId }));
			if( paywayList && paywayList.ret && paywayList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						paywayList : paywayList.ret.results
					}
				})
			}else{
				message.error( paywayList && paywayList.ret && paywayList.ret.errorMessage || '收款方式下拉获取失败' )
			}

			yield put({
				type : 'updateState',
				payload : {
					contractOrderCreateVisible : !contractOrderCreateVisible,
					orgId,
				}
			})
		},

		/*选择校区得到家长列表*/
		*TenantSelectOnSelect({ payload },{ call, put, select }){
			let { value } = payload;
			let { ret } = yield call( getParentIdList, ({ orgId : value }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						parentIdList : ret.results,
						orgId        : value
					}
				})
			}

			/*得到产品下拉列表*/
			let productList = yield call( getProductList, ({ orgId : value, status : '1', pageSize : 99999 }));
			if( productList && productList.ret && productList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						productList : productList.ret.results
					}
				})
			}else{
				message.error( productList && productList.ret && productList.ret.errorMessage || '产品下拉获取失败' )
			}

			/*得到教材下拉列表*/
			let teachingList = yield call( getTeachingList, ({ orgId : value, status : '1', pageSize : 99999 }));
			if( teachingList && teachingList.ret && teachingList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						teachingList : teachingList.ret.results
					}
				})
			}else{
				message.error( teachingList && teachingList.ret && teachingList.ret.errorMessage || '教材下拉获取失败' )
			}

			/*得到销售下拉列表*/
			let salesList = yield call( getSalesList, ({ orgId : value }));
			if( salesList && salesList.ret && salesList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						salesList : salesList.ret.results
					}
				})
			}else{
				message.error( salesList && salesList.ret && salesList.ret.errorMessage || '销售下拉获取失败' )
			}

			/*得到收款下拉列表*/
			let paywayList = yield call( getPaywayList, ({ orgId : value }));
			if( paywayList && paywayList.ret && paywayList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						paywayList : paywayList.ret.results
					}
				})
			}else{
				message.error( paywayList && paywayList.ret && paywayList.ret.errorMessage || '收款方式下拉获取失败' )
			}
		},

		/*选择家长查询会员卡 以及学员下拉*/
		*parentIdChange({ payload },{ call, put, select }){
			let { value, stuOldNew } = payload;
			let state = yield select( state => state.contractOrderCreateModel );
			if( stuOldNew == '0' ){
				//根据家长获取学员下拉列表(带会员卡信息)
				let { ret } = yield call( getStuIdList, ({ parentId : value }));
				if( ret && ret.errorCode == 9000 ){
					yield put({
						type : 'updateState',
						payload : {
							stuIdList : ret.results
						}
					})
				}else{
					message.error( ret && ret.errorMessage || '查询学员下拉列表失败' )
				}
			}else if( stuOldNew == '1' ){
				//根据家长获取会员卡列表(带学员信息)
				let { ret } = yield call( getVipCardList, ({ parentId : value, orgId : state.orgId }));
				if( ret && ret.errorCode == 9000 ){
					yield put({
						type : 'updateState',
						payload : {
							vipCardList : ret.results
						}
					})
				}
			}else{
				message.error( ret && ret.errorMessage || '查询会员卡下拉列表失败' )
			}
		},

		/*新增合同*/
		*confirmAddContractOrder({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					btnLoading : true
				}
			})
			let { values, refreshList } = payload;
			let state = yield select( state => state.contractOrderCreateModel );
			let contractOrderCreateVisible = state.contractOrderCreateVisible;
			let startTime = undefined;
			let endTime = undefined;
			if( values.time.length > 0 ){
				startTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
				endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');
			}
			let orderId = state.orderId;
			if( values.orderType == '1' ){
				let params = {
					organId   : values.orgId,
					stuId     : !!values.stuId && values.stuId.join(','),
					signType  : values.signType,
					stuOldNew : values.stuOldNew,
					orderType : values.orderType,
					money     : values.money,
					saleUser  : JSON.stringify(values.saleUser),
					remark    : values.remark,
					startTime,
					endTime,
					parentId  : values.parentId,
					stuCardId : values.stuCardId,

					orderNum  : values.orderNum,
					imgUrl    : values.imgUrl,
					extPeriodReason : values.extPeriodReason,
					signTime  : values.signTime && values.signTime.format('YYYY-MM-DD')
				}
				let ret = {};
				if( !!orderId ){
					ret = yield call( updateContractOrder , ({ ...params, orderId : orderId }))
				}else{
					ret = yield call( confirmAddContractOrder, ( params ));
				}
				if( ret && ret.ret && ret.ret.errorCode == 9000 ){
					refreshList();
					yield put({
						type : 'updateState',
						payload : {
							contractOrderCreateVisible : !contractOrderCreateVisible,
							contractOrderInfo          : {},
							parentIdList               : [],
							vipCardList                : [],
							stuIdList                  : [],
							productList                : [],
							teachingList               : [],
							salesList                  : [],
							paywayList                 : [],

							orderId                    : undefined,

                            totalPrice                 : 0,
                            totalMoney                 : 0
						}
					})
				} else{
					message.error( ret && ret.ret && ret.ret.errorMessage || '新增合同失败' )
				}
			}else if( values.orderType == '2' ){
				let params = {
					organId    : values.orgId,
					stuId      : !!values.stuId && values.stuId.join(','),
					stuOldNew  : values.stuOldNew,
					signType   : values.signType,
					orderType  : values.orderType,
					classpkg   : JSON.stringify(values.classpkg),
					teachTools : JSON.stringify( values.teachTools ),
					saleUser   : JSON.stringify(values.saleUser),
					taMoney    : values.taMoney,               //教材折扣
					taOriMoney : values.taOriMoney,            //教材原价
					oriMoney   : values.oriMoney,              //课时包原价
					dictMoney  : values.dictMoney,             //课时包折扣
					remark     : values.remark,
					startTime,
					endTime,
					parentId   : values.parentId,
					stuCardId  : values.stuCardId,
					extPeriod  : values.extPeriod || 0,
					extPeriodMoney : values.extPeriodMoney || 0,

					orderNum   : values.orderNum,
					imgUrl    : values.imgUrl,
					extPeriodReason : values.extPeriodReason,
					signTime   : values.signTime && values.signTime.format('YYYY-MM-DD')

				}
				let ret = {};
				if( !!orderId ){
					ret = yield call( updateContractOrderProduct , ({ ...params, orderId : orderId }));
				}else{
					ret = yield call( confirmAddContractOrderProduct, ( params ));
				}
				if( ret && ret.ret && ret.ret.errorCode == 9000 ){
					//打开收款单
					let currentItem = {
						orderNumber    : ret.ret.orderId,
						orderMoney     : values.taMoney + values.dictMoney,
						orderNewOldstu : values.signType,
						...params
					}
					if( ret.ret.receiptStatus == '0' ){
						message.success('合同保存成功, 正在创建收款单')
						yield put({
							type : 'contractOrderReceiptFormModel/openReceiptContract',
							payload : {
								currentItem
							}
						})
					}else{
						message.success('合同保存成功且已收款');
					}
					refreshList();
					yield put({
						type : 'updateState',
						payload : {
							contractOrderCreateVisible : !contractOrderCreateVisible,
							contractOrderInfo          : {},
							parentIdList               : [],
							vipCardList                : [],
							stuIdList                  : [],
							productList                : [],
							teachingList               : [],
							salesList                  : [],
							paywayList                 : [],

							orderId                    : undefined,

                            totalPrice                 : 0,
                            totalMoney                 : 0
						}
					})
				} else{
					message.error( ret && ret.ret && ret.ret.errorMessage || '新增合同失败' )
				}
				yield put({
					type : 'updateState',
					payload : {
						btnLoading : false,
					}
				})
			}
		},

		/*仅仅保存合同*/
		*confirmAddContractOrderOnly({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					btnLoading : true
				}
			})
			let { values, refreshList } = payload;
			let state = yield select( state => state.contractOrderCreateModel );
			let contractOrderCreateVisible = state.contractOrderCreateVisible;
			let startTime = undefined;
			let endTime = undefined;
			if( values.time.length > 0 ){
				startTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
				endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');
			}
			let orderId = state.orderId;
			if( values.orderType == '1' ){
				let params = {
					organId : values.orgId,
					stuId   : !!values.stuId && values.stuId.join(','),
					signType  : values.signType,
					stuOldNew : values.stuOldNew,
					orderType : values.orderType,
					money     : values.money,
					saleUser  : JSON.stringify(values.saleUser),
					remark    : values.remark,
					startTime,
					endTime,
					parentId  : values.parentId,
					stuCardId : values.stuCardId,

					orderNum  : values.orderNum,
					imgUrl    : values.imgUrl,
					extPeriodReason : values.extPeriodReason,
					signTime  : values.signTime && values.signTime.format('YYYY-MM-DD')
				}
				let ret = {};
				if( !!orderId ){
					ret = yield call( updateContractOrder , ({ ...params, orderId : orderId }))
				}else{
					ret = yield call( confirmAddContractOrder, ( params ));
				}
				if( ret && ret.ret && ret.ret.errorCode == 9000 ){
					refreshList();
					yield put({
						type : 'updateState',
						payload : {
							contractOrderCreateVisible : !contractOrderCreateVisible,
							contractOrderInfo          : {},
							parentIdList               : [],
							vipCardList                : [],
							stuIdList                  : [],
							productList                : [],
							teachingList               : [],
							salesList                  : [],
							paywayList                 : [],

							orderId                    : undefined,

                            totalPrice                 : 0,
                            totalMoney                 : 0
						}
					})
				} else{
					message.error( ret && ret.ret && ret.ret.errorMessage || '新增合同失败' )
				}
			}else if( values.orderType == '2' ){
				let params = {
					organId    : values.orgId,
					stuId      : !!values.stuId && values.stuId.join(','),
					stuOldNew  : values.stuOldNew,
					signType   : values.signType,
					orderType  : values.orderType,
					classpkg   : JSON.stringify(values.classpkg),
					teachTools : JSON.stringify( values.teachTools ),
					saleUser   : JSON.stringify(values.saleUser),
					taMoney    : values.taMoney,               //教材折扣
					taOriMoney : values.taOriMoney,            //教材原价
					oriMoney   : values.oriMoney,              //课时包原价
					dictMoney  : values.dictMoney,             //课时包折扣
					remark     : values.remark,
					startTime,
					endTime,
					parentId   : values.parentId,
					stuCardId  : values.stuCardId,
					extPeriod  : values.extPeriod || 0,
					extPeriodMoney : values.extPeriodMoney || 0,

					orderNum   : values.orderNum,
					imgUrl    : values.imgUrl,
					extPeriodReason : values.extPeriodReason,
					signTime   : values.signTime && values.signTime.format('YYYY-MM-DD')
				}
				let ret = {};
				if( !!orderId ){
					ret = yield call( updateContractOrderProduct , ({ ...params, orderId : orderId }));
				}else{
					ret = yield call( confirmAddContractOrderProduct, ( params ));
				}
				if( ret && ret.ret && ret.ret.errorCode == 9000 ){
					message.success('合同保存成功')
					refreshList();
					yield put({
						type : 'updateState',
						payload : {
							contractOrderCreateVisible : !contractOrderCreateVisible,
							contractOrderInfo          : {},
							parentIdList               : [],
							vipCardList                : [],
							stuIdList                  : [],
							productList                : [],
							teachingList               : [],
							salesList                  : [],
							paywayList                 : [],

							orderId                    : undefined,

                            totalPrice                 : 0,
                            totalMoney                 : 0
						}
					})
				} else{
					message.error( ret && ret.ret && ret.ret.errorMessage || '新增合同失败' )
				}
				yield put({
					type : 'updateState',
					payload : {
						btnLoading : false,
					}
				})
			}
		}
  	},

  	reducers: {
		updateState( state, action ){
			return { ...state, ...action.payload };
		},
  	},
}
