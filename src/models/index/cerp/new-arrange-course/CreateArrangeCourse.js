import {
    GetCourse,              //选择校区onChange事件获取课程信息
    GetCourseDetail,        //选择课程onChange事件，通过机构ID和课程ID获取课程详情用于填写课程后面的俩空
    GetTeacher,             //选择校区onChange事件，获取主教和助教信息
    GetClassRoom,           //选择校区onChange事件获取教室信息
    CreateNewCourse         //点击生成排课
} from '../../../../services/cerp/new-arrange-course/CreateArrangeCourse';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

/*English*/
export default {

    namespace: 'createArrangeCourse',

    state: {
        loading : false,                        //整个页面是否加载状态
        buttonLoading : false,                  //新增提交按钮加载状态
        wetherCreateSuccess : false,            //是否新增成功(用来清空表单)
        defaultOrgId : '',                      //cerp默认选中的校区

        courseSelectContent : [],               //课程信息下拉列表数据
        courseDetailContent : {},               //课程详情信息
        teacherSelectContent : [],              //主教和助教下拉列表数据
        classRoomSelectContent : [],            //教室下拉列表数据
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/cerp_cp_mgr'){
                    let initOrgId = window._init_data.cerp_orgId || window._init_data.firstOrg.key;
                    dispatch({
                        type:'updateState',
                        payload:{
                            defaultOrgId : initOrgId,
                            courseDetailContent : {}            //因为课程详情信息不是填在表单中,需要手动清空
                        }
                    });
                    //获取课程信息
                    dispatch({
                        type:'GetCourse',
                        payload:{
                            orgId : initOrgId
                        }
                    });
                    //获取主教和助教信息
                    dispatch({
                        type:'GetTeacher',
                        payload:{
                            orgId : initOrgId
                        }
                    });
                    //获取教室信息
                    dispatch({
                        type:'GetClassRoom',
                        payload:{
                            orgId : initOrgId
                        }
                    });
                }
            });
        },
    },

    effects: {
        //选择校区onChange事件获取课程信息
        *'GetCourse'({ payload },{ call, put, select }){
            let { ret } = yield call(GetCourse,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        courseSelectContent : ret.results,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取课程信息');
            }
        },

        //选择课程onChange事件，通过机构ID和课程ID获取课程详情用于填写课程后面的俩空
        *'GetCourseDetail'({ payload },{ call, put, select }){
            let { ret } = yield call(GetCourseDetail,parse(payload));
            if(ret && ret.errorCode === 9000){
//                ret.minMa = 0;
//                ret.maxMa = 10000;
                yield put({
                    type:'updateState',
                    payload:{
                        courseDetailContent : ret
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取教室失败');
            }
        },

        //选择校区onChange事件,获取主教和助教信息
        *'GetTeacher'({ payload },{ call, put, select }){
            let { ret } = yield call(GetTeacher,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        teacherSelectContent : ret.results,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取教师失败');
            }
        },

        //选择校区onChange事件,获取教室信息
        *'GetClassRoom'({ payload },{ call, put, select }){
            let { ret } = yield call(GetClassRoom,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        classRoomSelectContent : ret.results,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取教室失败');
            }
        },

        //点击生成排课
        *'CreateNewCourse'({ payload },{ call, put, select }){
            yield put({ type : 'showLoading' });
            yield put({ type : 'showButtonLoading' });
            let { ret } = yield call(CreateNewCourse,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success(ret.errorMessgae || '生成排课成功')
                yield put({
                    type:'updateState',
                    payload:{
                        wetherCreateSuccess : true,
                        courseDetailContent : {}
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('生成排课失败');
            }
            yield put({ type : 'closeLoading' });
            yield put({ type : 'closeButtonLoading' });
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        //整个页面列表加载状态
        showLoading(state, action) {
            return { ...state, ...action.payload , loading : true};
        },
        //整个页面加载状态
        closeLoading(state, action) {
            return { ...state, ...action.payload , loading : false};
        },
        //查重列表加载状态
        showButtonLoading(state, action) {
            return { ...state, ...action.payload , buttonLoading : true};
        },
        //查重列表加载状态
        closeButtonLoading(state, action) {
            return { ...state, ...action.payload , buttonLoading : false};
        },
    },
};
