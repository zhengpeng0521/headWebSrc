import {
    timeOutDetail,  //设置查询
    timeOutRecyle,//保存设置选项
} from '../../../../../services/system/gong-hai-set/lead-record-no-rule/leadRecordNoRule';
import { parse } from 'qs';
import { message } from 'antd';

/*校区logo*/
export default {

    namespace: 'leadRecordNoRule',

    state: {
        loading : false,                //是否加载状态
        id : '',                        //id
        dataKey : '',                   //初始最大销售名单量
        checkedstatus : undefined,            //1启用 2禁用
        ruleId : undefined,

        tmkStatus: undefined,
        tmkTimeOut: '',
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_sea_follow') {
                    dispatch({
                        type:'timeOutDetail',
                        payload:{

                        }
                    });
                }
            });
        },
    },

    effects: {
         *'timeOutDetail'({ payload },{ put , call , select }){
            yield put({ type : 'showLoading' });
            const { ret } = yield call(timeOutDetail,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
                       dataKey : ret.status=='2' ? '' : ret.timeOut ,
                       checkedstatus : ret.status ,
                       ruleId : ret.id,
                    }
                });

            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取配置信息出错');
            }
            yield put({ type : 'closeLoading' });
        },

        *'timeOutRecyle'({ payload },{ put , call , select }){
            const { ret } = yield call(timeOutRecyle,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage || '保存成功');
                yield put({
                    type:'timeOutDetail',
                    payload:{

                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取配置信息出错');
            }
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
