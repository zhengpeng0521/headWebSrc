import {
    GetTeacherTeachingTable,            //查询老师搜客列表数据
    OpenTeachingDetail,                 //查询老师授课详情
    UpdateCloudData,                    //更新云数据查询的
    ConfirmDeptOrgSelect,                //模态框确定的接口
    OnconfirmDeptOrgSelect
} from '../../../../services/report-form/teaching-report/teacherTeaching';
import { parse } from 'qs';
import qs from 'qs';
import { message } from 'antd';
import moment from 'moment';

//统计报表 老师授课
export default {

    namespace: 'teacherTeachingSheet',

    state: {
        modalBoxAppears: false,//模态框的出现
        updateshow: true, //那个页面有按钮的
        content: "暂未更新",//鼠标放入更新云时间
        name: '老师授课表',//参数
        startDate: undefined, //传给后端的开始参数
        endDate: undefined,//传给后端的结束参数
        firstEnter : true,                  //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        pageIndex  : 0,                     //页码
        pageSize : 40,                      //默认永远是10
        to:true,   
        sortParams : [{ key : '1' , value : '授课总节数' },{ key : '2' , value : '教学总人次' }],      //排序方式(放在state里方便做统一处理)

        exportSearchContent : {},           //报表导出条件(没有分页信息)

        tableLoading : false,               //table是否在加载状态
        listTopAllContent : [],             //上方table列表所有数据
        listTopAllReqSuc : false,           //上方table列表请求成功
        listBottomTeacherContent : [],      //下方table列表老师所有数据
        listBottomReqSuc : false,           //下方table列表请求成功
        listBottomTeacherCount : 0,         //下方table总数据

        teachingDetailVisible : false,      //授课详情modal展示
        teachingDetailNameHeight : '50px',  //授课详情姓名栏高度(css用)
        teachingDetailName : '',            //授课详情老师姓名
        teachingDetailContent : [],         //授课详情内容
        teachingDetailSpining : false,      //授课详情模态框是否加载状态
        // disabledDateFunc: {
        //     disabledStartDate: function (time) {
        //         const times = moment(time).valueOf()
        //         return   times > new Date().getTime()
        //     },
        //     disabledEndDate: function(time) {
        //         const times = moment(time).valueOf()
        //         return   times > new Date().getTime()
        //       }
        // },
        buttonLoading : false,              //生成报表按钮加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/hq_orgstats_teacher') {
                    //初次进入页面查询当天数据
                    dispatch({
                        type : 'InitialQuery',
                        payload : {
                            firstEnter : true,                  //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
                            pageIndex : 0,
                            pageSize : 40,
                            exportSearchContent : window.GetNowDateAndTime()
                        }
                    });
                    dispatch({
                        type : 'UpdateCloudData',
                        payload : {
                          name:'老师授课表'
                        }
                    });
                }
            });
        },
    },

    effects: {
        //初次进入页面查询当天数据
        *'InitialQuery'({ payload },{ call, put, select }){
            let teacherTeachingSheet = yield select(state => state.teacherTeachingSheet);
            let sortParams = teacherTeachingSheet.sortParams;
            //默认查询下拉查询第一个
            payload.exportSearchContent = { ...payload.exportSearchContent , sortParam : sortParams[0].key }
            yield put({ type : 'GetTeacherTeachingTable', payload });
        },
        /*查询老师搜客列表数据*/
        *'GetTeacherTeachingTable'({ payload } , { call , put , select }){
            yield put({ type : 'showTableLoading' });
            yield put({ type : 'showButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
            let exportSearchContent = payload.exportSearchContent;
            delete payload.firstEnter;
            delete payload.exportSearchContent;
            let params = { ...payload , ...exportSearchContent };
            let res = yield call(GetTeacherTeachingTable,parse(params));
            if( !!res && res.ret && res.ret.errorCode === 9000 ){
                let { ret } = res;
                yield put({
                    type:'updateState',
                    payload:{
                        listTopAllContent : [{
                            all : '总计',
                            tAttend : ret.tAttend || 0,         //授课 上课数量
                            tAudition : ret.tAudition || 0,     //授课 试听数量
                            tMakeup : ret.tMakeup || 0,         //授课 补课数量
                            tTotal : ret.tTotal || 0,
                            sAttend : ret.sAttend || 0,         //教学 上课数量
                            sAudition : ret.sAudition || 0,     //教学 试听数量
                            sMakeup : ret.sMakeup || 0,         //教学 补课数量
                            sTotal : ret.sTotal || 0,
                        }],
                        listBottomTeacherContent : ret.results || [],
                        listBottomTeacherCount : ret.data && ret.data.resultCount || 0,

                        pageIndex : ret.data && ret.data.pageIndex || 0,
                        pageSize : ret.data && ret.data.pageSize || 40,
                        exportSearchContent,
                    }
                });
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '总计数据统计失败');
            }
            yield put({ type : 'closeTableLoading' });
            yield put({ type : 'closeButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : false }});                              //报表头部已初始化，需要将状态重置
        },

        /*打开授课详情*/
        *'OpenTeachingDetail'({ payload } , { call , put , select }){
            yield put({ type:'showDetailSpinning' })
            yield put({
                type:'updateState',
                payload:{
                    teachingDetailVisible : true,
                }
            });
            let res = yield call(OpenTeachingDetail,parse(payload));
            if( !!res && res.ret && res.ret.errorCode === 9000 ){
                let { ret } = res;
                let height;
                if(ret.results && (ret.results).length > 0){
                    height =  ((ret.results).length+1)*50;
                }else{
                    message.warning('该教师无对应授课明细')
                    height = 50;
                    yield put({
                        type:'updateState',
                        payload:{
                            teachingDetailVisible : false
                        }
                    });
                    return;
                }
                yield put({
                    type:'updateState',
                    payload:{
                        teachingDetailNameHeight : height+'px',
                        teachingDetailName : (ret.results)[0].name,
                        teachingDetailContent : ret.results,
                        teachingDetailSpining : false,
                    }
                });
            }else{
                message.error('获取详情失败');
            }
            yield put({ type:'closeDetailSpinning' })
        },
        //点击更新云数据
        *UpdateCloudData({ payload }, { call, put, select }) {
            // yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
            let state = yield select(state => state.teacherTeachingSheet);
            let params = {
                name: state.name
            }
            let { ret } = yield call(UpdateCloudData, params);
            if (ret && ret.errorCode === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        content:'上次更新时间 :'+ret.lastTime, //把请求到的数据赋值给全局变量content，然后传给page
                    }
                })
            }
            if (ret.lastTime == null) {
                yield put({
                    type: 'updateState',
                    payload: {
                        content: "暂未更新" //把请求到的数据赋值给全局变量content，然后传给page
                    }
                })
            }
        },
        //弹框确定更新云数据
        *ConfirmDeptOrgSelect({ payload }, { call, put, select }) {
            // yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
            let state = yield select(state => state.teacherTeachingSheet);
            let {startDate, endDate} = payload.params
            let params = {
                name: state.name,
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            }
            let { ret } = yield call(ConfirmDeptOrgSelect, params);
            if (ret && ret.errorCode === 0) {
                payload.colback()
            }
        },
        *onconfirmDeptOrgSelect({ payload }, { call, put, select }) {
			// yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
            let state = yield select(state => state.teacherTeachingSheet);
			let params = {
				name: state.name,
			}
            let { ret } = yield call(OnconfirmDeptOrgSelect, params);
			if (ret.errorCode == 0) {
				payload.coleback()
			}
			if (ret.errorCode == 1000) {
				payload.shutback()
                message.warning('每天只能更新一次，请明天再试~');
			}
		}
    },


    reducers: {
        updateState(state, action) {
            return {...state , ...action.payload};
        },
        //表格加载中
        showTableLoading(state,action) {
            return { ...state , tableLoading : true };
        },
        //表格加载消失
        closeTableLoading(state,action){
            return { ...state , tableLoading : false };
        },
        //生成报表按钮加载中
        showButtonLoading(state,action) {
            return { ...state , buttonLoading : true };
        },
        //生成报表按钮加载消失
        closeButtonLoading(state,action){
            return { ...state , buttonLoading : false };
        },
        showDetailSpinning(state,action){
            return { ...state , teachingDetailSpining : true };
        },
        closeDetailSpinning(state,action){
            return { ...state , teachingDetailSpining : false };
        },
        updateDate(state, action) {
            // if (action.payload.startDate) {
            //     state.disabledDateFunc.disabledEndDate = function(time) {
            //         const times = moment(time).valueOf()
            //         const startTime = new Date(action.payload.startDate).getTime()
            //         return times - startTime > 7776000000 || times > new Date().getTime()
            //     }
            // } else if (action.payload.endDate) {
            //     console.log('end')
            //     state.disabledDateFunc.disabledStartDate = function(time) {
            //         const times = moment(time).valueOf()
            //         const endTime = new Date(action.payload.endDate).getTime()
            //         return endTime - times > 7776000000 || times > new Date().getTime()
            //     }
            // }
            return { ...state, ...action.payload};
        },
    },
};
