import {
    GetNowDateAndTime,          //获取当前日期
    GetCourseList,              //获取排课列表数据
    OperationChangeStatus,      //操作栏点击更改状态操作(这里只有删除)
    GetMainArrangeCourseMessage,//点击编辑主排课信息查询
    GetTeacher,                 //获取主教和助教信息
    GetClassRoom,               //获取教室信息
    CourseEditModalSubmit       //主排课编辑modal提交
} from '../../../../services/cerp/new-arrange-course/NewArrangeCourse';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { FormatDate } from '../../../../utils/dateFormat';

/*English*/
export default {

    namespace: 'newArrangeCourse',

    state: {
        nowDate : '',                           //当前日期(只做保存，不做修改)
        startDate : '',                         //操作改变开始时间
        endDate : '',                           //操作改变结束时间

        /*快捷搜索*/
        fastSearchContent : {},                 //快捷搜索内容

        /*高级搜索*/
        superSearchVisible : false,             //是否显示高级搜索
        superSearchContent : {},                //高级搜索内容

        //operationBar
        radioGroupValue : 'day',                //radiogroup的值

        //table
        tableLoading : false,                   //整个页面是否加载状态
        tableNewColumns : [],                   //列表控制显示行数组
        tableDataSource : [],                   //从接口获取的列表数据
        tableDataTotal : 0,                     //列表数据条数
        tablePageIndex : 0,                     //列表页码
        tablePageSize : 20,                     //列表每页条数
        tableSelectedRowKeys : [],              //复选框选中对象的key数组
        tableSelectedRows : [],                 //复选框选中对象的数组
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/hq_orgdata_courseplan'){
                    //获取系统时间
                    dispatch({
                        type:'GetNowDateAndTime',
						payload : {
							pageSize : 20
						}
                    });
                }
            });
        },
    },

    effects: {
        //获取当前日期
        *'GetNowDateAndTime'({ payload },{ call, put, select }){
            //返回radiogroup初始值
            yield put({ type:'resetRadioGroup' });
            let nowDate = window.GetNowDateAndTimeCommon().date;
            yield put({
                type:'updateState',
                payload:{
                    nowDate
                }
            });
            //默认是按天查询
            let newArrangeCourse = yield select(state => state.newArrangeCourse);
            let pageIndex = newArrangeCourse.tablePageIndex;
            let pageSize = payload.pageSize || newArrangeCourse.tablePageSize;
            yield put({
                type:'GetCourseList',
                payload:{
                    startDate : nowDate,
                    endDate : nowDate,
                    pageIndex,
                    pageSize,
                    radioGroupValue : 'day'
                }
            });
        },

        //获取排课列表数据
        *'GetCourseList'({ payload },{ call, put, select }){
            yield put({ type:'showLoading' });
            let fastSearchContent = !!payload && payload.fastSearchContent ? payload.fastSearchContent : {};
            let superSearchContent = !!payload && payload.superSearchContent ? payload.superSearchContent : {};
            let radioGroupValue = !!payload && payload.radioGroupValue ? payload.radioGroupValue : 'day';
            delete payload.fastSearchContent;
            delete payload.superSearchContent;
            delete payload.radioGroupValue;
            let params = { ...payload , ...fastSearchContent , ...superSearchContent };
            let resInit = yield call(GetCourseList,parse(params));
            if(!!resInit && resInit.ret && resInit.ret.errorCode === 9000){
                let { ret } = resInit;
                if((ret.results).length == 0 && payload.pageIndex > 0){
                    params.pageIndex -= 1;
                    let resAgain = yield call(GetCourseList,parse(params));
                    if(!!resAgain && resAgain.ret && resAgain.ret.errorCode === 9000){
                        let { ret } = resAgain;
                        yield put({
                            type:'updateState',
                            payload:{
                                tableDataSource : ret.results || [],
                                tableDataTotal : ret.data && ret.data.resultCount || 0,
                                tablePageIndex : ret.data && ret.data.pageIndex || 0,
                                tablePageSize : ret.data && ret.data.pageSize || 20,
                                tableSelectedRowKeys : [],
                                tableSelectedRows : [],
                                startDate : params.startDate,              //请求成功之后刷新开始时间
                                endDate : params.endDate,                  //请求成功之后刷新结束时间
                                fastSearchContent,
                                superSearchContent,
                                radioGroupValue,
                            }
                        });
                    }else{
                        message.error(!!resAgain && resAgain.ret && resAgain.ret.errorMessage ? resAgain.ret.errorMessage : '获取排课信息列表失败');
                    }
                }else{
                    yield put({
                        type:'updateState',
                        payload:{
                            tableDataSource : ret.results || [],
                            tableDataTotal : ret.data && ret.data.resultCount || 0,
                            tablePageIndex : ret.data && ret.data.pageIndex || 0,
                            tablePageSize : ret.data && ret.data.pageSize || 20,
                            tableSelectedRowKeys : [],
                            tableSelectedRows : [],
                            startDate : params.startDate,              //请求成功之后刷新开始时间
                            endDate : params.endDate,                  //请求成功之后刷新结束时间
                            fastSearchContent,
                            superSearchContent,
                            radioGroupValue,
                        }
                    });
                }
            }else{
                message.error(!!resInit && resInit.ret && resInit.ret.errorMessage ? resInit.ret.errorMessage : '获取排课信息列表失败');
            }
            yield put({ type:'closeLoading' });
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        //重置radiogroup状态
        resetRadioGroup(state, action){
            return { ...state, radioGroupValue : 'day' };
        },
        //整个页面列表加载状态
        showLoading(state, action) {
            return { ...state, tableLoading : true};
        },
        //整个页面加载状态
        closeLoading(state, action) {
            return { ...state, tableLoading : false};
        },
    },
};
