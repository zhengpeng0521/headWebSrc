import {
	getContractStuList
} from '../../../../services/report-form/teaching-report/stuSilenceSheetService';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

//学员沉默表
export default {

	namespace: 'stuSilenceSheetModel',

    state: {
		firstEnter          : true,          //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)

		loading             : false,
		newPurStuNum        : 0,                 //新签学员
		renewPurStuNum      : 0,                 //续约学员

		oldStuNum           : 0,                 //老学员
		newStuNum           : 0,                 //新学员
		uncostStuNum        : '--',              //未消耗课时学员

		exportSearchContent : {},
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/hq_orgstats_stusilence') {
					dispatch({
						type : 'updateState',
						payload : {
							newPurStuNum        : 0,
							renewPurStuNum      : 0,
							oldStuNum           : 0,
							newStuNum           : 0,
							uncostStuNum        : '--',
							exportSearchContent : {}
						}
					})
					dispatch({
						type : 'GeneratingReports',
						payload : {
							values      : window.GetNowDateAndTime(),
							firstEnter  : true
						}
					})
                }
            });
        },
    },

    effects: {
		/*生成报表 */
		*GeneratingReports({ payload },{ call, put, select }){
			yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
			let { values } = payload;
			yield put({
				type : 'updateState',
				payload : {
					loading : true,
					exportSearchContent : values
				}
			})
			let { ret } = yield call( getContractStuList, ( values ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						newPurStuNum   : ret.newPurStuNum,
						renewPurStuNum : ret.renewPurStuNum,
						oldStuNum      : ret.oldStuNum,
						newStuNum      : ret.newStuNum,
						uncostStuNum   : ret.uncostStuNum
					}
				})
			}else {
				message.error( ret && ret.errorCode || '服务加载中' )
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
            return { ...state, ...action.payload };
        }
    },
}
