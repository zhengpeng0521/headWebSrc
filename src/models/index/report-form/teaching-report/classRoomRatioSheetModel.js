/*
* @author yhwu
* 教室利用率 报表
*/
import { queryList } from '../../../../services/report-form/teaching-report/classRoomRatioService';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

export default {

  namespace: 'classRoomRatioSheetModel',

    state: {
		firstEnter                 : true,            //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
		tableLoading               : false,           //列表loading状态
		tableTotal                 : 0,               //列表总数据
		tablePageSize              : 40,              //列表分页大小
		tablePageIndex             : 0,               //列表分页页数
		tableDataSource            : [],              //列表数据

		exportSearchContent        : {},              //导出所需要的参数
        buttonLoading              : false,           //生成报表按钮加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname, query }) => {
                if(pathname === '/hq_orgstats_roomuse') {
                    //初次进入页面查询当天数据
                    dispatch({
                        type : 'InitialQuery',
                        payload : {
                            firstEnter : true,
                            pageIndex : 0,
                            pageSize : 20,
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
            yield put({ type : 'queryList', payload });
        },
		/*生成报表得到列表*/
		*'queryList'({ payload },{ call, put, select }){
			yield put({ type : 'showTableLoading' });
            yield put({ type : 'showButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
            let exportSearchContent = payload.exportSearchContent;
            delete payload.firstEnter;
            delete payload.exportSearchContent;
            let params = { ...payload , ...exportSearchContent };
            let res = yield call(queryList,parse(params));
            if (!!res && res.ret && res.ret.errorCode === 9000) {
                let { ret } = res;
                yield put({
                    type:'updateState',
                    payload:{
                        tableDataSource : ret.results,
                        tablePageIndex : ret.data.pageIndex,
                        tablePageSize : ret.data.pageSize,
                        tableTotal : ret.data.resultCount,
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
                        tablePageSize : 40,
                        tableTotal : 0,
                        exportSearchContent,
                    }
                })
            }
            yield put({ type : 'closeTableLoading' });
            yield put({ type : 'closeButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : false }});                              //报表头部已初始化，需要将状态重置
		}
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
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
