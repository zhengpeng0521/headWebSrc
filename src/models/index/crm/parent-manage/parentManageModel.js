import {
    GetTableList
} from '../../../../services/crm/parent-manage/parentManageService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'parentManageModel',

    state : {
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
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/hq_orgdata_stuparent' ){
                    //获取全部列表数据
                    dispatch({
                        type : 'GetTableList',
                        payload : {
                            pageIndex : 0,
                            pageSize : 20,
                        }
                    });
                }
            })
        }
    },

    effects : {
        /*获取全部列表数据*/
        *'GetTableList'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            let fastSearchContent = payload && payload.fastSearchContent ? payload.fastSearchContent : {};
            let superSearchContent = payload && payload.superSearchContent ? payload.superSearchContent : {};
            delete payload.fastSearchContent;
            delete payload.superSearchContent;
            let params = { ...payload , ...fastSearchContent , ...superSearchContent };
            let { ret } = yield call(GetTableList,parse(params));
            if( ret && ret.errorCode === 9000 ){
                if((ret.results).length == 0 && params.pageIndex > 0){
                    params.pageIndex -= 1;
                    let { ret } = yield call(GetTableList,parse(params));
                    if(ret && ret.errorCode === 9000){
                        yield put({
                            type  :'updateState',
                            payload : {
                                tableDataSource : ret.results,              //table列表数据
                                tableDataTotal : ret.data.resultCount,      //数据总共数目
                                tablePageIndex : ret.data.pageIndex,        //页码
                                tablePageSize : ret.data.pageSize,          //每页条数
                                fastSearchContent,                          //更新常用搜索内容项
                                superSearchContent,                         //更新高级搜索内同
                            }
                        });
                    }else{
                        message.error(ret && ret.errorMessage ? ret.errorMessage : '获取家长数据失败');
                    }
                }else{
                    yield put({
                        type  :'updateState',
                        payload : {
                            tableDataSource : ret.results,              //table列表数据
                            tableDataTotal : ret.data.resultCount,      //数据总共数目
                            tablePageIndex : ret.data.pageIndex,        //页码
                            tablePageSize : ret.data.pageSize,          //每页条数
                            fastSearchContent,                          //更新常用搜索内容项
                            superSearchContent,                         //更新高级搜索内同
                        }
                    });
                }
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取家长数据失败');
            }
            yield put({ type : 'closeTableLoading' });
        },
    },

    reducers : {
        updateState( state, action ){
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
    }
}
