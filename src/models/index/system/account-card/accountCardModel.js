import {message} from 'antd';
import { parse } from 'qs';
import {getAccountCardList, deleteAccountCard, getAccountCardDetail} from '../../../../services/system/account-card/accountCardService';

//收付款账号
export default {

  namespace : 'accountCardModel',

  state: {
	  newColumns      : [],
      pageIndex       : 0,
      pageSize        : 20,
      total           : 0,
      loading         : false,
      dataSource      : [],
      selectedRowKeys : [],
      selectedRows    : [],

      showSearch        : false,
      query             : {},       //模糊检索的条件

      listOrgShow       : false,    //列表界面的校区选择是否打开
      record_org_select : [],       //列表界面选中的校区
  },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/sys_scfg_payacct_list') {

                }
            });
        },
    },

    effects: {
        /*查询通知列表*/
        *'queryList'({ payload } , { put , call , select }){
            yield put({ type : 'updateState', payload : { loading : true } });
            let accountCardModel = yield select(state => state.accountCardModel);
            payload = payload || {};
            let pageIndex = payload.pageIndex != undefined ? payload.pageIndex : accountCardModel.pageIndex;
            let pageSize = payload.pageSize != undefined ? payload.pageSize    : accountCardModel.pageSize;
            let query = payload.query || accountCardModel.query;
            let queryParams = {
                pageIndex,pageSize, // ...query,
            };
            let { ret } = yield call( getAccountCardList, parse(queryParams));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource : ret.results,
                        total : ret.data.resultCount,
                        pageIndex : ret.data.pageIndex,
                        pageSize : ret.data.pageSize,
                        selectedRowKeys : [],
                        query,
                    }
                });
            }else{
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource : [],
                        total      : 0,
                        selectedRowKeys : [],
                    }
                });
                message.error((ret && ret.errorMessage) || '没有获取到账号列表');
            }
            yield put({ type : 'updateState', payload : { loading : false } });
        },

        /*删除收付款账号*/
        *'deleteBatch'({ payload } , { put , call , select }){
            let queryParams = {
                ids: payload.ids,
            };
            let { ret } = yield call( deleteAccountCard, parse(queryParams));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'queryList',
                });
            }else{
                message.error((ret && ret.errorMessage) || '删除账号出现错误啦');
            }
        },

        /*查询详情*/
        *'showRecordOrgSelect'({ payload } , { put , call , select }){
            let { ret } = yield call( getAccountCardDetail, parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type : 'changeListOrgShow',
                    payload : {
                       orgSelect: ret.organs,
                    }
                });
            }else{
                message.error((ret && ret.errorMessage) || '收付款账号不存在或者已经被删除');
            }
        },
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },

        /*显隐模糊检索栏*/
        changeShowSearch(state, action) {
            let showSearch = state.showSearch;
            return {...state, showSearch: !showSearch};
        },

        /*显隐模糊检索栏*/
        changeShowLoading(state, action) {
            let loading = state.loading;
            return {...state, loading: !loading};
        },

        /*关闭列表界面的校区选择*/
        closeListOrgShow(state, action) {
            return {...state, listOrgShow: false, record_org_select: []};
        },

        /*修改列表界面的校区选择*/
        changeListOrgShow(state, action) {
            let {orgSelect}   = action.payload;
            let {listOrgShow} = state;
            let record_org_select = [];
            if(orgSelect && orgSelect.length > 0) {
                record_org_select = orgSelect.split(',');
            }
            return {...state, listOrgShow: !listOrgShow, record_org_select,};
        },
    }
}
