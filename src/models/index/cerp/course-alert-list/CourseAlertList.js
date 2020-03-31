import {
    GetCourseAlertList,             //查询续费提醒列表
    CourseAlertTableOnCancelAlert,  //table点击取消提醒
    RecoveryModalSubmit             //恢复提醒
} from '../../../../services/cerp/course-alert-list/CourseAlertList';
import { message } from 'antd';
import { parse } from 'qs';

/*续费提醒*/
export default {

    namespace: 'courseAlertList',

    state: {

        //续费提醒列表
        newColumns : [],                            //选择行显示内容
        courseAlertTableLoading : false,            //列表加载状态
        courseAlertTableDataSource : [{name:'1'}],  //列表数据
        courseAlertTableDataTotal : 0,              //列表数据条数
        courseAlertTablePageIndex : 0,              //列表页码
        courseAlertTablePageSize : 20,              //列表每页条数
        courseAlertTableSelectedRowKeys : [],       //复选框选中项的key数组
        courseAlertTableSelectedRows : [],          //复选卡U那个选中项数组

        //快捷搜索
        fastSearchContent : {},                     //快捷搜索内容

        //恢复提醒modal
        recoveryModalVisible : false,               //modal是否显示
        recoveryModalLoading : false,               //modal加载状态
        recoveryModalButtonLoading : false,         //modal中按钮加载状态

        //恢复提醒modal中的table
        recoveryModalTableDataSource : [],          //modal中table数据
        recoveryModalTableDataTotal : 0,            //列表数据条数
        recoveryModalTablePageIndex : 0,            //列表页码
        recoveryModalTablePageSize : 10,            //列表每页条数
        recoveryModalTableSelectedRowKeys : [],     //复选框选中项的key数组
        recoveryModalTableSelectedRows : [],        //复选框选中项数组
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/course_alert_list') {
                    dispatch({
                        type:'GetCourseAlertList',
                        payload:{
                            pageIndex : 0,
                            pageSize : 20,
                            periodRemind : '1'
                        }
                    })
                }
            });
        },
    },

    effects: {
        //查询续费提醒列表
        *'GetCourseAlertList'({ payload },{ call, put, select }){
            if(payload.periodRemind == '1'){
                yield put({ type : 'showAlertTableLoading' });
            }
            if(payload.periodRemind == '0'){
                yield put({ type : 'showCancelledTableLoading' });
            }
            let fastSearchContent = {};
            let params = {};
            if(payload && payload.fastSearchContent){
                fastSearchContent = payload.fastSearchContent;
                delete payload.fastSearchContent;
            }
            params = { ...payload , ...fastSearchContent }
            let { ret } = yield call(GetCourseAlertList,parse(params));
            if(ret && ret.errorCode == '9000'){
                if((ret.results).length == 0 && params.pageIndex > 0){
                    params.pageIndex -= 1;
                    let { ret } = yield call(GetCourseAlertList,parse(params));
                    if(ret && ret.errorCode == '9000'){
                        if(payload.periodRemind == '1'){
                            //续费提醒table数据赋值
                            yield put({
                                type:'alertTableAssignment',
                                payload:{
                                    ret,
                                    fastSearchContent
                                }
                            })
                        }else if(payload.periodRemind == '0'){
                            //取消提醒table数据赋值
                            yield put({
                                type:'cancelledAlertTableAssignment',
                                payload:{
                                    ret
                                }
                            })
                        }
                    }else{
                        ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('查询续费提醒列表失败')
                    }
                }else{
                    if(payload.periodRemind == '1'){
                        //续费提醒table数据赋值
                        yield put({
                            type:'alertTableAssignment',
                            payload:{
                                ret,
                                fastSearchContent
                            }
                        })
                    }else if(payload.periodRemind == '0'){
                        //取消提醒table数据赋值
                        yield put({
                            type:'cancelledAlertTableAssignment',
                            payload:{
                                ret
                            }
                        })
                    }
                }
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('查询续费提醒列表失败')
            }
            yield put({ type : 'closeAlertTableLoading' });
            yield put({ type : 'closeCancelledTableLoading' });
        },

        //table点击取消提醒
        *'CourseAlertTableOnCancelAlert'({ payload },{ call, put, select }){
            let { ret } = yield call(CourseAlertTableOnCancelAlert,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('取消提醒成功');
                let courseAlertList = yield select(state => state.courseAlertList);
                let pageIndex = courseAlertList.courseAlertTablePageIndex;
                let pageSize = courseAlertList.courseAlertTablePageSize;
                let fastSearchContent = courseAlertList.fastSearchContent;
                yield put({
                    type:'GetCourseAlertList',
                    payload:{
                        pageIndex,
                        pageSize,
                        periodRemind : '1',
                        fastSearchContent
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('取消提醒失败')
            }
        },

        //恢复提醒
        *'RecoveryModalSubmit'({ payload },{ call, put, select }){
            yield put({ type : 'showCancelledButtonLoading' })
            let { ret } = yield call(RecoveryModalSubmit,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('恢复提醒成功');
                let courseAlertList = yield select(state => state.courseAlertList);
                let courseAlertTablePageIndex = courseAlertList.courseAlertTablePageIndex;
                let courseAlertTablePageSize = courseAlertList.courseAlertTablePageSize;
                let recoveryModalTablePageIndex = courseAlertList.recoveryModalTablePageIndex;
                let recoveryModalTablePageSize = courseAlertList.recoveryModalTablePageSize;
                let fastSearchContent = courseAlertList.fastSearchContent;
                yield put({
                    type:'GetCourseAlertList',
                    payload:{
                        pageIndex : recoveryModalTablePageIndex,
                        pageSize : recoveryModalTablePageSize,
                        periodRemind : '0',
                    }
                })
                yield put({
                    type:'GetCourseAlertList',
                    payload:{
                        pageIndex : courseAlertTablePageIndex,
                        pageSize : courseAlertTablePageSize,
                        periodRemind : '1',
                        fastSearchContent
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('恢复提醒失败')
            }
            yield put({ type : 'closeCancelledButtonLoading' })
        },
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload }
        },
        //开启续费提醒table加载
        showAlertTableLoading(state, action){
            return {...state, courseAlertTableLoading : true }
        },
        //关闭续费提醒table加载
        closeAlertTableLoading(state, action){
            return {...state, courseAlertTableLoading : false }
        },
        //开启未提醒modal加载
        showCancelledTableLoading(state, action){
            return {...state, recoveryModalLoading : true }
        },
        //关闭未提醒modal加载
        closeCancelledTableLoading(state, action){
            return {...state, recoveryModalLoading : false }
        },
        //开启未提醒modal加载
        showCancelledButtonLoading(state, action){
            return {...state, recoveryModalButtonLoading : true }
        },
        //关闭未提醒modal加载
        closeCancelledButtonLoading(state, action){
            return {...state, recoveryModalButtonLoading : false }
        },
        //续费提醒table数据赋值
        alertTableAssignment(state, action){
            let ret = action.payload.ret;
            let fastSearchContent = action.payload.fastSearchContent;
            let obj = {
                courseAlertTableDataSource : ret.results,
                courseAlertTableDataTotal : ret.data.resultCount,
                courseAlertTablePageIndex : ret.data.pageIndex,
                courseAlertTablePageSize : ret.data.pageSize,
                courseAlertTableSelectedRowKeys : [],
                courseAlertTableSelectedRows : [],
                fastSearchContent,
            }
            return {...state, ...obj }
        },
        //取消提醒table数据赋值
        cancelledAlertTableAssignment(state, action){
            let ret = action.payload.ret;
            let obj = {
                recoveryModalTableDataSource : ret.results,
                recoveryModalTableDataTotal : ret.data.resultCount,
                recoveryModalTablePageIndex : ret.data.pageIndex,
                recoveryModalTablePageSize : ret.data.pageSize,
                recoveryModalTableSelectedRowKeys : [],
                recoveryModalTableSelectedRows : [],
            }
            return {...state, ...obj }
        },
    }
}
