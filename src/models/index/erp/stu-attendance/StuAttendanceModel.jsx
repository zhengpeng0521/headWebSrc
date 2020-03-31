import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import {
    getCheckQuery,
    getDate,
    getsignQuery,
    getbatchStuSign,
    OpenPrintSmallTicketModal       //打开补打小票modal并获取相关信息
} from '../../../../services/erp/stu-attendanceservice/stuattendanceService';
import {
    GetTeacher,                 //获取主教和助教信息
    CerpOverviewSignModalSubmit //首页签到点击签到
} from '../../../../services/cerp/overview/Overview';
import { lodopPrintAttendance } from '../../../../utils/lodopPrintUtils';

//学员签到记录
export default {

    namespace: 'StuAttendanceModel',

    state: {

        zj_type : undefined,        //菜单类型('all'全部考勤/'my'我的考勤)

        dataSource: [],
        orgId: '',
        loading: false,
        pageIndex:0,
        pageSize:20,
        total:undefined,
        studyDate: '',
        todayDate: '',
        tomButtonLoading : false,   //下一天按钮加载状态
        yesButtonLoading : false,   //上一天按钮加载状态

        //考勤  考勤明细
        Schedulevisible: false,
        Scheduleloading: false,
        editing: '0', //是否为考勤 且是否可以编辑

        cpdId: '', //排课编号
        ScheduleorgId: '', //排课编号
        ptArr: [],//主教老师
        atArr: [],//助教老师
        className: "",
        courseName: "",
        clsSignTime: "",

        normalStuArr: [],
        remedialStuArr: [],
        costConfArr: [], //消耗课时


        employeeComList: [],
        stuSignErrorMessage: ['签到出错啦'],
        WetherPrintTicket: false,          //是否打印小票
        cost: 0,

        teacherDetail : [],                             //主教和助教信息
        /*考勤modal 组件引用自cerp中的签到modal*/
        wetherToday : false,                            //是否是今天(今天可以考勤和编辑明细，非今日只能编辑明细，cerp首页签到固定式今日，主要是考勤页面需要此参数来判断)
        selfOrgId : undefined,                          //当前校区的orgId
        cerpOverviewSignModalVisible : false,           //考勤modal是否显示
        cerpOverviewSignModalLoading : false,           //考勤modal加载状态
        cerpOverviewSignModalButtonLoading : false,     //考勤modal按钮加载状态
        cerpOverviewSignSingleDetail : [],              //点击每一项之后获取的详情信息

        /*补打小票modal*/
        printSmallTicketVisible : false,                //补打小票modal是否显示
        printSmallTicketLoading : false,                //补打小票modal加载状态
        printSmallTicketButtonLoading : false,          //按钮加载状态
        printSmallTicketData : {},                      //打印小票获取到的数据
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname, query}) => {
                //全部考勤/我的考勤
                if(pathname === '/cerp_jw_check' || pathname === '/cerp_jw_mycheck'){
                    /*取到第一个校区(默认校区)ID*/
                    if(window._init_data && window._init_data.cerp_orgId != undefined){
                        dispatch({
                            type: 'updateState',
                            payload: {
                                orgId : window._init_data.cerp_orgId,
                                selfOrgId : window._init_data.cerp_orgId,
                            }
                        });
                        //获取主教和助教信息(填充签到记录下拉列表)
                        dispatch({
                            type:'GetTeacher',
                            payload:{
                                orgId : window._init_data.cerp_orgId,
                            }
                        });
                    }else{
                        message.error('获取校区当前信息失败，将无法考勤');
                        dispatch({
                            type: 'updateState',
                            payload: {
                                orgId : undefined,
                                selfOrgId : undefined,
                            }
                        });
                    }
                    //更新菜单类型，之后请求当前时间，请求列表数据
                    dispatch({
                        type : 'updateMenuType',
                        payload : {
                            zj_type : pathname === '/cerp_jw_check' ? 'all' : pathname === '/cerp_jw_mycheck' ? 'my' : undefined
                        }
                    })

                    //初始化lodop打印配置
                    dispatch({
                        type:'initLodopConfig'
                    })
                }
            });
        },
    },

    effects: {

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
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '考勤失败');
            }
            yield put({ type:'closeSignModalLoading' });
        },

        //更新当前菜单类型(之后获取日期，请求列表数据)
        *'updateMenuType'({payload}, {put, call, select}){
            yield put({ type : 'updateState' , payload : { zj_type : payload.zj_type } });
            yield put({
                type : 'getdateState'
            })
        },

        //获取当前日期
        *'getdateState'({payload}, {put, call, select}){
            let { ret } = yield call(getDate, parse(payload));
            let StuAttendanceModel = yield select(state => state.StuAttendanceModel);
            let orgId = StuAttendanceModel.orgId;
            if(!orgId){
               return message.error('当前校区信息获取失败，请重新选择');
            }
            if (ret && ret.errorCode == '9000') {
                yield put({
                    type: 'updateState',
                    payload: {
                        studyDate: ret.date,
                        todayDate: ret.date,
                    }
                });
                yield put({
                    type: 'queryList',
                    payload: {
                        orgId,
                        studyDate: ret.date,
                        pageIndex:0,
                        pageSize:20,
                        zj_type : StuAttendanceModel.zj_type
                    }
                });
            }else{
                yield put({
                    type: 'updateState',
                    payload: {
                        studyDate: moment().format('YYYY-MM-DD'),
                        todayDate: moment().format('YYYY-MM-DD')
                    }
                });
                yield put({
                    type: 'queryList',
                    payload: {
                        orgId,
                        studyDate: moment().format('YYYY-MM-DD'),
                        pageIndex:0,
                        pageSize:20,
                        zj_type : StuAttendanceModel.zj_type
                    }
                });
            }
        },

        *'queryList'({ payload },{ put , call , select }){
            if(payload && payload.button == 'yes'){
                yield put({ type: 'showYesButtonLoading' });
            }else if(payload && payload.button == 'tom'){
                yield put({ type: 'showTomButtonLoading' });
            }
            yield put({ type : 'showLoading' });
            let { ret } = yield call(getCheckQuery, parse(payload));
            if (ret && ret.errorCode == 9000) {
                yield put({
                    type: 'updateState',
                    payload: {
                        dataSource : ret.results,
                        pageIndex : ret.data.pageIndex,
                        pageSize : ret.data.pageSize,
                        total : ret.data.resultCount,
                        studyDate : payload.studyDate
                    }
                });
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage) || message.error('列表查询失败');
            }
            yield put({type: 'closeYesButtonLoading'})
            yield put({type: 'closeTomButtonLoading'})
            yield put({ type : 'closeLoading' });
        },

        //打开补打小票modal并获取相关信息
        *'OpenPrintSmallTicketModal'({ payload },{ put , call , select }){
            yield put({ type : 'showPrintSmallTicketModalLoading' });
            yield put({ type : 'updateState' , payload : { printSmallTicketVisible : true } });
            let { ret } = yield call(OpenPrintSmallTicketModal, parse(payload));
            if (ret && ret.errorCode == 9000) {
                yield put({
                    type: 'updateState',
                    payload: {
                        printSmallTicketData : ret
                    }
                });
            }else{
                yield put({ type : 'updateState' , payload : { printSmallTicketVisible : false } });
                ret && ret.errorMessage && message.error(ret.errorMessage) || message.error('获取小票信息失败');
            }
            yield put({ type : 'closePrintSmallTicketModalLoading' });
        },

        //  *getdetailQuery
        *getdetailQuery({payload}, {put, call, select}){
            payload = payload || {};
            let { ret } = yield call(getsignQuery, parse(payload));
            if (ret && ret.errorCode == 9000) {
                //防止登录失效
                window.wActivityTimer = setInterval(function(){
					serviceRequest(
						BASE_URL + '/organController/getTenant', {}
					)
				}, 600000 )
                let  costConfArr = ret.costConf.split(',');
                    ret.stuList && ret.stuList.map(function (item) {
                    if (item.status == 2){
                        item.stuSignType = item.sign_type;
                        if (item.sign_type == 3) {
                            if (costConfArr[0] == 1) {
                                item.period = ret.cost;
                            } else {
                                item.period = 0;
                            }
                        }else if (item.sign_type == 4) {
                            if (costConfArr[1] == 1) {
                                item.period = ret.cost;
                            } else {
                                item.period = 0;
                            }
                        }else if (item.sign_type == 5) {
                            if (costConfArr[2] == 1) {
                                item.period = ret.cost;
                            } else {
                                item.period = 0;
                            }
                        }
                    }
                });
                ret.tryStuList && ret.tryStuList.map(function (item) {
                    if (item.status == 2){
                        item.stuSignType = item.sign_type;
                    }
                });
                let ptArrId = !!ret.mtids ? ret.mtids.split(',') : [];
                let ptArrName = !!ret.mtnames ? ret.mtnames.split(',') : [];
                let ptArr = [];
                if(ptArrId && ptArrId.length > 0){
                    for(let i in ptArrId){
                        ptArr.push({
                            mtids : ptArrId[i] + '',
                            mtNames : ptArrName[i] + ''
                        })
                    }
                }
                let atArrId = !!ret.atids ? ret.atids.split(',') : [];
                let atArrName = !!ret.atnames ? ret.atnames.split(',') : [];
                let atArr = [];
                if(atArrId && atArrId.length > 0){
                    for(let i in atArrId){
                        atArr.push({
                            atids : atArrId[i] + '',
                            atNames : atArrName[i] + ''
                        })
                    }
                }
                yield put({
                    type: 'updateState',
                    payload: {
                        Schedulevisible: true,
                        cpdId: ret.cpdId, //排课编号
                        ScheduleorgId: ret.orgId,
                        ptArr,      //主教
                        atArr,      //助教老师
                        className: ret.roomName,
                        courseName: ret.courseName,
                        clsSignTime: ret.startTime + '-' + ret.endTime,
                        normalStuArr: ret.stuList,
                        remedialStuArr: ret.tryStuList,
                        // stuSignErrorMessage:"",
                        employeeComList: [],
                        costConfArr: ret.costConf.split(','),
                        cost: ret.cost,

                        cerpOverviewSignModalVisible : true,
                        cerpOverviewSignSingleDetail : ret
                    }
                });
            } else {
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }
        },


        *saveSign({payload}, {put, call, select}){
            let params = payload.params;
            let StuAttendanceModel = yield select(state => state.StuAttendanceModel);
            let {normalStuArr, remedialStuArr} = StuAttendanceModel;
            let newParams = {};
            newParams.orgId = params.orgId;

            // let signType_class = '3';//签到类型-上课
            // let signType_leave = '4';//签到类型-请假
            // let signType_cut = '5';//签到类型-旷课
            let signArr = [];
            //解析班课学员的签到信息
            normalStuArr && normalStuArr.length > 0 && normalStuArr.map(function (normalStuItem) {
                let status = normalStuItem.status;
                if (status == '1' && !!normalStuItem.stuSignType) {
                    signArr.push({
                        cpStuId: normalStuItem.id,
                        signType: normalStuItem.stuSignType,
                    });
                }
            });
            newParams.signStuList = JSON.stringify(signArr);
            let NewArr = [];
            //
            //解析试听学员的签到信息
            remedialStuArr && remedialStuArr.length > 0 && remedialStuArr.map(function (stuItem) {
                let stuSignType = stuItem.stuSignType;
                let status = stuItem.status;
                if (status == '1' && !!stuSignType) {
                    NewArr.push({
                        id: stuItem.audition_id,
                        status: stuSignType,
                    });
                }
            });
            newParams.tryList = JSON.stringify(NewArr);
            let {ret} = yield call(getbatchStuSign, parse(newParams));
            if (ret && ret.errorCode == 9000) {
                message.success((ret && ret.errorMessage) || '成功')
                yield put({
                    type: 'updateState',
                    payload : {
                        Schedulevisible:false,
                        cpdId:'', //排课编号
                        ScheduleorgId:'',
                        ptArr:[],
                        atArr:[],//助教老师
                        className:'',
                        courseName:'',
                        clsSignTime:'',
                        normalStuArr:[],
                        tryStuList:[],
                        // stuSignErrorMessage:"",
                        employeeComList:[],

                    }
                });


            }else  {
                 message.error( (ret && ret.errorMessage) || '连接服务器超时,请稍后重试');
            }

        },


    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        showLoading(state, action){
            return { ...state, loading : true };
        },
        closeLoading(state, action){
            return { ...state, loading : false };
        },
        //签到modal按钮加载
        showSignModalLoading(state, action) {
            return { ...state, cerpOverviewSignModalButtonLoading : true , cerpOverviewSignModalLoading : true };
        },
        //签到modal按钮取消加载
        closeSignModalLoading(state, action) {
            return { ...state, cerpOverviewSignModalButtonLoading : false , cerpOverviewSignModalLoading : false };
        },
        showPrintSmallTicketModalLoading(state, action){
            return { ...state, printSmallTicketLoading : true };
        },
        closePrintSmallTicketModalLoading(state, action){
            return { ...state, printSmallTicketLoading : false };
        },
        showYesButtonLoading(state, action){
            return { ...state, yesButtonLoading : true };
        },
        closeYesButtonLoading(state, action){
            return { ...state, yesButtonLoading : false };
        },
        showTomButtonLoading(state, action){
            return { ...state, tomButtonLoading : true };
        },
        closeTomButtonLoading(state, action){
            return { ...state, tomButtonLoading : false };
        },
        changeSignType(state, action) {
            let {check, type, signType, stuId,} = action.payload;
            let {normalStuArr, remedialStuArr, costConfArr, cost} = state;
            //let clsSignCostTplArr = clsSignCostTpl.split(',');
            let stuArr;


            if (type == '2') {
                stuArr = normalStuArr;
                // let NewstuArr =[];
                let signType_class = '3';//签到类型-上课
                let signType_leave = '4';//签到类型-请假
                let signType_cut = '5';//签到类型-旷课

                stuArr && stuArr.length > 0 && stuArr.map(function (item) {
                    if (stuId == item.id) {
                        item.stuSignType = check ? signType : '';
                        if (check) {
                            if (signType == signType_class) {

                                if (costConfArr[0] == 1) {
                                    item.period = cost;
                                } else {
                                    item.period = 0;
                                }

                            } else if (signType == signType_leave) {
                                if (costConfArr[1] == 1) {
                                    item.period = cost;
                                } else {
                                    item.period = 0;
                                }
                            } else if (signType == signType_cut) {
                                if (costConfArr[2] == 1) {
                                    item.period = cost;
                                } else {
                                    item.period = 0;
                                }
                            }


                        } else {
                            item.period = 0;

                        }
                    }
                });

            } else if (type == '1') {
                stuArr = remedialStuArr;


                stuArr && stuArr.length > 0 && stuArr.map(function (item) {
                    if (stuId == item.id) {
                        item.stuSignType = check ? signType : '';

                            item.period = 0;

                        }

                });
            }

            return {...state, normalStuArr, remedialStuArr};
        },
    }

}

