import {
    GetCourseListByDay
} from '../../../../../services/cerp/print-file/new-follow-course-print/NewFollowCoursePrint';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

/*按课程打印签到表(暂时不用)*/
export default {

    namespace: 'newFollowCoursePrint',

    state: {
        wetherClickRouteIn : false,     //是否是点击路由进入
        loading : false,                //页面加载状态
        orgId : undefined,              //当前选中校区的orgId
        courseSelectContent : [],       //搜课程搜索栏数据
        listData : [],                  //列表数据
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/cerp_jw_signprint'){
                    dispatch({
                        type : 'clearData'
                    })
                    if(window._init_data && window._init_data.cerp_orgId){
                        dispatch({
                            type : 'updateState',
                            payload : {
                                orgId : window._init_data.cerp_orgId
                            }
                        })
                    }else{
                        message.error('校区信息获取失败，请重试');
                    }
                }
            });
        },
    },

    effects: {
        *'GetCourseListByDay'({ payload } , { put , call , select }){
            yield put({ type : 'showLoading' });
            let { ret } = yield call(GetCourseListByDay,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type : 'updateState',
                    payload : {
                        courseSelectContent : ret.results
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取课程信息失败' )
            }
            yield put({ type : 'closeLoading' });
        }
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        clearData(state, action){
            let obj = {
                wetherClickRouteIn : true,      //是否是点击路由进入
                loading : false,                //页面加载状态
                courseSelectContent : [],       //搜课程搜索栏数据
                listData : [],                  //列表数据
            }
            return { ...state, ...obj };
        },
        showLoading(state, action) {
            return { ...state, loading : true };
        },
        closeLoading(state, action) {
            return { ...state, loading : false };
        },
    },
};
