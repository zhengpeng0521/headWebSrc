import {
    QueryList,
    UpdateCloudData,                    //更新云数据查询的
    ConfirmDeptOrgSelect,                //模态框确定的接口
    OnconfirmDeptOrgSelect
} from '../../../../services/report-form/teaching-report/teacherSalarySheet';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

//老师工资表
export default {

  namespace: 'teacherSalatySheet',

    state: {
        modalBoxAppears: false,//模态框的出现
        updateshow: true, //那个页面有按钮的
        content: "暂未更新",//鼠标放入更新云时间
        name: '老师工资表',//参数
        startDate: undefined, //传给后端的开始参数
        endDate: undefined,//传给后端的结束参数
        firstEnter : false,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        /*列表*/
        tableLoading : false,           //列表加载状态
        tableDataSource : [],           //列表数据
        tableTotal : 0,                 //列表条数
        tablePageIndex : 0,             //列表页码
        tablePageSize : 20,             //列表每页条数
        exportSearchContent : {},       //报表导出条件(没有分页信息)

        buttonLoading : false,          //生成报表按钮加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/hq_orgstats_teachersalary') {
                    //初次进入页面查询当天数据
                    dispatch({
                        type : 'InitialQuery',
                        payload : {
                            firstEnter : true,                  //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
                            pageIndex : 0,
                            pageSize : 20,
                            exportSearchContent : window.GetNowDateAndTime()
                        }
                    });
                    dispatch({
                        type : 'UpdateCloudData',
                        payload : {
                           name:'老师工资表'
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
                        tablePageSize : ret.data && ret.data.pageSize || 20,
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
                        tablePageSize : 20,
                        tableTotal : 0,
                    }
                })
            }
            yield put({ type : 'closeTableLoading' });
            yield put({ type : 'closeButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : false }});                              //报表头部已初始化，需要将状态重置
        },
        *UpdateCloudData({ payload }, { call, put, select }) {
            // yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
            let state = yield select(state => state.teacherSalatySheet);
            let params = {
                name: state.name
            }
            let { ret } = yield call(UpdateCloudData, params);
            if (ret && ret.errorCode === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        content: '上次更新时间 :'+ret.lastTime, //把请求到的数据赋值给全局变量content，然后传给page
                    }
                })
            }
            if (ret.lastTime == null) {
                yield put({
                    type: 'updateState',
                    payload: {
                        content: "暂未更新" //把请求到的数据赋值给全局变量content，然后传给page
                    }
                })
            }
        },
        //弹框确定更新云数据
        *ConfirmDeptOrgSelect({ payload }, { call, put, select }) {
            // yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
            let state = yield select(state => state.teacherSalatySheet);
            let {startDate, endDate} = payload.params
            let params = {
                name: state.name,
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            }
            let { ret } = yield call(ConfirmDeptOrgSelect, params);
            if (ret && ret.errorCode === 0) {
                payload.colback()
            }
        },
        *onconfirmDeptOrgSelect({ payload }, { call, put, select }) {
			// yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
            let state = yield select(state => state.teacherSalatySheet);
			let params = {
				name: state.name,
			}
            let { ret } = yield call(OnconfirmDeptOrgSelect, params);
			if (ret.errorCode == 0) {
				payload.coleback()
			}
			if (ret.errorCode == 1000) {
				payload.shutback()
                message.warning('每天只能更新一次，请明天再试~');
			}
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
        updateDate(state, action) {
            return { ...state, ...action.payload };
        },
    },
}
