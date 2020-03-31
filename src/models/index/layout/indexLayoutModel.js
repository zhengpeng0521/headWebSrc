/*
 *整体的布局model
 */
import {
    ChangePassWord,          //修改密码表单提交
    getSystemType,            //调用接口最左侧 应用类型
    queryOrgListBySysUid,    //机构列表
    queryYqCode,              //获取JwtToken的Code
    setDefaultLoginOrg       //设置默认校区
} from '../../../services/index/common/mainLayoutService';
import { parse } from 'qs';
import { message } from 'antd';

export default {

    namespace: 'indexMainLayoutModel',

    state: {
        currentApplication: 'saas',     //当前选中的应用编号
        applicationList: [],            //应用列表
        orgInfo : {},                   //机构信息
        userMsg : {},                   //用户信息

        /*修改密码modal*/
        passWordChangeModalVisible : false,             //修改密码modal是否显示
        passWordChangeModalButtonLoading : false,       //修改密码modal按钮加载状态

		versionInfoVisible : false,                    //版本更新提示框
		versionInfo: {                                  //版本信息
			version: '4.1.0',                     //版本更新信息-版本号
			title: '闪闪全新版本4.1.0震撼来袭！',
			updateDate: '2018-01-31',             //版本更新信息-更新时间
			details: [
				{
					title: '总部系统',
					items: [
                  	    '总部账号直接登录总部系统',
						'机构总部可以给校区分配套餐，查看数据报表，提供课件服务',
						'机构总部可以选择校区进行统一的在线招生活动',
                        '机构设置建立维护属于自己的早教品牌信息'
					]
				},{
					title: '校区系统',
					items: [
                  	    '系统优化成单校区系统，所有校区选择下拉框取消',
						'业务参数（包括角色管理、业务参数、公海池规则等）各校区独立，再也不会相互影响了',
                        '域名设置移到总部系统',
                        '新增课件服务，校区可查看总部提供的课件',
						'其他功能优化'
					]
				}
			],
        },
        switchVisible: false, // 切换校区显示
        selectedCampus: '', // 选中的校区id
        filterKey: '', // 过滤关键字
        campusList: [], // 校区列表
        userId: ''
    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line

        },
    },

    effects: {
        /*修改密码表单提交*/
        *'ChangePassWord'({ payload }, { call, put, select }){
            yield put({ type : 'openButtonLoading' });
            let { ret } = yield call(ChangePassWord,parse(payload));
            if(ret && ret.errorCode === 0){
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
            yield put({ type : 'closeButtonLoading' });
        },

		//调用接口得到招生宝和saas管理
		*'getSystemType'({ payload },{ call, put, select }){
			let { ret } = yield call( getSystemType );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						applicationList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage )
			}
        },
        //机构列表
		*'queryOrgListBySysUid'({ payload },{ call, put, select }){
			let { ret } = yield call( queryOrgListBySysUid, parse(payload));
			if( ret && ret.errorCode == 0 ){
                let userId = ''
                ret && ret.results.length > 0 && ret.results.map(item => {
                    if(Number(item.orgId) == Number(window._init_data.orgId)) {
                        userId = item.userId
                    }
                })
				yield put({
					type : 'updateState',
					payload : {
                        campusList : ret.results,
                        switchVisible: true,
                        userId: userId,
                        selectedCampus: userId
					}
                })
			}else{
				message.error( ret && ret.errorMessage )
			}
        },
        //获取JwtToken的Code
		*'queryYqCode'({ payload },{ call, put, select }){
            let baseUrl = `${window.location.protocol}//${window.location.host}/${window.location.port}`;
			let { ret } = yield call( queryYqCode, parse(payload));
			if( ret && ret.errorCode == 0 ){
				yield put({
					type : 'updateState',
					payload : {
                        switchVisible: false,
					}
                })
                window.location.href=`${BASE_URL}/logout?jwtToken=${ret.data}`
			}else{
				message.error( ret && ret.errorMessage )
			}
        },
        //设置校区默认值
		*'setDefaultLoginOrg'({ payload },{ call, put, select }){
			let { ret } = yield call( setDefaultLoginOrg, parse(payload));
			if( ret && ret.errorCode === 0 ){
				message.success( ret && ret.errorMessage )
			}else{
				message.error( ret && ret.errorMessage || '设置默认校区失败')
			}
        },
    },

    reducers: {
		changeVersionInfoVisible(state, action) {
            let { versionInfoVisible } = state;
            return {...state, versionInfoVisible: !versionInfoVisible, }
      	},

		closeVersionInfoVisible(state, action) {
            return {...state, versionInfoVisible: false, }
      	},

        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        /*修改密码表单开启按钮加载状态*/
        openButtonLoading(state, action) {
            return { ...state, ...action.payload, passWordChangeModalButtonLoading : true};
        },
        /*修改密码表单关闭按钮加载状态*/
        closeButtonLoading(state, action) {
            return { ...state, ...action.payload, passWordChangeModalButtonLoading : false};
        },
    },
};

