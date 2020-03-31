import {
    GetTableList,                            /*获取全部列表数据*/
    GetImportant,                            /*获取重要程度*/
} from '../../../../services/crm/leads-follow-all/LeadsFollow';
import { parse } from 'qs';
import { message } from 'antd';

/*English*/
export default {

    namespace: 'leadsFollowAll',

    state: {
        /*快捷搜索*/
        fastSearchContent : {},                         //快捷搜索栏搜索内容

        /*高级搜索*/
        superSearchVisible : false,                     //高级搜索是否显示
        superSearchContent : {},                        //高级搜索栏搜索内容

        /*table*/
        tableNewColumns : [],                           //选择列表是否显示字段是哪些
        tableLoading : false,                           //列表是否加载状态
        tableDataSource : [],                           //table列表数据

        /*pagination*/
        tableDataTotal : 0,                             //数据总共数目
        tablePageIndex : 0,                             //页码
        tablePageSize : 20,                             //每页条数

        importanceList : [] ,                           //重要程度列表
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/hq_orgdata_leads'){
                    //获取全部列表数据
                    dispatch({
                        type : 'GetTableList',
                        payload : {
                            pageIndex : 0,
                            pageSize : 20,
                        }
                    });

                }
            });
        },
    },

    effects: {
        /*获取全部列表数据*/
        *'GetTableList'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            let fastSearchContent = payload && payload.fastSearchContent ? payload.fastSearchContent : {};
            let superSearchContent = payload && payload.superSearchContent ? payload.superSearchContent : {};
            delete payload.fastSearchContent;
            delete payload.superSearchContent;
            let params = { ...payload , ...fastSearchContent , ...superSearchContent };
            let resInit = yield call(GetTableList,parse(params));
            if(!!resInit && resInit.ret && resInit.ret.errorCode === 9000 ){
                let { ret } = resInit;
                if((ret.results).length == 0 && params.pageIndex > 0){
                    params.pageIndex -= 1;
                    let resAgain = yield call(GetTableList,parse(params));
                    if(!!resAgain && resAgain.ret && resAgain.ret.errorCode === 9000){
                        let { ret } = resAgain;
                        yield put({
                            type  :'updateState',
                            payload : {
                                tableDataSource : ret.results || [],                    //table列表数据
                                tableDataTotal : ret.data && ret.data.resultCount || 0, //数据总共数目
                                tablePageIndex : ret.data && ret.data.pageIndex || 0,   //页码
                                tablePageSize : ret.data && ret.data.pageSize || 20,    //每页条数
                                fastSearchContent,                          //更新常用搜索内容项
                                superSearchContent,                         //更新高级搜索内同
                            }
                        });
                    }else{
                        message.error(!!resAgain && resAgain.ret && resAgain.ret.errorMessage ? resAgain.ret.errorMessage : '获取名单数据失败');
                    }
                }else{
                    yield put({
                        type  :'updateState',
                        payload : {
                            tableDataSource : ret.results || [],                        //table列表数据
                            tableDataTotal : ret.data && ret.data.resultCount || 0,     //数据总共数目
                            tablePageIndex : ret.data && ret.data.pageIndex || 0,       //页码
                            tablePageSize : ret.data && ret.data.pageSize || 20,        //每页条数
                            fastSearchContent,                          //更新常用搜索内容项
                            superSearchContent,                         //更新高级搜索内同
                        }
                    });
                }
            }else{
                message.error(!!resInit && resInit.ret && resInit.ret.errorMessage ? resInit.ret.errorMessage : '获取名单数据失败');
            }
            yield put({ type : 'closeTableLoading' });
        },
        //获取重要程度下拉列表内容
//        *'GetImportance'({ payload },{ call, put, select }){
//            let { ret } = yield call(GetImportant,parse(payload));
//            if(ret && ret.errorCode === 9000){
//                yield put({
//                    type:'updateState',
//                    payload:{
//                        importanceList : ret.list
//                    }
//                });
//            }else if( ret && ret.errorMessage ){
//                ret && ret.errorMessage && message.error(ret.errorMessage);
//            }else{
//                message.error('获取重要程度下拉列表失败');
//            }
//        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        //列表加载状态
        showTableLoading(state, action) {
            return { ...state, tableLoading : true };
        },
        //列表加载状态
        closeTableLoading(state, action) {
            return { ...state, tableLoading : false };
        },
    },
};
