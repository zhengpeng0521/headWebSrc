import {
	getVipList,
} from '../../../../services/crm/vip-manage/vipManageService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'vipManageModel',

    state : {
		/*快捷搜索*/
        fastSearchContent     : {},         //快捷搜索内容

		/*高级搜索*/
		searchVisible         : false,
        superSearchContent    : {},         //高级搜索内容

		/*表格项*/
		loading               : false,
		dataSource            : [],
		newColumns            : [],
		resultCount           : 0,
		pageIndex             : 0,
		pageSize              : 20
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if(pathname === '/hq_orgdata_stucard'){
                    dispatch({
                        type : 'getVipList',
                        payload : {
                            pageIndex : 0,
                            pageSize : 20
                        }
                    })
				}
            })
        }
    },

    effects : {
		//得到vip列表
		*getVipList({ payload },{ call, put, select }){
			yield put({ type : 'showTableLoading' });
            let fastSearchContent = {};
            let superSearchContent = {};
            if( payload && payload.fastSearchContent ){
                fastSearchContent = payload.fastSearchContent;
                delete payload.fastSearchContent;
            }
            if(payload && payload.superSearchContent){
                superSearchContent = payload.superSearchContent;
                delete payload.superSearchContent;
            }
            let params = { ...payload , ...fastSearchContent , ...superSearchContent };
			let { ret } = yield call( getVipList, ( params ) );
			if( ret && ret.errorCode == '9000' ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource  : ret.results,
						resultCount : ret.data.resultCount,
                        pageIndex : ret.data.pageIndex,
                        pageSize : ret.data.pageSize,
                        fastSearchContent,
                        superSearchContent,
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '查询会员卡列表出错' )
			}
			yield put({ type : 'closeTableLoading' })
		}
    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        },
        showTableLoading( state, action ){
            return { ...state, loading : true };
        },
        closeTableLoading( state, action ){
            return { ...state, loading : false };
        },
    }
}
