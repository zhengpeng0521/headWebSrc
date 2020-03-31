import {
    QueryOrgSraff,              //校区下的员工查询
    GetRoleList,                //获取角色下拉列表用于查询
    GetPublicAndStaffMessage,   //获取公海池可分配信息及每个员工已分配信息
    LeadsDispatchInputOnSubmit  //点击保存
} from '../../../../services/crm/leads-follow/LeadDispatch';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

/*English*/
export default {

    namespace: 'leadsDispatch',

    state: {
        orgId : undefined,                              //校区id
        leadsDispatchUsefulLeadsNum : 100,              //可分配的leads数
        leadsDispatchAlreadyDispatchLeadsNum : 0,       //已分配的leads数

        leadsDispatchDispatchLoading : false,           //是否在加载状态
        leadsDispatchDispatchButtonLoading : false,     //提交按钮是否加载状态
        leadsDispatchWetherSubmitSuc : false,           //是否提交成功
        leadsDispatchDispatchType : '1',                //分配类型('1'自定义/'2'平均分配)

        leadsDispatchRoleSelectContent : [],            //角色下拉列表内容

        leadsDispatchStaffContent : [],                 //员工摘要信息(id,name,hasNum,dispatchNum)(平均分配专用)
        leadsDispatchStaffChooseArr : [],               //选中的员工ID数组

        leadsDispatchStaffMaxLeadsNum : 0,              //每个员工最多分配leads数

        /*alert modal*/
        leadsDispatchAlertModalVisible : false,         //超额提示框是否显示
        leadsDispatchAlertModalWetherAlert : false,     //员工是否超额
        leadsDispatchAlertModalStaff : {},              //超额员工信息
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/crm_leads_assign'){
                    //获取角色下拉列表用于查询
                    dispatch({
                        type:'GetRoleList'
                    })
                    //获取公海池可分配信息及每个员工已分配信息
                    dispatch({
                        type:'GetPublicAndStaffMessage',
                    });
                }
            });
        },
    },

    effects: {
        //获取角色下拉列表用于查询
        *'GetRoleList'({ payload },{ put , call , select }){
            let { ret } = yield call(GetRoleList,parse(payload));
            if(ret && ret.errorCode == '9000'){
                //删除系统管理员不显示
                for(let i in ret.results){
                    if(ret.results[i].roleKey == 'admin'){
                        ret.results.splice(i,1);
                        break;
                    }
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        leadsDispatchRoleSelectContent : ret.results
                    }
                })
            }else{
                message.error('角色信息获取失败，查询功能失效');
            }
        },
        //获取公海池可分配信息及每个员工已分配信息
        *'GetPublicAndStaffMessage'({ payload },{ put , call , select }){
            let roleId = undefined;
            if(!!payload && payload.roleId){
                roleId = payload.roleId;
                delete payload.roleId
            }
            yield put({
                type:'updateState',
                payload:{
                    leadsDispatchAlreadyDispatchLeadsNum : 0,       //已分配的leads数
                    leadsDispatchDispatchLoading : false,           //是否在加载状态
                    leadsDispatchDispatchButtonLoading : false,     //提交按钮是否加载状态
                    leadsDispatchDispatchType : '1',                //分配类型('1'自定义/'2'平均分配)
                    leadsDispatchStaffContent : [],                 //员工摘要信息(id,name,hasNum,dispatchNum)(平均分配专用)
                    leadsDispatchStaffChooseArr : [],               //选中的员工ID数组
                    leadsDispatchAlertModalVisible : false,         //超额提示框是否显示
                    leadsDispatchAlertModalWetherAlert : false,     //员工是否超额
                    leadsDispatchAlertModalStaff : {},              //超额员工信息
                }
            });
            let { ret } = yield call(GetPublicAndStaffMessage,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        orgId : ret.orgId,
                        leadsDispatchUsefulLeadsNum : ret.noSellerNum,
                        leadsDispatchStaffMaxLeadsNum : ret.allowNum,
                        //leadsDispatchStaffMaxLeadsNum : 2
                    }
                });
                //校区下的员工查询
                yield put({
                    type:'QueryOrgSraff',
                    payload:{
                        orgId : ret.orgId,
                        status : 1,
                        Message : ret.results,
                        roleId
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取机构下员工分配信息失败');
            }
        },

        //校区下的员工查询
        *'QueryOrgSraff'({ payload },{ put , call , select }){
            let Message = [];
            if(payload && payload.Message){
                Message = payload.Message;
                delete payload.Message;
            }
            let { ret } = yield call(QueryOrgSraff,parse(payload));
            if(ret && ret.errorCode === 9000){
                //已分配名单的员工id和已分配名单数

                //员工摘要数组[{id,name,hasNum}]
                let leadsDispatchStaffContent = ret.results;
                //初始化员工已分配数和即将分配数
                for(let i in leadsDispatchStaffContent){
                    leadsDispatchStaffContent[i].hasNum = 0;            //已分配数
                    leadsDispatchStaffContent[i].dispatchNum = 0;       //即将分配数
                }
                //通过比对格式化员工已分配数
                for(let i in Message){
                    for(let j in leadsDispatchStaffContent){
                        if(Message[i].sellerId == leadsDispatchStaffContent[j].id){
                            leadsDispatchStaffContent[j].hasNum = Message[i].hasNum;
                            break;
                        }
                    }
                }
                yield put({
                    type:'updateState',
                    payload:{
                        leadsDispatchStaffContent,
                        leadsDispatchStaffChooseArr : []
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取机构下员工信息失败');
            }
        },

        //点击保存
        *'LeadsDispatchInputOnSubmit'({ payload },{ put , call , select }){
            yield put({ type:'showTableLoading' });
            yield put({ type:'showDispatchButtonLoading' });
            let { ret } = yield call(LeadsDispatchInputOnSubmit,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success('名单分配员工成功');
                let leadsDispatch = yield select(state => state.leadsDispatch);
                let leadsDispatchDispatchType = leadsDispatch.leadsDispatchDispatchType;
                yield put({
                    type:'updateState',
                    payload:{
                        leadsDispatchWetherSubmitSuc : true,
                        leadsDispatchAlreadyDispatchLeadsNum : 0,
                        leadsDispatchStaffChooseArr : [],
                    }
                });
                yield put(routerRedux.push({
                    pathname: 'crm_leads_assign',
                }));
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('保存失败');
            }
            yield put({ type:'closeDispatchButtonLoading' });
            yield put({ type:'closeTableLoading' });
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        //列表加载状态
        showTableLoading(state, action) {
            return { ...state, ...action.payload , leadsDispatchDispatchLoading : true};
        },
        //列表加载状态
        closeTableLoading(state, action) {
            return { ...state, ...action.payload , leadsDispatchDispatchLoading : false};
        },
        //分配表单按钮加载状态
        showDispatchButtonLoading(state, action) {
            return { ...state, ...action.payload , leadsDispatchDispatchButtonLoading : true};
        },
        //分配表单按钮加载状态
        closeDispatchButtonLoading(state, action) {
            return { ...state, ...action.payload , leadsDispatchDispatchButtonLoading : false};
        },
    },
};
