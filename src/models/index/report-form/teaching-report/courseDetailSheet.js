import {
    QueryList
} from '../../../../services/report-form/teaching-report/courseDetailSheet';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

//课时详情表
export default {

  namespace: 'courseDetailSheet',

    state: {
        firstEnter : true,              //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        /*列表*/
        tableLoading : false,           //列表加载状态
        tableDataSource : [],           //列表数据
        tableTotal : 0,                 //列表条数
        tablePageIndex : 0,             //列表页码
        tablePageSize : 50,             //列表每页条数
        exportSearchContent : {},       //报表导出条件(没有分页信息)

        buttonLoading : false,          //生成报表按钮加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/hq_orgstats_costdetail') {
                    //初次进入页面查询当天数据
                    dispatch({
                        type : 'InitialQuery',
                        payload : {
                            firstEnter : true,
                            pageIndex : 0,
                            pageSize : 50,
                            exportSearchContent : window.GetNowDateAndTime()
                        }
                    });
                }
            });
        },
    },

    effects: {
        //初次进入页面查询当天数据
        *'InitialQuery'({ payload },{ call, put, select }){
            yield put({ type : 'QueryList', payload });
        },
        /*查询*/
        *'QueryList'({ payload },{ call, put, select }){
            yield put({ type : 'showTableLoading' });
            yield put({ type : 'showButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
            let exportSearchContent = payload.exportSearchContent;
            delete payload.firstEnter;
            delete payload.exportSearchContent;
            let params = { ...payload , ...exportSearchContent };
            let res = yield call(QueryList,parse(params));
            if (!!res && res.ret && res.ret.errorCode === 9000) {
                let { ret } = res;
                yield put({
                    type:'updateState',
                    payload:{
                        tableDataSource : ret.results || [],
                        tablePageIndex : ret.data && ret.data.pageIndex || 0,
                        tablePageSize : ret.data && ret.data.pageSize || 50,
                        tableTotal : ret.data && ret.data.resultCount || 0,
                        exportSearchContent,
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '查询失败');
                yield put({
                    type:'updateState',
                    payload:{
                        tableDataSource : [],
                        tablePageIndex : 0,
                        tablePageSize : 50,
                        tableTotal : 0,
                        exportSearchContent,
                    }
                })
            }
            yield put({ type : 'closeTableLoading' });
            yield put({ type : 'closeButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : false }});                              //报表头部已初始化，需要将状态重置
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        showTableLoading(state, action){
            return { ...state, tableLoading : true };
        },
        closeTableLoading(state, action){
            return { ...state, tableLoading : false };
        },
        showButtonLoading(state, action){
            return { ...state, buttonLoading : true };
        },
        closeButtonLoading(state, action){
            return { ...state, buttonLoading : false };
        },
    },
}
