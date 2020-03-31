import {
	getStudentList,             //得到学员列表

	getStudentIdList,           //得到学员下拉列表
	confirmAddBindStudent,

	cancelBindParent,           //解除关联学员

	getCurrentItem

} from '../../../../services/crm/parent-manage/parentManageDetailService';
import {
	getDicSelects               //得到家长关系列表
} from '../../../../services/index/common/searchSelectListService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'parentManageDetailModel',

    state : {
		detailVisible                 : false,              //详情是否显示
		activeKey                     : '1',

		currentItem                   : undefined,          //当前选中家长

		/*学员列表参数*/
		studentDataSource             : [],
		studentResultCount            : 0,
		studentPageSize               : 20,
		studentPageIndex              : 0,
		studentLoading                : false,

		/*添加关联学员*/
		stuIdList                     : [],
		parentRelationList            : [],
		addBindStudentVisible         : false,
        addBindButtonLoading          : false
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/crm_stuparent_list' ){
                }
            })
        }
    },

    effects : {

		/*得到当前列表信息*/
		*getCurrentItem({ payload },{ call, put, select }){
			let state = yield select( state => state.parentManageDetailModel );
			let currentItem = state.currentItem;
			let orgId = !!currentItem && currentItem.orgId;
			let id = !!currentItem && currentItem.id;
			let { ret } = yield call( getCurrentItem, ({ orgId, id }));
			if( ret && ret.errorCode == 9000 ){
//				let params = {
//					name         : ret.name         || '',
//					mobile       : ret.mobile       || '',
//					workUnit     : ret.workUnit     || '',
//					email        : ret.email        || '',
//					bandStatus   : ret.bandStatus   || ''
//				}
				yield put({
					type : 'updateState',
					payload : {
						currentItem : ret
					}
				})
			}
		},

		/*打开家长详情*/
		*showDetail({ payload },{ call, put, select }){
			let { record } = payload;
			let state = yield select( state => state.parentManageDetailModel );
			let params = {
				orgId    : record.orgId,
				parentId : record.id
			}
			yield put({
				type : 'getStudentList',
				payload : {
					params
				}
			})
			yield put({
				type : 'updateState',
				payload : {
					detailVisible : true,
					currentItem   : record
				}
			})
		},

		//得到学员列表
		*getStudentList({ payload },{ call, put, select }){
			let { params } = payload;
			let { ret } = yield call( getStudentList, (params));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						studentDataSource    : ret.results,
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '学员列表加载失败' )
			}
		},

		/*点击添加学员*/
		*addBindStudent({ payload },{ call, put, select }){
			let state = yield select( state => state.parentManageDetailModel );
			let currentItem = state.currentItem;
			let orgId = currentItem.orgId;
			let { ret } = yield call( getStudentIdList, ({ orgId, condition : 'all' }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						stuIdList : ret.results,
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '学员下拉加载失败' )
			}
			let parentRelation = yield call( getDicSelects, ({ dictkey : 'parentRelationship' }));
			if( parentRelation && parentRelation.ret && parentRelation.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						parentRelationList : parentRelation.ret.list
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '家长关系加载失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					addBindStudentVisible : true
				}
			})
		},

		/*确认添加学员*/
		*confirmAddBindStudent({ payload },{ call, put, select }){
            yield put({ type : 'showAddBindButtonLoading' });
			let { values } = payload;
			let state = yield select( state => state.parentManageDetailModel );
			let currentItem = state.currentItem;
			let params = {
				id     : currentItem.id,
				orgId  : currentItem.orgId,
				...values
			}
			let { ret } = yield call( confirmAddBindStudent, ( params ));
			if( ret && ret.errorCode == 9000 ){
                message.success('添加成功');
				yield put({
					type : 'updateState',
					payload : {
						addBindStudentVisible : false
					}
				})
				let params1 = {
					orgId    : currentItem.orgId,
					parentId : currentItem.id
				}
				yield put({
					type : 'getStudentList',
					payload : {
						params : params1
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '添加学员失败' )
			}
            yield put({ type : 'closeAddBindButtonLoading' });
		},

		/*解除关联学员*/
		*cancelBindParent({ payload },{ call, put, select }){
			let { selectedRecords } = payload;
			let state = yield select( state => state.parentManageDetailModel );
			let currentItem = state.currentItem;
            let parentAndStuIdMap = JSON.stringify( selectedRecords );
            let { ret } = yield call( cancelBindParent, ({ parentAndStuIdMap : parentAndStuIdMap }));
			if( ret && ret.errorCode == 9000 ){
				let params = {
					orgId    : currentItem.orgId,
					parentId : currentItem.id
				}
				yield put({
					type : 'getStudentList',
					payload : {
						params
					}
				})
			}
		},

		/*改变tab*/
		*changeTab({ payload },{ call, put, select }){
			let { activeKey } = payload;
			yield put({
				type : 'updateState',
				payload : {
					activeKey
				}
			})
		},

		/*点击名单转化记录 */
		*leaderTurnRecord({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					leadersTurnRecordVisible : true
				}
			})
		}
	},

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        },
        showAddBindButtonLoading( state, action ){
            return { ...state, addBindButtonLoading : true };
        },
        closeAddBindButtonLoading( state, action ){
            return { ...state, addBindButtonLoading : false };
        },
    }
}
