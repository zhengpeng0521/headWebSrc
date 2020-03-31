import {
    GetTableList,               //获取退款单列表

    GetRefundFormCheckDetail,   //点击审核获取当前项的详情
    RefundFormCheckModalPass,   //审核退款通过
    RefundFormCheckModalReject, //审核退款驳回
    GetRefundFormPrintDetail    //点击打印获取打印详情
} from '../../../../services/crm/new-refund-form/NewRefundForm';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

//学员请假
export default {

    namespace: 'newRefundForm',

    state: {
        wetherChangeRouter : false,                     //是否切换路由，用于清空快捷搜索与高级搜索栏内容

        /*常用searchBar*/
        refundFastSearchContent : {},                   //快捷搜索栏搜索内容

        /*高级搜索*/
        refundRightSuperSearchVisible : false,          //高级搜索是否显示
        refundRightSuperSearchContent : {},             //高级搜索栏搜索内容

        /*table*/
        refundTableNewColumns : [],                     //选择列表是否显示字段是哪些
        refundTableLoading : false,                     //列表是否加载状态
        refundTablePageSize : 20,                       //列表数据每页条数
        refundTablePageIndex : 0,                       //列表数据第几页
        refundTableDataTotal : 0,                       //列表数据总共条数
        refundTableDataSource : [],                     //列表数据
        refundTableSelectedRowKeys : [],                //多选框选中项的id,若无id，则取到当前索引
        refundTableSelectedRows : [],                   //多选框选中的项的对象数组

        /*驳回退款单modal*/
        refundFormCheckModalVisible : false,                //审核退款单modal是否显示
        refundFormCheckModalPassButtonLoading : false,      //审核退款单modal通过按钮加载状态
        refundFormCheckModalRejectButtonLoading : false,    //审核退款单modal驳回按钮加载状态
        refundFormCheckModalCheckDetail : {},               //审核退款单详情

        /*打印退款单modal*/
        refundFormPrintModalVisible : false,            //打印退款单modal是否显示
        refundFormPrintModalPrintType : '',             //打印退款单类型
        refundFormPrintData : {},                       //打印退款单选择退款类型以后接口返回的数据
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/hq_orgdata_checklist') {
                    dispatch({
                        type:'GetTableList',
                        payload:{
                            pageIndex : 0,
                            pageSize : 20,
                            changeRouter : true     //表示切换路由
                        }
                    });
                }
            });
        },
    },

    effects: {
        //获取退款单列表
        *'GetTableList'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            if(payload && payload.changeRouter && payload.changeRouter == true){
                yield put({
                    type:'updateState',
                    payload:{
                        wetherChangeRouter : true
                    }
                })
                delete payload.changeRouter;
            }
            let fastSearchContent = payload.fastSearchContent || {};
            let superSearchContent = payload.superSearchContent || {};
            delete payload.fastSearchContent;
            delete payload.superSearchContent;
            let params = { ...payload , ...fastSearchContent , ...superSearchContent };
            let { ret } = yield call(GetTableList,parse(params));
            if( ret && ret.errorCode === 9000 ){
                let newRefundForm = yield select( state => state.newRefundForm );
                yield put({
                    type:'updateState',
                    payload:{
                        wetherChangeRouter : false
                    }
                })
                if((ret.results).length == 0 && params.pageIndex > 0){
                    params.pageIndex -= 1;
                    let { ret } = yield call(GetTableList,parse(params));
                    if( ret && ret.errorCode === 9000 ){
                        yield put({
                            type:'updateState',
                            payload:{
                                refundTableDataSource : ret.results,
                                refundTableDataTotal : ret.data.resultCount,
                                refundTablePageIndex : ret.data.pageIndex,
                                refundTablePageSize : ret.data.pageSize,
                                refundTableSelectedRowKeys : [],
                                refundTableSelectedRows : [],
                            }
                        });
                    }else if(ret && ret.errorMessage){
                        message.error(ret.errorMessage);
                    }else{
                        message.error('获取退款单列表失败');
                    }
                }else{
                    yield put({
                        type:'updateState',
                        payload:{
                            refundTableDataSource : ret.results,
                            refundTableDataTotal : ret.data.resultCount,
                            refundTablePageIndex : ret.data.pageIndex,
                            refundTablePageSize : ret.data.pageSize,
                            refundTableSelectedRowKeys : [],
                            refundTableSelectedRows : [],
                        }
                    });
                }
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取退款单列表失败');
            }
            yield put({ type : 'closeTableLoading' });
        },


        //点击审核获取当前项的详情
        *'GetRefundFormCheckDetail'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            let { ret } = yield call(GetRefundFormCheckDetail,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
                        refundFormCheckModalVisible : true,
                        refundFormCheckModalCheckDetail : ret.data
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取审核项详情失败');
            }
            yield put({ type : 'closeTableLoading' });
        },

        //审核退款单通过
        *'RefundFormCheckModalPass'({ payload },{ put , call , select }){
            yield put({ type : 'showCheckModalPassButtonLoading' });
            yield put({ type : 'showCheckModalRejectButtonLoading' });
            yield put({ type : 'showTableLoading' });
            let { ret } = yield call(RefundFormCheckModalPass,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success('审核通过');
                let newRefundForm = yield select( state => state.newRefundForm );
                let refundTablePageSize = newRefundForm.refundTablePageSize;
                let refundTablePageIndex = newRefundForm.refundTablePageIndex;
                let refundFastSearchContent = newRefundForm.refundFastSearchContent;
                let refundRightSuperSearchContent = newRefundForm.refundRightSuperSearchContent;
                yield put({
                    type:'updateState',
                    payload:{
                        refundFormCheckModalVisible : false
                    }
                })
                //只需要刷新审核退款列表
                yield put({
                    type:'GetTableList',
                    payload:{
                        pageIndex : refundTablePageIndex,
                        pageSize : refundTablePageSize,
                        fastSearchContent : refundFastSearchContent,
                        superSearchContent : refundRightSuperSearchContent,
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('退款单通过失败');
            }
            yield put({ type : 'closeCheckModalRejectButtonLoading' });
            yield put({ type : 'closeCheckModalPassButtonLoading' });
            yield put({ type : 'closeTableLoading' });
        },

        //审核退款驳回
        *'RefundFormCheckModalReject'({ payload },{ put , call , select }){
            yield put({ type : 'showCheckModalPassButtonLoading' });
            yield put({ type : 'showCheckModalRejectButtonLoading' });
            yield put({ type : 'showTableLoading' });
            let { ret } = yield call(RefundFormCheckModalReject,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success('已驳回');
                let newRefundForm = yield select( state => state.newRefundForm );
                let refundTablePageSize = newRefundForm.refundTablePageSize;
                let refundTablePageIndex = newRefundForm.refundTablePageIndex;
                let refundFastSearchContent = newRefundForm.refundFastSearchContent;
                let refundRightSuperSearchContent = newRefundForm.refundRightSuperSearchContent;
                yield put({
                    type:'updateState',
                    payload:{
                        refundFormCheckModalVisible : false
                    }
                })
                //只需要刷新审核退款列表
                yield put({
                    type:'GetTableList',
                    payload:{
                        pageIndex : refundTablePageIndex,
                        pageSize : refundTablePageSize,
                        fastSearchContent : refundFastSearchContent,
                        superSearchContent : refundRightSuperSearchContent,
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('退款单驳回失败');
            }
            yield put({ type : 'closeCheckModalPassButtonLoading' });
            yield put({ type : 'closeCheckModalRejectButtonLoading' });
            yield put({ type : 'closeTableLoading' });
        },

        //点击打印获取打印详情
        *'GetRefundFormPrintDetail'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            let { ret } = yield call(GetRefundFormPrintDetail,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
                        refundFormPrintModalVisible : true,
                        refundFormPrintModalPrintType : ret.data.refundType,
                        refundFormPrintData : ret.data,
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('退款单驳回失败');
            }
            yield put({ type : 'closeTableLoading' });
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
        //开启列表加载
        showTableLoading(state, action) {
            return { ...state, ...action.payload, refundTableLoading : true};
        },
        //关闭列表加载
        closeTableLoading(state, action) {
            return { ...state, ...action.payload, refundTableLoading : false};
        },
        //开启新增退款单modal加载
        showCreateModalLoading(state, action){
            return { ...state, ...action.payload, refundFormCreateModalLoading : true};
        },
        //关闭新增退款单modal加载
        closeCreateModalLoading(state, action){
            return { ...state, ...action.payload, refundFormCreateModalLoading : false};
        },
        //开启新增退款单modal按钮加载
        showCreateModalButtonLoading(state, action){
            return { ...state, ...action.payload, refundFormCreateModalButtonLoading : true};
        },
        //关闭新增退款单modal按钮加载
        closeCreateModalButtonLoading(state, action){
            return { ...state, ...action.payload, refundFormCreateModalButtonLoading : false};
        },
        //关闭新增退款单modal按钮加载
        showCheckModalPassButtonLoading(state, action){
            return { ...state, ...action.payload, refundFormCheckModalPassButtonLoading : true};
        },
        //关闭新增退款单modal按钮加载
        closeCheckModalPassButtonLoading(state, action){
            return { ...state, ...action.payload, refundFormCheckModalPassButtonLoading : false};
        },
        //关闭新增退款单modal按钮加载
        showCheckModalRejectButtonLoading(state, action){
            return { ...state, ...action.payload, refundFormCheckModalRejectButtonLoading : true};
        },
        //关闭新增退款单modal按钮加载
        closeCheckModalRejectButtonLoading(state, action){
            return { ...state, ...action.payload, refundFormCheckModalRejectButtonLoading : false};
        },
    },

}
