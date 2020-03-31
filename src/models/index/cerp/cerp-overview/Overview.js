import {
    GetNowTime,                 //获取当前时间以查询排课信息
    GetStu,                     //获取学员信息
    GetTeacher,                 //获取主教和助教信息
    GetFirstArrangeCourse,      //获取首页默认展示的排课数据
    GetArrangeCourseList,       //获取排课信息
    GetSignDetail,              //左侧下方灰色区域点击事件查询考勤明细
    CerpOverviewSignModalSubmit,//首页签到点击签到
    GetTodaySignData,           //获取今日签到信息
    GetCourseAlertNum           //获取续费提醒课时信息
} from '../../../../services/cerp/overview/Overview';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { FormatDate } from '../../../../utils/dateFormat';
import { lodopPrintAttendance } from '../../../../utils/lodopPrintUtils';

/*English*/
export default {

    namespace: 'cerpOverview',

    state: {
        selfOrgId : '',                                 //当前校区的orgId
        nowDate : '',                                   //当天的日期
        stuDetail : [],                                 //学员信息
        teacherDetail : [],                             //助教和助教信息

        //首页上方
        firstArrangeCourse : [],                        //默认第一条的排课信息
        curentArrangeCourseList : [],                   //当前学员的排课信息(select下拉选中之后)
        allArrangeCourseList : [],                      //排课信息(全部排课信息)
        topLeftLoading : false,                         //首页上方左边加载状态
        topRightLoading : false,                        //首页上方右边加载状态

        //签到modal
        wetherToday : true,                             //是否是今天(今天可以考勤和编辑明细，非今日只能编辑明细，cerp首页签到固定式今日，主要是考勤页面需要此参数来判断)
        cerpOverviewSignModalVisible : false,           //首页签到modal是否显示
        cerpOverviewSignModalLoading : false,           //首页签到modal加载状态
        cerpOverviewSignModalButtonLoading : false,     //首页签到modal按钮加载状态
        cerpOverviewSignSingleDetail : [],              //点击每一项之后获取的详情信息

        //查看排课信息modal('all'/'stu')
        cerpOverviewCheckCourseModalType : '',          //查看排课信息modal类型('all'全部排课/'stu'当前学生排课)
        cerpOverviewCheckCourseModalVisible : false,    //查看排课信息modal是否显示
        cerpOverviewCheckCourseModalLoading : false,    //查看排课信息modal加载状态

        //今日签到信息
        todaySignMessage : {},                          //今日签到信息

        //续费提醒
        courseAlertNum : '--',                          //续费提醒课时数
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/cerp_homepage'){
                    //获取当前时间以查询排课信息(在此之后请求排课信息数据)
                    dispatch({
                        type:'GetNowTime'
                    });
                    //获取学员信息(填充首页下拉列表)
                    dispatch({
                        type:'GetStu',
                        payload:{
                            orgId : window._init_data.cerp_orgId,
                        }
                    });
                    //获取主教和助教信息(填充签到记录下拉列表)
                    dispatch({
                        type:'GetTeacher',
                        payload:{
                            orgId : window._init_data.cerp_orgId,
                        }
                    });

                    dispatch({
                        type:'GetTodaySignData',
                        payload:{
                            orgId : window._init_data.cerp_orgId,
                        }
                    });

                    //获取续费提醒课时数
                    dispatch({
                        type:'GetCourseAlertNum',
                    });

                    //初始化lodop打印配置
                    dispatch({
                        type:'initLodopConfig'
                    })
                }
            });
        },
    },

    effects: {
        //获取当前时间以查询排课信息
        *'GetNowTime'({ payload },{ call, put, select }){
            let { ret } = yield call(GetNowTime);
            yield put({
                type:'GetFirstArrangeCourse',
                payload:{
                    startDate : ret && ret.date ? ret.date : FormatDate(new Date()).substr(0,10),
                    endDate : ret && ret.date ? ret.date : FormatDate(new Date()).substr(0,10),
                    //startDate : '2017-07-18',
                    //endDate : '2017-07-18',
                    orgId : window._init_data.cerp_orgId,
                }
            });
            yield put({
                type:'GetArrangeCourseList',
                payload:{
                    startDate : ret && ret.date ? ret.date : FormatDate(new Date()).substr(0,10),
                    endDate : ret && ret.date ? ret.date : FormatDate(new Date()).substr(0,10),
                    //startDate : '2017-07-18',
                    //endDate : '2017-07-18',
                    orgId : window._init_data.cerp_orgId,
                    pageIndex : 0,
                    pageSize : 99999
                }
            });
        },

        //获取学员信息
        *'GetStu'({ payload },{ call, put, select }){
            let { ret } = yield call(GetStu,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        stuDetail : ret.results
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取学员信息失败');
            }
        },

        //获取主教和助教信息
        *'GetTeacher'({ payload },{ call, put, select }){
            let { ret } = yield call(GetTeacher,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        teacherDetail : ret.results
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取教师信息失败');
            }
        },

        //获取第一条默认排课信息
        *'GetFirstArrangeCourse'({ payload },{ call, put, select }){
            let { ret } = yield call(GetFirstArrangeCourse,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        nowDate : payload.startDate,
                        selfOrgId : payload.orgId,
                        firstArrangeCourse : ret.results
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取默认排课信息失败');
            }
        },

        //获取排课信息
        *'GetArrangeCourseList'({ payload },{ call, put, select }){
            let { ret } = yield call(GetArrangeCourseList,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        nowDate : payload.startDate,
                        selfOrgId : payload.orgId,
                        allArrangeCourseList : ret.results
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取排课信息失败');
            }
        },

        //选中学员后获取当前学员的排课信息
        *'GetCurrentStuArrangeCourseList'({ payload },{ call, put, select }){
            yield put({ type : 'showTopRightLoading' });
            let { ret } = yield call(GetArrangeCourseList,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        cerpOverviewCheckCourseModalType : 'stu',
                        curentArrangeCourseList : ret.results,
                        cerpOverviewCheckCourseModalVisible : true
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取当前学员排课信息失败');
            }
            yield put({ type : 'closeTopRightLoading' });
        },

        //左侧下方灰色区域点击事件查询考勤明细
        *'GetSignDetail'({ payload },{ call, put, select }){
            let left = payload && payload.left || false;
            let right = payload && payload.right || false;
            delete payload.left;
            delete payload.right;
            if(left){
                yield put({ type : 'showTopLeftLoading' });
            }
            if(right){
                yield put({ type : 'showCheckCourseModalLoading' });
            }
            let { ret } = yield call(GetSignDetail,parse(payload));
            if(ret && ret.errorCode === 9000){
                //防止登录失效
                window.wActivityTimer = setInterval(function(){
					serviceRequest(
						BASE_URL + '/organController/getTenant', {}
					)
				}, 600000 )
                yield put({
                    type:'updateState',
                    payload:{
                        cerpOverviewSignModalVisible : true,
                        cerpOverviewSignSingleDetail : ret
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取排课信息失败');
            }
            if(left){
                yield put({ type : 'closeTopLeftLoading' });
            }
            if(right){
                yield put({ type : 'closeCheckCourseModalLoading' });
            }
        },

        //初始化lodop打印配置
        *'initLodopConfig'({ payload }, { call, put, select }) {
            let ret = {
                errorCode: 9000,
                host: '127.0.0.1',
                port: '18000',
            };
            let head= document.getElementsByTagName('body')[0];
            let lodopjs_script= document.createElement('script');
            lodopjs_script.type= 'text/javascript';
            lodopjs_script.name= 'lodopjs';
            lodopjs_script.src= 'http://' + ret.host + ':' + ret.port + '/CLodopfuncs.js';

            function initGetCLodopFunc() {
                window.LODOP = getCLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM'));
            }
            lodopjs_script.onreadystatechange= function () {
                if (this.readyState == 'complete')  {
                    initGetCLodopFunc();
                }
            }
            lodopjs_script.onload= function(){
                initGetCLodopFunc();
            }
            head.appendChild(lodopjs_script);
        },

        //首页签到点击签到
        *'CerpOverviewSignModalSubmit'({ payload },{ call, put, select }){
            yield put({ type:'showSignModalLoading' });
            let { ret } = yield call(CerpOverviewSignModalSubmit,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success('考勤成功');
                if(payload && payload.printTicket == true){
                    lodopPrintAttendance(ret)
                }
                yield put({
                    type:'updateState',
                    payload:{
                        cerpOverviewSignModalVisible : false
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('考勤失败');
            }
            yield put({ type:'closeSignModalLoading' });
        },

        //获取今日签到信息
        *'GetTodaySignData'({ payload },{ call, put, select }){
            let { ret } = yield call(GetTodaySignData,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        selfOrgId : payload.orgId,
                        todaySignMessage : ret
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取今日签到信息失败');
            }
        },

        //获取续费提醒课时信息
        *'GetCourseAlertNum'({ payload },{ call, put, select }){
            let { ret } = yield call(GetCourseAlertNum,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        courseAlertNum : ret.num
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取续费提醒信息失败');
            }
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        //签到modal按钮加载
        showSignModalLoading(state, action) {
            return { ...state, cerpOverviewSignModalButtonLoading : true , cerpOverviewSignModalLoading : true };
        },
        //签到modal按钮取消加载
        closeSignModalLoading(state, action) {
            return { ...state, cerpOverviewSignModalButtonLoading : false , cerpOverviewSignModalLoading : false };
        },
        //上方区域左边加载
        showTopLeftLoading(state, action) {
            return { ...state, ...action.payload, topLeftLoading : true };
        },
        //上方区域左边取消加载
        closeTopLeftLoading(state, action) {
            return { ...state, ...action.payload, topLeftLoading : false };
        },
        //上方区域右边加载
        showTopRightLoading(state, action) {
            return { ...state, ...action.payload, topRightLoading : true };
        },
        //上方区域右边取消加载
        closeTopRightLoading(state, action) {
            return { ...state, ...action.payload, topRightLoading : false };
        },
        //查看排课信息modal加载状态
        showCheckCourseModalLoading(state, action) {
            return { ...state, ...action.payload, cerpOverviewCheckCourseModalLoading : true };
        },
        //查看排课信息modal取消加载状态
        closeCheckCourseModalLoading(state, action) {
            return { ...state, ...action.payload, cerpOverviewCheckCourseModalLoading : false };
        },
    },
};
