import { showConsultationList,queryConsultationList } from '../../../../../services/erp/consultation-book/ConsultationList';
import { parse } from 'qs';
import { message } from 'antd';
import qs from 'qs';

//主题管理
export default {

    namespace: 'consultationList',

    state: {
        consultationListLoading:false,          //咨询列表加载状态
        consultationListList:[],                //咨询列表内容
        consultationListSelectedRowKeys:[],     //咨询列表多选时的key值
        consultationListSelectedRows:[],        //咨询列表多选内容
        consultationListTotal:'',               //咨询列表总共项目数
        consultationPageIndex:0,                //咨询列表页码
        consultationPageSize:10,                //咨询列表一页X条
        consultationListFormLoading:false,      //新增编辑表单按钮加载状态
        consultationListFormData:{},            //编辑时回填数据
        consultationListFormVisible:false,      //新增编辑modal显示
        consultationListFormType:'create',      //modal类型 ' create '/' update '
        consultationListSearchData:{},          //搜索数据
        consultationListSearchVisible:false,    //搜索框显示
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/consultation_list') {
                    dispatch({
                        type: 'showConsultationList'
                    });
                }
            });
        },
    },

    effects: {
        *'showConsultationList'({ payload }, { call, put, select }){
            yield put({ type: 'showLoading' });
            let pageSize = 10;
            let pageIndex = 0;
            let params = { pageSize,pageIndex }
            let { ret } = yield call(showConsultationList,parse(params));
            if (ret && ret.errorCode === 9000) {
                yield put({
                    type: 'updateState',
                    payload: {
                        consultationListList:ret.results,
                        consultationListTotal:ret.data.resultCount,
                    },
                });
            } else {
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }
            yield put({ type: 'closeLoading' });
        },

        *'queryConsultationList'({ payload }, { call, put, select }){
            yield put({ type: 'showLoading' });
            let { ret } = yield call(queryConsultationList,parse(payload));
            if (ret && ret.errorCode === 9000) {
                yield put({
                    type: 'updateState',
                    payload: {
                        consultationListList:ret.results,
                        consultationListTotal:ret.data.resultCount,
                    },
                });
            } else {
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }
            yield put({ type: 'closeLoading' });
        }
    },

    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        //表格加载中
        showLoading(state,action) {
            return { ...state, ...action.payload, consultationListLoading: true };
        },
        //表格加载消失
        closeLoading(state,action){
            return { ...state, ...action.payload, consultationListLoading: false };
        },
    },

};
