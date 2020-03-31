import {
    GetHolidayList,         /*获取请假列表数据*/
    HolidayReqDeal,         /*请假处理表单提交*/
    DeleteReq,              /*批量删除请假申请*/
} from '../../../../services/crm/get-holiday/GetHoliday';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

//学员请假
export default {

  namespace: 'getHoliday',

    state: {
        /*searchBar*/
        getHolidaySearchVisible : false,            //搜索栏是否显示
        getHolidaySearchContent : {},               //搜索栏搜素内容

        /*table*/
        getHolidayPageIndex : 0,                    //页码
        getHolidayPageSize : 10,                    //每页条数
        getHolidayTableLoading : false,             //表格加载状态
        getHolidayTableContent : [],                //表格数据
        getHolidayTableTotal : undefined,           //表格数据总数
        getHolidayTableSelectedRowKeys : [],        //表格多选选中的数组
        getHolidayTableSelectedRow : [],            //表格多选中的对象数组

        /*请假处理modal*/
        getHolidayDealModalVisible : false,         //modal是否显示
        getHolidayDealModalButtonLoading : false,   //modal按钮是否加载状态
        getHolidayDealModalContent : {},            //modal回填数据(主要用到校区ID和校区name)
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/scrm_woffice_vocation') {
                    /*获取请假列表数据*/
                    dispatch({
                        type:'GetHolidayList',
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
        /*获取请假列表数据*/
        *'GetHolidayList'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            const { ret } = yield call(GetHolidayList,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                let pageIndex = payload.pageIndex;
                let pageSize = payload.pageSize;
                delete payload.pageIndex;
                delete payload.pageSize;
                yield put({
                    type : 'updateState',
                    payload:{
                        getHolidaySearchContent : payload,
                        getHolidayPageIndex : pageIndex,
                        getHolidayPageSize : pageSize,
                        getHolidayTableContent : ret.results,
                        getHolidayTableTotal : (ret.data).resultCount,
                        getHolidayTableSelectedRowKeys : [],        //表格多选选中的数组
                        getHolidayTableSelectedRow : [],            //表格多选中的对象数组
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTableLoading' });
        },

        /*确认，删除之后进行列表查询操作*/
        *'AfterOperationShowHolidayList'({ payload },{ call, put, select }){
            let getHoliday = yield select(state => state.getHoliday);
            let getHolidaySearchContent = getHoliday.getHolidaySearchContent || {};
            let pageIndex = getHoliday.getHolidayPageIndex;
            let pageSize = getHoliday.getHolidayPageSize;
            let params = { pageIndex,pageSize,...getHolidaySearchContent };
            let { ret } = yield call(GetHolidayList,parse(params));
            if(ret && ret.errorCode === 9000){
                if((ret.results).length == 0 && pageIndex > 0){
                    params.pageIndex = pageIndex-1;     //发送前一页数据请求的页码
                    let { ret } = yield call(GetHolidayList,parse(params));
                    if(ret && ret.errorCode === 9000){
                        yield put({
                            type:'updateState',
                            payload:{
                                getHolidayTableContent : ret.results,
                                getHolidayTableTotal : (ret.data).resultCount,
                                getHolidayTableSelectedRowKeys : [],        //表格多选选中的数组
                                getHolidayTableSelectedRow : [],            //表格多选中的对象数组
                                getHolidayPageIndex : params.pageIndex,
                                getHolidayDealModalVisible : false,
                            }
                        })
                    }else if(ret && ret.errorMessage){
                        message.error(ret.errorMessage);
                    }else{
                        message.error('您的网络状况不佳，请检查网络情况');
                    }
                }else{
                    yield put({
                        type:'updateState',
                        payload:{
                            getHolidayTableContent : ret.results,
                            getHolidayTableTotal : (ret.data).resultCount,
                            getHolidayTableSelectedRowKeys : [],        //表格多选选中的数组
                            getHolidayTableSelectedRow : [],
                            getHolidayPageIndex : params.pageIndex,
                            getHolidayDealModalVisible : false,
                        }
                    })
                }
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*请假处理表单提交*/
        *'HolidayReqDeal'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            yield put({ type : 'showModalButtonLoading' });
            const { ret } = yield call(HolidayReqDeal,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationShowHolidayList',
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTableLoading' });
            yield put({ type : 'closeModalButtonLoading' });
        },

        /*批量删除请假申请*/
        *'DeleteReq'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            const { ret } = yield call(DeleteReq,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationShowHolidayList',
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTableLoading' });
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
        showTableLoading(state, action) {
            return { ...state, ...action.payload, getHolidayTableLoading : true};
        },
        closeTableLoading(state, action) {
            return { ...state, ...action.payload, getHolidayTableLoading : false};
        },
        showModalButtonLoading(state, action) {
            return { ...state, ...action.payload, getHolidayDealModalButtonLoading : true};
        },
        closeModalButtonLoading(state, action) {
            return { ...state, ...action.payload, getHolidayDealModalButtonLoading : false};
        },
    },

}
