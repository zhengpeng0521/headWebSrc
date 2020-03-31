import {
    tmkStuList,
    tmkTodayCount,
    queryFollowResult,
    dictGetByKey,
    followCreate,
    distributionCampus,
    addVisitRecord,
    addAudition,
    recycleStu,
    followUserList,
    queryFollowList,
    tryDayQuery,
    tryCourseQuery,
    queryCoursePlan
} from "../../../services/tmk/tmkOwnSeaService"
import { parse } from "qs"
import { message } from "antd"

export default {
    namespace: "TmkOwnSeaModel",

    state: {
        /*快捷搜索*/
        fastSearchContent: {}, //快捷搜索栏搜索内容
        stuFollowStatelist: [],    // 学员跟进状态
        searchName: '',
        nextFollowTimeStart: '',
        nextFollowTimeEnd: '',
        studentFollowState: '',
        deptName: '',
        /*高级搜索*/
        superSearchVisible: false, //高级搜索是否显示
        followUserList: [], // 跟进人列表
        followResultList: [], // 跟进结果
        channel: [], // 来源类别
        secondChannel: [], //市场渠道
        superSearchContent: {}, //高级搜索栏搜索内容
        /*table*/
        tableNewColumns: [], //选择列表是否显示字段是哪些
        tableLoading: false, //列表是否加载状态
        tableDataSource: [], //table列表数据
        selectedRows: [],
        selectedRowKeys: [],
        /*pagination*/
        resultCount: 0, //数据总共数目
        pageIndex: 0, //页码
        pageSize: 20, //每页条数
        /* 机构选择 */
        selectModalVisible    : false,       //校区选择框是否可见
        selectOrgs            : [],          //机构选择- 选择的机构列表
        /* 学员跟进modal */
        stuFollowModalVisible: false, //学员跟进modal是否显示
        stuFollowModalLoading: false, //学员跟进modal加载状态
        stuFollowModalButtonLoading: false, //学员跟进modal按钮加载状态
        followData: {}, // 跟进表单数据
        followList: [], //跟进列表
        followListHasMore: true,
        followPageSize: 3,
        followPageindex: 0,
        /* 学员预约 */
        stuOrderModalVisible: false, //学员预约modal是否显示
        stuOrderModalLoading: false, //学员预约modal加载状态
        stuOrderModalButtonLoading: false, //学员预约modal按钮加载状态
        stuOrderData: {
            orderType: "1"
        }, // 学员预约表单数据
        tryOrgId         : '',              //预约试听校区
        dayList          : [],              //有课日期列表
        courseList       : [],              //课程下拉列表
        courseDataSource : [],              //当日有课列表
        selectLessonId : '',                //新增表单里面选中的课程
        selecttime : '',                    //选中的日期
        selectCourseTime : '',              //选择课程教室时间
        /* 分配校区 */
        distributeModalVisible: false, //分配校区modal是否显示
        distributeModalLoading:false, //分配校区modal加载状态
        distributeModalButtonLoading:false, //分配校区modal按钮加载状态
        orgId: '', //选择分配校区
        /* 跟进数据 */
        unRecordNum: 0, //待跟进数据
        recordNum: 0,   //已跟进数据
        recordItem: {},
        followRecordLoading: false,

        isAssign: false,        // 是否已分配
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/hq_tmk_ownsea') {
                    dispatch({
                        type : 'GetTableList',
                        payload: {
                            pageSize: 20,
                            pageIndex:0,
                            fastSearchContent  : {},
                            superSearchContent : {}
                        }
                    });
                    dispatch({
                        type : 'tmkTodayCount'
                    });
                    dispatch({
                        type : 'queryFollowResult',
                        payload: {
                            confKey: 'FOLLOW_RESULT'
                        }
                    });
                    dispatch({
                        type: 'queryChannelByKey',
                        payload: {
                            dictkey: 'firstChannel'
                        }
                    });
                    dispatch({
                        type: 'querySecondChannelByKey',
                        payload: {
                            dictkey: 'secondChannel'
                        }
                    });
                    dispatch({
                        type: 'queryFollowStatusByKey',
                        payload: {
                            dictkey: 'studentFollowState'
                        }
                    });
                    dispatch({
                        type: 'formatList'
                    });
                    dispatch({
                        type: 'followUserList'
                    })
                }
            });
        }
    },

    effects: {
        //关闭校区选择框
        *onSelectOrgModalClose({ payload },{ select , put , call }){
            let { selectModalVisible } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    selectModalVisible : !selectModalVisible
                }
            })
        },
        //点击提交更新校区
        *afterSelectOrgModalSubmit({ payload },{ select , put , call }){
            let { selectOrgs } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    selectOrgs
                }
            })
        },
        //列表数据
        *GetTableList({ payload },{ select , call , put}){
            yield put({ type : 'showTableLoading' });
            let fastSearchContent = payload.fastSearchContent || {};
            let superSearchContent = payload.superSearchContent || {};
            delete payload.fastSearchContent;
            delete payload.superSearchContent;
            let params = { ...payload , ...fastSearchContent , ...superSearchContent, type:'6' };
            for (const i in params) {
                if (params[i] == null || params[i] == undefined || params[i] == '') {
                  delete params[i]
                }
                params.pageIndex = payload.pageIndex
            }
            let { ret } = yield call( tmkStuList, ({ ...params }));
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        tableDataSource : ret.results || [],
                        resultCount : ret.data && ret.data.resultCount || 0,
                        pageSize   : ret.data && ret.data.pageSize || 20,
                        pageIndex  : ret.data && ret.data.pageIndex || 0,
                        selectedRowKeys       : [],
                        selectedRows          : [],
                        fastSearchContent  : fastSearchContent,          //更新常用搜索内容项
                        superSearchContent : superSearchContent
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '查询个人池列表出错啦');
          }
          yield put({ type : 'closeTableLoading' });
        },
        //跟进人数
        *tmkTodayCount({ payload },{ select , call , put}){
            let { ret } = yield call( tmkTodayCount, ({ payload }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        recordNum : ret.recordNum,
                        unRecordNum : ret.unRecordNum,
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '查询跟进数据出错');
            }
        },
        //跟进结果下拉
        *queryFollowResult({ payload },{ select , call , put}){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true
                }
            })
            let { ret } = yield call( queryFollowResult, ({ ...payload }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        followResultList: ret.data && ret.data.results ? ret.data.results : []
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '查询跟进结果出错');
            }
            yield put({
                type : 'updateState',
                payload : {
                    loading : false
                }
            })
        },
         //来源下拉
         *queryChannelByKey({ payload },{ select , call , put}){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true
                }
            })
            let { ret } = yield call( dictGetByKey, ({ ...payload }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        channel: ret.results || []
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '查询跟进结果出错');
            }
            yield put({
                type : 'updateState',
                payload : {
                    loading : false
                }
            })
        },
        //渠道下拉
        *querySecondChannelByKey({ payload },{ select , call , put}){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true
                }
            })
            let { ret } = yield call( dictGetByKey, ({ ...payload }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        secondChannel: ret.results || []
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '查询跟进结果出错');
            }
            yield put({
                type : 'updateState',
                payload : {
                    loading : false
                }
            })
        },
        //跟进状态下拉
        *queryFollowStatusByKey({ payload },{ select , call , put}){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true
                }
            })
            let { ret } = yield call( dictGetByKey, ({ ...payload }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        stuFollowStatelist : ret.results || []
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '查询跟进结果出错');
            }
            yield put({
                type : 'updateState',
                payload : {
                    loading : false
                }
            })
        },
        //新建跟进
        *followCreate({ payload },{ select , call , put}){
            yield put({ type : 'showStuFollowLoading' });
            const state = yield select(state => state.TmkOwnSeaModel)
            let clear = payload && payload.clear ? payload.clear : undefined;
            delete payload.clear;
            let { ret } = yield call( followCreate, ({ ...payload }) );
            let TmkOwnSeaModel = yield select(state => state.TmkOwnSeaModel);
            let pageSize = (payload && payload.pageSize != undefined) ? payload.pageSize :TmkOwnSeaModel.pageSize;
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        stuFollowModalVisible : false,
                        recordItem : {}
                    }
                })
                yield put({
                    type: 'GetTableList',
                    payload: {
                        pageIndex: state.pageIndex,
                        pageSize
                    }
                })
                yield put({
                    type: 'tmkTodayCount'
                })
                //新增成功清空表单
                if(!!clear){ clear() }
                message.success('新建跟进成功');
            } else {
              message.error( (ret && ret.errorMessage) || '查询跟进结果出错');
            }
            yield put({ type : 'closeStuFollowLoading' });
        },
        //新建到访
        *addVisitRecord({ payload },{ select , call , put}){
            yield put({ type : 'showStuOrderLoading' });
            const state = yield select(state => state.TmkOwnSeaModel)
            let clear = payload && payload.clear ? payload.clear : undefined;
            delete payload.clear;
            let { ret } = yield call( addVisitRecord, ({ ...payload }) );
            let TmkOwnSeaModel = yield select(state => state.TmkOwnSeaModel);
            let pageSize = (payload && payload.pageSize != undefined) ? payload.pageSize :TmkOwnSeaModel.pageSize;
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        stuOrderModalVisible : false,
                        recordItem: {}
                    }
                })
                yield put({
                    type: 'GetTableList',
                    payload: {
                        pageIndex: state.pageIndex,
                        pageSize
                    }
                })
                //新增成功清空表单
                if(!!clear){ clear() }
                message.success( '新建到访成功');
            } else {
              message.error( (ret && ret.errorMessage) || '新建出错');
            }
            yield put({ type : 'closeStuOrderLoading' });
        },
        //新建预约试听
        *addAudition({ payload },{ select , call , put}){
            yield put({ type : 'showStuOrderLoading' });
            const state = yield select(state => state.TmkOwnSeaModel)
            let TmkOwnSeaModel = yield select(state => state.TmkOwnSeaModel);
            let pageSize = (payload && payload.pageSize != undefined) ? payload.pageSize :TmkOwnSeaModel.pageSize;
            let clear = payload && payload.clear ? payload.clear : undefined;
            delete payload.clear;
            let { ret } = yield call( addAudition, ({ ...payload }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        stuOrderModalVisible : false,
                        recordItem: {}
                    }
                })
                yield put({
                    type: 'GetTableList',
                    payload: {
                        pageIndex: state.pageIndex,
                        pageSize
                    }
                })
                //新增成功清空表单
                if(!!clear){ clear() }
                message.success( '新建预约试听成功');
            } else {
              message.error( (ret && ret.errorMessage) || '新建出错');
            }
            yield put({ type : 'closeStuOrderLoading' });
        },
        //分配校区
        *distributionCampus({ payload },{ select , call , put}){
            yield put({ type : 'showDistributeLoading'})
            const state = yield select(state => state.TmkOwnSeaModel)
            let clear = payload && payload.clear ? payload.clear : undefined;
            delete payload.clear;
            let { ret } = yield call( distributionCampus, ({ ...payload }) );
            let TmkOwnSeaModel = yield select(state => state.TmkOwnSeaModel);
            let pageSize = (payload && payload.pageSize != undefined) ? payload.pageSize :TmkOwnSeaModel.pageSize;
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        distributeModalVisible : false,
                        recordItem : {}
                    }
                })
                yield put({
                    type: 'GetTableList',
                    payload: {
                        pageIndex: state.pageIndex,
                        pageSize
                    }
                })
                //新增成功清空表单
                if(!!clear){ clear() }
                message.success( '分配校区成功');
            } else {
              message.error( (ret && ret.errorMessage) || '分配校区出错');
            }
            yield put({ type : 'closeDistributeLoading'})
        },
        //返回公海池
        *recycleStu({ payload },{ select , call , put}){
            let { ret } = yield call( recycleStu, ({ ...payload, stauts:'4' }) );
            let TmkOwnSeaModel = yield select(state => state.TmkOwnSeaModel);
            let pageSize = (payload && payload.pageSize != undefined) ? payload.pageSize :TmkOwnSeaModel.pageSize;
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type:'GetTableList',
                    payload:{
                        pageIndex : 0,
                        pageSize,
                    }
                })
                message.success('已退回公海池');
            } else {
              message.error( (ret && ret.errorMessage) || '退回公海池出错');
            }
        },
        //跟进人列表
        *followUserList({ payload },{ select , call , put}){
            let { ret } = yield call( followUserList, ({ ...payload }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type:'updateState',
                    payload:{
                        followUserList : ret.results || []
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '跟进人列表出错');
            }
        },
        //查询跟进记录列表
        *queryFollowList({ payload },{ select , call , put}){
            yield put({type:'showFollowRecordLoading'})
            let TmkOwnSeaModel = yield select(state => state.TmkOwnSeaModel);
            let followPageIndex = (payload && payload.followPageIndex != undefined) ? payload.followPageIndex :TmkOwnSeaModel.followPageIndex;
            let followPageSize = (payload && payload.followPageSize != undefined) ? payload.followPageSize :TmkOwnSeaModel.followPageSize;
            delete payload.followPageSize
            let { ret } = yield call( queryFollowList, ({ ...payload, pageIndex:followPageIndex, pageSize:followPageSize }) );
            let followListHasMore = true;
            if(ret && ret.errorCode == 0 ){
                followListHasMore = ret.data && ret.data.resultCount > followPageSize
                yield put({
                    type:'updateState',
                    payload:{
                        followList : ret.results || [],
                        stuFollowModalVisible: true,
                        followListHasMore
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '跟进人列表出错');
            }
            yield put({type:'closeFollowRecordLoading'})
        },
        //预约试听 - 排课日期
        *tryDayQuery({ payload },{ select , call , put}){
            let { ret } = yield call( tryDayQuery, ({ ...payload }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type:'updateState',
                    payload:{
                        dayList : ret.dayList || [],
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '跟进人列表出错');
            }
        },
        //预约试听 - 查询可试听排课课程
        *tryCourseQuery({ payload },{ select , call , put}){
            let { ret } = yield call( tryCourseQuery, ({ ...payload }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type:'updateState',
                    payload:{
                        courseList : ret.results || [],
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '跟进人列表出错');
            }
        },
        //预约试听 - 查询排课列表
        *queryCoursePlan({ payload },{ select , call , put}){
            let TmkOwnSeaModel = yield select(state => state.TmkOwnSeaModel);
            let tryOrgId = (payload && payload.tryOrgId != undefined) ? payload.tryOrgId :TmkOwnSeaModel.tryOrgId;
            let { ret } = yield call( queryCoursePlan, ({ ...payload, orgId: tryOrgId }) );
            if(ret && ret.errorCode == 0 ){
                yield put({
                    type:'updateState',
                    payload:{
                        courseDataSource : ret.results || [],
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '跟进人列表出错');
            }
        }
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload }
        },
        showTableLoading(state, action){
            return { ...state , tableLoading : true }
        },
        closeTableLoading(state, action){
            return { ...state , tableLoading : false }
        },
        showStuFollowLoading(state,action){
        return { ...state , stuFollowModalLoading : true };
        },
        closeStuFollowLoading(state,action){
            return { ...state , stuFollowModalLoading : false };
        },
        showStuOrderLoading(state,action){
            return { ...state , stuOrderModalLoading : true };
        },
        closeStuOrderLoading(state,action){
            return { ...state , stuOrderModalLoading : false };
        },
        showDistributeLoading(state,action){
            return { ...state , distributeModalLoading : true };
        },
        closeDistributeLoading(state,action){
            return { ...state , distributeModalLoading : false };
        },
        showFollowRecordLoading(state,action){
            return { ...state , followRecordLoading : true };
        },
        closeFollowRecordLoading(state,action){
            return { ...state , followRecordLoading : false };
        }
    }
}
