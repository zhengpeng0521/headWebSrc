import {
    getMaxList,          //保存设置选项
    SaveMaxList,
} from '../../../../../services/system/gong-hai-set/have-max-list/haveMaxList';
import { parse } from 'qs';
import { message } from 'antd';

/*校区logo*/
export default {

    namespace: 'haveMaxList',

    state: {
        loading : false,                //是否加载状态
        id : '',                        //id
        dataKey : '',                   //初始最大销售名单量
        Status : false,
        checkedstatus : '1',
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_sea_maxnum') {
                    dispatch({
                        type:'GetHaveMaxList',
                        payload:{
                           confKey:'SELLMAXLISTNUM'
                        }
                    });
                }
            });
        },
    },

    effects: {

         *'GetHaveMaxList'({ payload },{ put , call , select }){
            yield put({ type : 'showLoading' });
            const { ret } = yield call(getMaxList,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                let selectType='';
                if(ret.list[0].key=='-1'){
                    selectType='-1'
                }else{
                    selectType='1'
                }
                yield put({
                    type:'updateState',
                    payload:{
                       dataKey:ret.list[0].key,
                       checkedstatus:selectType
                    }
                });

            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取配置信息出错');
            }
             yield put({ type : 'closeLoading' });
        },

        *'SaveHaveMaxList'({ payload },{ put , call , select }){
            yield put({ type : 'showLoading' });
            const { ret } = yield call(SaveMaxList,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage || '保存成功');
                yield put({
                    type:'GetHaveMaxList',
                    payload:{
                       confKey:'SELLMAXLISTNUM'
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('保存失败');
            }
            yield put({ type : 'closeLoading' });
        },
    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showLoading(state, action) {
            return { ...state, ...action.payload , loading : true};
        },
        closeLoading(state, action) {
            return { ...state, ...action.payload , loading : false};
        },
    },
};
