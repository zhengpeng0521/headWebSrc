import { message } from 'antd';
import { parse } from 'qs';

import  {
	getOfflineList
} from '../../../../services/crm/crmOfflineBooking-service/crmOfflineBooking-service';

//学员签到记录
export default {

	namespace: 'crmOfflineBookingModel',

  	state : {
		isChecked         : true,      //学员名单 是否被选中
		isPickOn          : false,     //学员试听是否被中
		loading           : false,
		dataSource        : [],
		resultCount       : 0,
		pageIndex         : 0,
		pageSize          : 20,

		source            : '2',

		fastSearchContent : {},                       //快捷搜索栏搜索内容
		/*高级搜索*/
		superSearchContent : {},                      //高级搜索栏搜
		CreateOfflinebookSuperSearchVisible : false,  //高级搜索是否显示

		TableNewColumns    : [],                         //table设置

		reset              : undefined,                  //切换 学员名单时 重置高级搜索
		commonReset        : undefined,                  //常用搜索 重置
  	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if( pathname === '/hq_orgdata_rev' ) {
					dispatch({
						type : 'getTableList',
						payload : {
							pageIndex          : 0,
							pageSize           : 20,
							source             : '2',
							sourceType         : '0',
							fastSearchContent  : {},
							superSearchContent : {}
						}
					})
				}
			});
		},
	},

  effects: {
	//常用搜索
	*onSearch({ payload },{ call, put, select }){
		let { values } = payload;
		let state = yield select( state => state.crmOfflineBookingModel );
		yield put({
			type : 'getTableList',
			payload : {
				pageIndex          : 0,
				pageSize           : state.pageSize,
				source             : state.source,
				fastSearchContent  : values,
				superSearchContent : state.superSearchContent
			}
		})
	},

	//切换 学员或名单试听
	*changeLeadsOrStu({ payload },{ call, put, select }){
		let { source } = payload;
		let state = yield select( state => state.crmOfflineBookingModel );
		yield put({
			type : 'getTableList',
			payload : {
				pageIndex          : 0,
				pageSize           : state.pageSize,
				source             : source,
				fastSearchContent  : {},
				superSearchContent : {}
			}
		})
	},

	//高级搜索
	*onSuperSearch({ payload },{ call, put, select }){
		let { values } = payload;
		let state = yield select( state => state.crmOfflineBookingModel );
		yield put({
			type : 'getTableList',
			payload : {
				pageIndex          : 0,
				pageSize           : state.pageSize,
				source             : state.source,
				fastSearchContent  : state.fastSearchContent,
				superSearchContent : values
			}
		})
	},

	//分页
	*pagination({ payload },{ call, put, select }){
		let { pageIndex, pageSize } = payload;
		let state = yield select( state => state.crmOfflineBookingModel );
		yield put({
			type : 'getTableList',
			payload : {
				pageIndex          : pageIndex - 1,
				pageSize           : pageSize,
				source             : state.source,
				fastSearchContent  : state.fastSearchContent,       //更新常用搜索内容项
				superSearchContent : state.superSearchContent,      //更新高级搜索内同
			}
		})
	},

      *getTableList({ payload },{ call, put, select }){
          yield put({ type : 'updateState', payload : { loading : true }});
          let state = yield select( state => state.crmOfflineBookingModel );
          let fastSearchContent = payload.fastSearchContent || {};
          let superSearchContent = payload.superSearchContent || {};
          delete payload.fastSearchContent;
          delete payload.superSearchContent;
          let params = { ...payload , ...fastSearchContent , ...superSearchContent };
          let { ret } = yield call( getOfflineList, ( params ));
          if ( ret && ret.errorCode === 9000 ) {
              if(( ret.results ).length == 0 && params.pageIndex > 0){
                  params.pageIndex -= 1;
                  let { ret } = yield call( getOfflineList, ( params ));
                  if (ret && ret.errorCode === 9000){
					  yield put({
						  type  :'updateState',
						  payload : {
							  dataSource         : ret.results,
							  resultCount        : ret.data.resultCount,
							  pageIndex          : ret.data.pageIndex,
							  pageSize           : ret.data.pageSize,
							  source             : payload.source,
							  fastSearchContent  : fastSearchContent,          //更新常用搜索内容项
							  superSearchContent : superSearchContent,         //更新高级搜索内同
						  }
					  });
                  }else if( ret && ret.errorMessage ){
					  message.error(ret.errorMessage);
				  }else{
					  message.error('获取列表数据失败');
                  }
              }else{
                  yield put({
                      type  : 'updateState',
                      payload : {
						  dataSource          : ret.results,
						  resultCount         : ret.data.resultCount,
						  pageIndex           : ret.data.pageIndex,
						  pageSize            : ret.data.pageSize,
						  source              : payload.source,
						  fastSearchContent   : fastSearchContent,      //更新常用搜索内容项
						  superSearchContent  : superSearchContent,     //更新高级搜索内同
                      }
                  });
              }
          }else{
			  message.error( ret.errorMessage || '获取列表数据失败' );
		  }
          yield put({ type : 'updateState', payload : { loading : false } })
      }
  },

  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },
  }
}
