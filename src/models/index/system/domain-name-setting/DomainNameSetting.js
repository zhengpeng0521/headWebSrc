import {
    GetApplyStatus,             //获取当前租户申请状态
    FirstStepApplyForSubmit,    //第一步申请使用点击提交
    ForthStepSetSubmit          //第四步保存设置事件
} from '../../../../services/system/domain-name-setting/DomainNameSetting';
import {parse} from 'qs';
import {message} from 'antd';

export default {

	namespace: 'domainNameSetting',

	state: {
        step : 0,                               //步骤条步数(必须是num)
        loading : false,                        //整个页面加载状态
        wetherGetStatus : false,                //获取租户申请状态是否成功(失败则使页面变为空页面)
        hostName : undefined,                   //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
        /*域名设置 第一步 申请*/
        firstStepSubmitButtonLoading : false,   //申请使用按钮加载状态

        /*域名设置 第四步 各种设置*/
        forthStepBackgroundImg : [],            //用户选择或回填的背景图
        forthStepLogoImg : [],                  //用户选择或回填的logo图片
        forthStepName : undefined,              //用户输入或回填的商户姓名
        forthStepSubmitButtonLoading : false,   //保存设置按钮加载状态
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if(pathname === '/sys_scfg_host') {
                    //获取当前租户申请状态
                    dispatch({
                        type:'GetApplyStatus'
                    })
				}
			});
		},
	},

	effects: {
        //获取当前租户申请状态
        *'GetApplyStatus'({ payload } , { call , put , select }){
            yield put({ type : 'showAllPageLoading' });
            let { ret } = yield call(GetApplyStatus,parse(payload));
            if(ret && ret.errorCode == '9000'){
                let step = !isNaN(ret.status + '') ? parseFloat(ret.status) : 0;
                yield put({
                    type:'updateState',
                    payload:{
                        wetherGetStatus : true,     //获取租户申请状态是否成功(失败则使页面变为空页面)
                        step
                        //step : 0
                    }
                });
                if(step != 0){
                    yield put({
                        type : 'updateState',
                        payload : {
                            hostName : ret.hostName || '***(unknown)'
                        }
                    })
                }
                if(step == 3){
                    let forthStepBackgroundImg = [{
                        uid : -1 ,
                        url : !!ret.bgimg ? ret.bgimg : 'https://img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5',
                        name : '背景图',
                        thumbUrl : !!ret.bgimg ? ret.bgimg : 'https://img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5',
                    }];
                    let forthStepLogoImg = [{
                        uid : -2 ,
                        url : ret.logoimg ? ret.logoimg : 'https://img.ishanshan.com/gimg/img/f204fd8affff8cdb30b68554143ef4f5',
                        name : 'logo图',
                        thumbUrl : ret.logoimg ? ret.logoimg : 'https://img.ishanshan.com/gimg/img/f204fd8affff8cdb30b68554143ef4f5',
                    }]
                    yield put({
                        type:'updateState',
                        payload:{
                            forthStepBackgroundImg,
                            forthStepLogoImg,
                            forthStepName : !!ret.brandName ? ret.brandName : undefined
                        }
                    })
                }
            }else{
                ret &&　ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取租户申请状态失败');
                yield put({
                    type : 'updateState' ,
                    payload : {
                        wetherGetStatus : false     //获取租户申请状态是否成功(失败则使页面变为空页面)
                    }
                })
            }
            yield put({ type : 'closeAllPageLoading' });
        },

        //第一步申请使用点击提交
        *'FirstStepApplyForSubmit'({ payload } , { call , put , select }){
            yield put({ type : 'showAllPageLoading' });
            yield put({ type : 'showfirstStepSubmitButtonLoading' });
            let { ret } = yield call(FirstStepApplyForSubmit,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('提交申请成功');
                yield put({ type : 'GetApplyStatus' })
            }else{
                ret &&　ret.errorMessage ? message.error(ret.errorMessage) : message.error('提交申请失败')
            }
            yield put({ type : 'closeAllPageLoading' });
            yield put({ type : 'closefirstStepSubmitButtonLoading' });
        },

        //第四步保存设置事件
        *'ForthStepSetSubmit'({ payload } , { call , put , select }){
            yield put({ type : 'showAllPageLoading' });
            yield put({ type : 'showforthStepSubmitButtonLoading' });
            let { ret } = yield call(ForthStepSetSubmit,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('域名背景图，logo图与品牌名称设置成功');
                yield put({ type : 'GetApplyStatus' })
            }else{
                ret &&　ret.errorMessage ? message.error(ret.errorMessage) : message.error('设置失败，请重新保存')
            }
            yield put({ type : 'closeAllPageLoading' });
            yield put({ type : 'closeforthStepSubmitButtonLoading' });
        },
	},

	reducers: {
		updateState(state, action) {
            return { ...state, ...action.payload }
        },
        showAllPageLoading(state, action) {
            return { ...state, loading : true }
        },
        closeAllPageLoading(state, action) {
            return { ...state, loading : false }
        },
        showfirstStepSubmitButtonLoading(state, action) {
            return { ...state, firstStepSubmitButtonLoading : true }
        },
        closefirstStepSubmitButtonLoading(state, action) {
            return { ...state, firstStepSubmitButtonLoading : false }
        },
        showforthStepSubmitButtonLoading(state, action) {
            return { ...state, forthStepSubmitButtonLoading : true }
        },
        closeforthStepSubmitButtonLoading(state, action) {
            return { ...state, forthStepSubmitButtonLoading : false }
        },
	},
}
