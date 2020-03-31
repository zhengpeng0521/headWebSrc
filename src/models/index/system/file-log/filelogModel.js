import {message} from 'antd';
import { parse } from 'qs';
import { filelogTabe } from '../../../../services/system/file-log/FileLog'
export default {
    namespace : 'filelogModel',


state : {
    // 表格数据
    newColumns      : [],
    pageIndex       : 0,
    pageSize        : 20,
    total           : 0,
    loading         : false,
    dataSource      : [],
    opDateOrder     :undefined,    //时间排序
    superSearchVisible: false, // 高级搜索显示
    searchValues: {}, // 搜索内容
    superSearchValues: {}, //高级搜索内容 
},

subscriptions : {
    setup({ dispatch, history }){
        history.listen( ({ pathname, query }) => {
                console.log(history,'123')
        })
    }
},

effects : {
    /*获取全部列表数据..*/
    *'GetTableList'({ payload },{ put , call , select }){
        console.log('in')
        yield put({ type : 'updateState', payload : { loading : true } });
            let filelogModel = yield select(state => state.filelogModel);
            // payload = payload || {};
            let {opDateOrder ,searchValues , superSearchValues} = payload;
            let pageIndex = payload.pageIndex != undefined ? payload.pageIndex : filelogModel.pageIndex;
            let pageSize = payload.pageSize != undefined ? payload.pageSize    : filelogModel.pageSize;
            let query = payload.query || filelogModel.query;
            let queryParams = {
                pageIndex,pageSize,...searchValues,...superSearchValues,opDateOrder : 1
            };
            let { ret } = yield call( filelogTabe, parse(queryParams));
        if( ret && ret.errorCode === 0 ){
            console.log(ret , 'yes');
            yield put({
                        type  :'updateState',
                        payload : {
                            dataSource : ret.results,
                            total : ret.data.resultCount,
                            pageIndex : ret.data.pageIndex,
                            pageSize : ret.data.pageSize,
                            superSearchValues: payload.superSearchValues,
                            searchValues: payload.searchValues,
                            // opDateOrder,
                             opDateOrder : 1
                        }  
                    })
        }else{
            yield put({
                type : 'updateState',
                payload : {
                    dataSource : [],
                    total      : 0,
                }
            });
            message.error(ret && ret.errorMessage ? ret.errorMessage : '获取日志数据失败');
        }
        yield put({ type : 'updateState', payload : { loading : false } });
    },
},

reducers : {
    updateState( state, action ){
        return { ...state, ...action.payload };
    },
    // //列表加载状态
    // showTableLoading(state, action) {
    //     return { ...state, tableLoading : true };
    // },
    // //列表加载状态
    // closeTableLoading(state, action) {
    //     return { ...state, tableLoading : false };
    // },
}
}