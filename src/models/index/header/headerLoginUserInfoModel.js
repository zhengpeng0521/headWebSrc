import { message } from 'antd';
import { parse } from 'qs';
import {
    queryUserImg,
    ChangePassWord          /*修改密码表单提交*/
} from '../../../services/index/common/mainLayoutService';
//顶部导航-右侧功能按钮
export default {

    namespace: 'headerLoginUserInfoModel',

    state: {
        userImg: 'https://img.ishanshan.com/gimg/img/7b9f12699580bafa04d3dc44333b85b0',
        userName: '',

        /*修改密码modal*/
        passWordChangeModalVisible : false,             //修改密码modal是否显示
        passWordChangeModalButtonLoading : false,       //修改密码modal按钮加载状态
    },


    effects: {
        /*加载所有菜单*/
        *'queryUserImg'({ payload }, { call, put, select }) {
            let { ret } = yield call(queryUserImg);
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type: 'updateState',
                    payload : {
                        userImg : ret.headImgUrl || 'https://img.ishanshan.com/gimg/img/7b9f12699580bafa04d3dc44333b85b0',
                        userName : ret.userName || '请设置用户名称',
                    }
                });
                window.uid = ret.userId
                yield put({
                    type: 'indexMainLayoutModel/updateState',
                    payload : {
                        userMsg : ret
                    }
                });
            }else{
                message.error((ret && ret.errorMessage) || '查询用户头像出错啦!');
            }
        },

        /*修改密码表单提交*/
        *'ChangePassWord'({ payload }, { call, put, select }){
            yield put({ type : 'OpenButtonLoading' });
            let { ret } = yield call(ChangePassWord,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success(ret.errorMessage);
                yield put({
                    type:'updateState',
                    payload:{
                        passWordChangeModalVisible : false
                    }
                });
            }else if(ret && ret.errorMessage){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({ type : 'CloseButtonLoading' });
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
        /*修改密码表单开启按钮加载状态*/
        OpenButtonLoading(state, action) {
            return { ...state, ...action.payload, passWordChangeModalButtonLoading : true};
        },
        /*修改密码表单关闭按钮加载状态*/
        CloseButtonLoading(state, action) {
            return { ...state, ...action.payload, passWordChangeModalButtonLoading : false};
        },
    },

}
