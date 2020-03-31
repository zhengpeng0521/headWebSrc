import {
	getStuIdList,            //得到拥有会员卡 的学员下拉列表
	getCourseList,           //得到学员 拥有课时的课程

	confirmAddUseClass,      //新增消课记录

} from '../../../../services/crm/vip-manage/useClassService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'addUseClassModel',

    state : {
		orgId                  : undefined,       //选中第一个校区
		visible                : false,           //新增消课记录 是否显示

		vipCardId              : undefined,       //所选学员的会员卡号

		stuIdList              : [],              //拥有会员卡的学员下拉列表
		courseList             : [],              //消课课程下拉列表
		selectedCourse         : [],              //选中所需消课的课程
		addUseClassBtnLoading  : false,           //表单提交后 按钮变loading状态


    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/use_class' ){

                }
            })
        }
    },

    effects : {
		//打开 新增消课记录模态框
		*openAddUseClassModal({ payload },{ call, put, select }){
			//得到拥有会员卡的学员列表
			let orgId = window._init_data.firstOrg.key || undefined;
			let { ret } = yield call( getStuIdList, ({ orgId }) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						orgId,
						visible   : true,
						stuIdList : ret.results || []
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取学员下拉列表失败' )
			}
		},

		//选择校区得到学员列表
		*TenantSelectOnSelect({ payload },{ call, put, select }){
			let { value } = payload;
			//得到拥有会员卡的学员列表
			let { ret } = yield call( getStuIdList, ({ orgId : value }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						vipCardId      : undefined,          //会员卡id清空
						courseList     : [],                 //学员课程列表清空
						selectedCourse : [],                 //所选课程清空
						stuIdList      : ret.results || []   //学员列表
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取学员下拉列表失败' )
			}
		},

		//得到 学员拥有课时的课程
		*getCourseList({ payload },{ call, put, select }){
			let { value } = payload;          //stuId
			let { ret } = yield call( getCourseList, ({ stuId : value }));
			if( ret && ret.errorCode == 9000 ){
				 yield put({
					 type : 'updateState',
					 payload : {
						 courseList : ret.results
					 }
				 })
			}else{
				message.error( ret && ret.errorMessage || '获取课程下拉列表失败' )
			}
		},

		//确认新增消课记录
		*confirmAddUseClass({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					addUseClassBtnLoading : true
				}
			})
			let { values } = payload;
			let { ret } = yield call( confirmAddUseClass, ( values ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						visible        : false,
						vipCardId      : undefined,
						selectedCourse : [],
						courseList     : []
					}
				})
				yield put({
					type : 'useClassModel/refreshList'
				})
				message.success('新增消课记录成功')
			}else{
				message.error( ret && ret.errorMessage || '新增消课记录失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					addUseClassBtnLoading : false
				}
			})
		},

    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
