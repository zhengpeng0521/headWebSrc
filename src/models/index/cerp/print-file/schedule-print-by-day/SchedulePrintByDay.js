import {
    GetNowTime,             //获取系统当前时间
    GetCourseInfo,          //获取课程信息
    GetStaffList,           //获取员工信息
    GetClsRoomList,         //获取教室信息
    GetTimeStartAndEnd      //获取课程表时段
} from '../../../../../services/cerp/print-file/schedule-print-by-day/SchedulePrintByDay';
import { parse } from 'qs';
import { message } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

/*按课程打印签到表*/
export default {

    namespace: 'schedulePrintByDay',

    state: {
        nowDate : '',                   //当前日期

        //课程信息
        courseInfo : [],                //课程信息初始数据
        teacherInfo : [],               //格式化老师维度排课信息
        classRoomInfo : [],             //格式化教室维度排课信息
        selectTeaContent : [],          //下拉列表选中内容(老师)
        selectClsContent : [],          //下拉列表选中内容(教室)

        //员工信息
        staffInfo : [],                 //员工下拉列表内容

        //教室信息
        clsRoomInfo : [],               //教室下拉列表内容

        //课程表时间
        startClock : undefined,         //开始时间
        endClock : undefined,           //结束时间
        clockArray : [],                //时间段数组

        startTime : undefined,          //开始时间字符串('无冒号')
        endTime : undefined,            //结束时间字符串('无冒号')
        timeArray : [],                 //时间段数组('无冒号')

        //选择区
        dimension : '1',                //维度(1老师/2教室)
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/schedule_print_by_day'){
                    dispatch({
                        type:'initializationData'
                    })
                    //获取课程表时段
                    dispatch({
                        type:'GetTimeStartAndEnd',
                        payload:{
                            confKey:'CPTIMESET'
                        }
                    });
                    //获取当前时间然后获取课程信息
                    dispatch({
                        type:'GetNowTime',
                    })
                }
            });
        },
    },

    effects: {
        //获取当前时间然后获取课程信息
        *'GetNowTime'({ payload } , { put , call , select }){
            let { ret } = yield call(GetNowTime,parse(payload));
            let nowDate = undefined;
            if(ret && ret.errorCode == '9000'){
                nowDate = ret.date;
            }else{
                nowDate = moment().format('YYYY-MM-DD');
            }
            yield put({
                type:'updateState',
                payload:{
                    nowDate
                }
            })
            //获取课程信息
            yield put({
                type:'GetCourseInfo',
                payload:{
                    startDate : nowDate,
                    endDate : nowDate,
                    orgId : window._init_data.cerp_orgId,
                    pageIndex : 0,
                    pageSize : 99999
                }
            });
            //获取员工信息
            yield put({
                type:'GetStaffList',
                payload:{
                    orgId : window._init_data.cerp_orgId,
                }
            });
            //获取教室信息
            yield put({
                type:'GetClsRoomList',
                payload:{
                    orgId : window._init_data.cerp_orgId,
                }
            })
        },

        //获取课程信息
        *'GetCourseInfo'({ payload } , { put , call , select }){
            let { ret } = yield call(GetCourseInfo,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type:'updateState',
                    payload:{
                        courseInfo : ret.results
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取课程信息失败');
            }
        },

        //获取员工信息
        *'GetStaffList'({ payload } , { put , call , select }){
            let { ret } = yield call(GetStaffList,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type:'updateState',
                    payload:{
                        staffInfo : ret.results
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取员工信息失败');
            }
        },

        //获取教室信息
        *'GetClsRoomList'({ payload } , { put , call , select }){
            let { ret } = yield call(GetClsRoomList,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type:'updateState',
                    payload:{
                        clsRoomInfo : ret.results
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取员工信息失败');
            }
        },

        //获取课程表时段
        *'GetTimeStartAndEnd'({ payload } , { put , call , select }){
            let { ret } = yield call(GetTimeStartAndEnd,parse(payload));
            if(ret && ret.errorCode == '9000'){
                let startTime;
                let endTime;
                let time = ret.list[0].key;
                let index = time.indexOf('-');
                startTime = time.substr(0,index);
                endTime = time.substr(index+1);
                if(startTime < 10){
                    startTime = '0' + startTime;
                }
                if(endTime < 10){
                    endTime = '0' + endTime;
                }
                yield put({
                    type:'updateState',
                    payload:{
                        startTime : startTime + '00',
                        endTime : endTime + '00',
                        startClock : startTime + ':00',
                        endClock : endTime + ':00'
                    }
                });
                 yield put({
                    type:'calcTimeArr',
                    payload:{
                        startTime : startTime + '00',
                        endTime : endTime + '00',
                    }
                });
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取课程表时段失败')
            }
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        initializationData(state, action){
            let obj = {
                teacherInfo : [],               //格式化老师维度排课信息
                classRoomInfo : [],             //格式化教室维度排课信息
                selectTeaContent : [],          //下拉列表选中内容(老师)
                selectClsContent : [],          //下拉列表选中内容(教室)
                dimension : '1',                //维度(1老师/2教室)
            }
            return { ...state, ...obj };
        },
        calcTimeArr(state, action){
            let startTime = action.payload.startTime;
            let endTime = action.payload.endTime;
            let result = (parseFloat(endTime) - parseFloat(startTime))/100*2;       //计算需要添加多少项
            let timeArray = [];                 //时间段数组('无冒号')
            let clockArray = [];                //时间段数组
            timeArray.push(startTime+'');       //添加首项
            clockArray.push(startTime.substr(0,2) + ':' + startTime.substr(2,4));
            for(let i=0;i<result-1;i++){
                if(i%2 == 0){
                    if(parseFloat(startTime) < 1000){
                        startTime = '0' + (parseFloat(startTime) + 30);
                        timeArray.push(startTime + '');
                        clockArray.push((startTime + '').substr(0,2) + ':' + (startTime + '').substr(2,4));
                    }else{
                        startTime = parseFloat(startTime) + 30;
                        timeArray.push(startTime + '');
                        clockArray.push((startTime + '').substr(0,2) + ':' + (startTime + '').substr(2,4));
                    }
                }else{
                    //计算后过10，所以需要在900做判断
                    if(parseFloat(startTime) < 900){
                        startTime = '0' + (parseFloat(startTime) + 70);
                        timeArray.push(startTime + '');
                        clockArray.push((startTime + '').substr(0,2) + ':' + (startTime + '').substr(2,4));
                    }else{
                        startTime = parseFloat(startTime) + 70;
                        timeArray.push(startTime + '');
                        clockArray.push((startTime + '').substr(0,2) + ':' + (startTime + '').substr(2,4));
                    }
                }
            }
            return { ...state, timeArray , clockArray };
        },
    },
};
