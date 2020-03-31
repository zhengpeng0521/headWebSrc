import {
    SearchSalesCommission,      /*销售提成列表*/
    OpenSalesDetail             /*销售提成列表详情*/
} from '../../../../services/erp/statistical-report/SalesCommission';
import { parse } from 'qs';
import qs from 'qs';
import { message } from 'antd';

//统计报表 销售提成
export default {

    namespace: 'salesCommission',

    state: {
        pageIndex : 0,
        pageSize : 10,

        searchData : {},                //查询的数据(时间范围)
        orgCount : '',                  //查询包含机构的数量

        tableOnLoading : false,         //table是否加载状态
        tableContentTotal : 0,          //table内容数量
        tableContent : [],              //table内容

        salesDetailVisible : false,     //销售详情表单是否显示
        salesDetailContent : {},        //销售详情数据
        salesDetailSpining : false,     //销售详情数据是否加载完成
        salesDetailName : '',           //销售详情姓名
        salesDetailNameHeight : '50px', //销售详情名字高度(css用)
        salesDetailTotal : '',          //销售详情总计
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/report_crm_saller') {
                    dispatch({
                        type:'updateState',
                        payload:{
                            searchData : {},
                        }
                    });
                    dispatch({
                        type:'SearchSalesCommission',
                        payload:{
                            pageIndex : 0,
                            pageSize : 10,
                        }
                    });
                }
            });
        },
    },

    effects: {
        /*销售提成列表*/
        *'SearchSalesCommission'({ payload } , { call , put , select }){
            yield put({ type : 'showTableLoading' });
            const { ret , err } = yield call(SearchSalesCommission,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
                        orgCount : ret.orgNum+'',
                        tableContent : ret.results,
                        tableContentTotal : ret.data.resultCount,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTableLoading' });
        },

        /*销售提成列表详情*/
        *'OpenSalesDetail'({ payload } , { call , put , select }){
            const { ret , err } = yield call(OpenSalesDetail,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                /*详情名称height和lineHeight*/
                let height;
                if(ret.results && (ret.results).length > 0){
                    height =  ((ret.results).length+2)*50;
                }else{
                    message.warning('该人无对应销售明细')
                    height = 50;
                    yield put({
                        type:'updateState',
                        payload:{
                            salesDetailVisible : false
                        }
                    });
                    return;
                }
                /*占比金额的总计*/
                let total = 0;
                for(let i in ret.results){
                    total += parseFloat((((ret.results)[i]).perMoney));
                }
                yield put({
                    type:'updateState',
                    payload:{
                        salesDetailNameHeight : height+'px',
                        salesDetailTotal : total,
                        salesDetailName : (ret.results)[0].sellerName,
                        salesDetailContent : ret.results,
                        salesDetailSpining : false,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
        },

        /*导出数据*/
        *'ExportSalesCommission'({ payload }, { call, put, select }){
            window.open(`${BASE_URL}/statisticsController/exportExcelDetail?${qs.stringify(payload)}`);
        },
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        //表格加载中
        showTableLoading(state,action) {
            return { ...state, ...action.payload, tableOnLoading : true};
        },
        //表格加载消失
        closeTableLoading(state,action){
            return { ...state, ...action.payload, tableOnLoading : false};
        },
    },
};
