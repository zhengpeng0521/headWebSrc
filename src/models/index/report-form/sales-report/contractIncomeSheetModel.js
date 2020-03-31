import {
	getIncomeByType,
	getIncomeByClassPackage,
	getIncomeByTeachingList

} from '../../../../services/report-form/sales-report/contractIncomeSheetService';
import { parse } from 'qs';
import qs from 'qs';
import { message } from 'antd';

//统计报表 合同收入表
export default {

    namespace: 'contractIncomeSheetModel',

    state: {
		firstEnter                      : true,          //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)

		newSignMoney                    : 0,
		oldSignMoney                    : 0,
		newSignIntroMoney								: 0,
		newStuMoney                     : 0,
		oldStuMoney                     : 0,
		incomeByClassPackageList        : [],
		incomeByTeachingList            : [],
		nurseryList						: [],
		loading                         : false,

		exportSearchContent             : {},
	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/hq_orgstats_purchaseincome') {
                    dispatch({
                        type : 'updateState',
						payload : {
							newSignMoney                    : 0,
							oldSignMoney                    : 0,
							newStuMoney                     : 0,
							oldStuMoney                     : 0,
							incomeByClassPackageList        : [],
							incomeByTeachingList            : [],
							exportSearchContent             : {}
						}
                    });
					dispatch({
						type : 'generatingReports',
						payload : {
							exportSearchContent : window.GetNowDateAndTime(),
							firstEnter          : true
						}
					})
                }
            });
        },
    },

    effects: {
		*generatingReports({ payload },{ call, put, select }){
			yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
			let { exportSearchContent } = payload;
			yield put({
				type : 'updateState',
				payload : {
					exportSearchContent : exportSearchContent,
					loading : true
				}
			})

			/*通过签约类型查询合同收入*/
			let { ret } = yield call( getIncomeByType, ( exportSearchContent ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						newStuMoney  : ret.newStuMoney || 0,
						oldStuMoney  : ret.oldStuMoney || 0,
						newSignMoney : ret.newSignMoney || 0,
						oldSignMoney : ret.renewalMoney || 0,
						newSignIntroMoney: ret.newSignIntroMoney || 0
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '通过签约类型查询合同收入失败' );
			}

			/*通过课时套餐查询合同收入*/
			let incomeByClassPackageList = yield call( getIncomeByClassPackage , ({ ...exportSearchContent, proType: '1' }));
			if( incomeByClassPackageList && incomeByClassPackageList.ret && incomeByClassPackageList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						incomeByClassPackageList : incomeByClassPackageList.ret.results
					}
				})
			}else{
				message.error( incomeByClassPackageList && incomeByClassPackageList.ret && incomeByClassPackageList.ret.errorMessage || '通过课时套餐查询合同收入失败' )
			}

			/*通过托班套餐查询合同收入*/
			let incomeByNurseryList = yield call( getIncomeByClassPackage , ( {...exportSearchContent, proType: '3'} ));
			if( incomeByNurseryList && incomeByNurseryList.ret && incomeByNurseryList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						nurseryList : incomeByNurseryList.ret.results
					}
				})
			}else{
				message.error( incomeByNurseryList && incomeByNurseryList.ret && incomeByNurseryList.ret.errorMessage || '通过托班套餐查询合同收入失败' )
			}

			/*通过教材查询合同收入*/
			let incomeByTeachingList = yield call( getIncomeByTeachingList, ( exportSearchContent ));
			if( incomeByTeachingList && incomeByTeachingList.ret && incomeByTeachingList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						incomeByTeachingList : incomeByTeachingList.ret.results
					}
				})
			}else{
				message.error( incomeByTeachingList && incomeByTeachingList.ret && incomeByTeachingList.ret.errorMessage || '通过教材查询合同收入失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					loading : false,
					firstEnter : false
				}
			})
		}
	},


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
    },
};
