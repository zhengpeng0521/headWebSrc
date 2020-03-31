import {
    GetTenantPic            /*获取机构图片*/
} from '../../../services/index/common/GetOrgInfoService';
import { parse } from 'qs';
import { message } from 'antd';
//顶部导航-机构信息
export default {
    namespace: 'headerOrgInfoModel',

    state: {
        imgUrl: ''
    },

    effects: {
        /*获取机构图片*/
        *'GetTenantPic'({ payload }, { call, put, select }){
            let res = yield call(GetTenantPic);
            if(!!res && res.ret && res.ret.errorCode === 9000){
                let { ret } = res;
                window._init_data.orgId = ret.orgId;
                window._init_data.language = ret.language;
                window._init_data.tenantId = ret.tenantId;
                let imgUrl = ret && ret.imgurl ? ret.imgurl : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223';
                yield put({
                    type:'updateState',
                    payload:{
                        imgUrl
                    }
                })
                yield put({
                    type:'indexMainLayoutModel/updateState',
                    payload:{
                        orgInfo : ret
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取总部信息失败')
            }
        }
    },
    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
    },
}
