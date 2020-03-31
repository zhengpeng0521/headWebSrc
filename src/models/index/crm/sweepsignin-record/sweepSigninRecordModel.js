/**
 * Created by zhaosi on 2017/5/8.
 */
import {message} from 'antd';
import { parse } from 'qs';
import { listenrecordsList, repealSignrecode,} from '../../../../services/crm/sweepsignin-record/SweepSigninRecordService';

//学员签到记录
export default {

    namespace: 'sweepSigninRecordModel',

    state: {
        pageIndex: 0,
        pageSize: 10,
        total: 0,
        loading: false,
        dataSource: [],
        selectedRowKeys: [],

        showSearch: false,
        query: {},//模糊检索的条件
        initQuery: {},//初始查询条件
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/scrm_woffice_sign') {

                    dispatch({
                        type: 'updateState',
                        payload: {
                            initQuery: query,

                        }
                    });

                    dispatch({
                        type: 'queryList',
                        payload: {
                            query
                        }
                    });

                }
            });
        },
    },

    effects: {

        /*查询通知列表*/
        *queryList({ payload } , { put , call , select }){


            yield put({
                type : 'changeShowLoading',
            });

            let sweepSigninRecordModel = yield select(state => state.sweepSigninRecordModel);

            payload = payload || {};
            let pageIndex = payload.pageIndex != undefined ? payload.pageIndex : sweepSigninRecordModel.pageIndex;
            let pageSize = payload.pageSize != undefined ? payload.pageSize    : sweepSigninRecordModel.pageSize;
            let query = payload.query || sweepSigninRecordModel.query;

            let queryParams = {
                pageIndex,pageSize,...query,
            };

            let { ret } = yield call( listenrecordsList, parse(queryParams));

            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource: ret.results,
                        total: ret.data.resultCount,
                        loading: false,
                        pageIndex,pageSize,query,
                        selectedRowKeys: [],
                    }
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });
                message.error((ret && ret.errorMessage) || '没有查询到签到记录');
            }
        },

            /*查询通知列表*/
        *cancleSign({ payload } , { put , call , select }){
            yield put({
                type : 'changeShowLoading',
            });

            let  params= {
                id: payload.id,
                status: '0',
            };
            let { ret } = yield call(repealSignrecode, parse(params));

            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'queryList',
                });
            } else {
                message.error((ret && ret.errorMessage) || '撤销签到出错啦');
            }
            yield put({
                type : 'changeShowLoading',
            });
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

    }
}

