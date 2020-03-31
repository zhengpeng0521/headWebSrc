import { parse } from 'qs';
export default {

  namespace: 'textbookSaleModel',

  state: {
        //search
      showSearch                     : false,

      //table
      textbookSaleRecordDataSource   : [],
      selectedRowKeys                : [],   //选中数据数组
      selectedRows                   : [],
      pageIndex                      : 0,
      pageSize                       : 10,


  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/textbookSale_record') {
                     dispatch({
                        type: 'getTextbookSaleList',
                        payload: {

                        },
                    });
              }
          });
      },
  },

  effects: {

      //教材出售列表
		*getTextbookSaleList({ payload } , { put , call , select }){
            let { ret } = yield call( getTextbookSaleList );
            if( ret && ret.errorCode == 9000 ){
                let textbookSaleRecordDataSource = ret.results;
                yield put({
                    type : 'updateState',
                    payload : {
                        textbookSaleRecordDataSource
                    }
                })
            }
		},

       //显隐筛选框
        *showSearchFunction( { payload },{ select , call , put }){
            let { showSearch } = payload;
            yield put ({
                type : 'updateState',
                payload : {
                    showSearch : !showSearch
                }
            });
        },

        //分页
        *paginationChange({ payload} , { call ,put , select}){
            let { pageIndex , pageSize } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    pageIndex,pageSize
                }
            })
        },





},


  reducers: {
	  updateState(state, action) {return {...state, ...action.payload};},
  }
}
