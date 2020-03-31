import {
    QueryList
} from '../../../../services/report-form/sales-report/leadsSourceSheet';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

//名单来源表
export default {

  namespace: 'leadsSourceSheet',

    state: {
        firstEnter : true,          //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        sheetLoading : false,       //报表加载状态
        sheetData : [],             //报表数据
        firstChannel : [],          //一级来源数据
        secondChannel : [],         //二级来源数据
        exportSearchContent : {},   //查询条件

        buttonLoading : false,      //生成报表按钮加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/report_crm_leadssource') {
                    //初次进入页面查询当天数据
                    dispatch({
                        type : 'QueryList',
                        payload : {
                            firstEnter : true,
                            exportSearchContent : window.GetNowDateAndTime()
                        }
                    })
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
            yield put({ type : 'showSheetLoading' });
            yield put({ type : 'showButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
            let exportSearchContent = payload.exportSearchContent;
            delete payload.firstEnter;
            delete payload.exportSearchContent;
            let params = { ...payload , ...exportSearchContent };
            let res = yield call(QueryList,parse(params));
            if (!!res && res.ret && res.ret.errorCode === 9000) {
                let { ret } = res;
                //格式化饼状图数据
                function formatSheet(array){
                    let data = [];
                    for(let i in array){
                        data.push({
                            name : array[i].sourceName,
                            value : parseInt(array[i].sourceNum)
                        });
                    }
                    return data;
                }
                //格式化图表数据
                let firstChannel = [];
                let secondChannel = [];
                for(let i in ret.list){
                    if(ret.list[i].channel == 'firstChannel'){
                        firstChannel = formatSheet(ret.list[i].items);
                    }else if(ret.list[i].channel == 'secondChannel'){
                        secondChannel = formatSheet(ret.list[i].items);
                    }
                }
                yield put({
                    type:'updateState',
                    payload:{
                        sheetData : ret.list,
                        firstChannel,
                        secondChannel,
                        exportSearchContent
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '查询失败');
                yield put({
                    type:'updateState',
                    payload:{
                        sheetData : [],
                        firstChannel : [],
                        secondChannel : [],
                        exportSearchContent,
                    }
                })
            }
            yield put({ type : 'closeSheetLoading' });
            yield put({ type : 'closeButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : false }});                              //报表头部已初始化，需要将状态重置
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        showSheetLoading(state, action){
            return { ...state, sheetLoading : true };
        },
        closeSheetLoading(state, action){
            return { ...state, sheetLoading : false };
        },
        showButtonLoading(state, action){
            return { ...state, buttonLoading : true };
        },
        closeButtonLoading(state, action){
            return { ...state, buttonLoading : false };
        },
    },
}
