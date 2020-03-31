import {
	getCourseList,
    getOrganList,
	getBirthdayList,
	getTeacherList,
	getSalesList,
	getCounselorList,
	getCustomerList

} from '../../../../services/report-form/teaching-report/stuUseClassChartService';
import { parse } from 'qs';
import qs from 'qs';
import { message } from 'antd';
import moment from 'moment';
//沉默学员表
export default {

    namespace: 'stuUseClassChartModel',

    state: {
		firstEnter          : true,          //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)

		courseList          : [],                  //按课程统计
        organList           : [],                  //按机构统计
		birthdayList        : [],                  //按学员生日统计
		teacherList         : [],                  //按老师统计
		salesList           : [],                  //按负责销售统计
		counselorList       : [],                  //按负责顾问统计
		customerList        : [],									 //按负责客服统计

		loading             : false,               //报表loading状态
		searchContent       : undefined,

        startTime : moment().format('YYYY-MM-DD'),
        endTime : moment().format('YYYY-MM-DD'),
        dataSelectValue : undefined,    //是否自定义选择时间方式
	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/hq_orgstats_stucost') {
                    dispatch({
                        type : 'updateState',
						payload : {
							courseList          : [],
                            organList           : [],
							birthdayList        : [],
							teacherList         : [],
							salesList           : [],
							counselorList       : [],
							searchContent       : undefined,
						}
                    });
                    if(query.jump == 'true'){  //从首页跳转进来
                        let exportSearchContent = {};
                        exportSearchContent.startDate = query.startDate;
                        exportSearchContent.endDate = query.endDate;
                        dispatch({
                            type : 'updateState',
                            payload : {
                                startTime : query.startDate,
                                endTime   : query.endDate,
                                dataSelectValue : 'free',
                            }
                        })
                        dispatch({
                            type : 'generatingReports',
                            payload : {
                                values      : exportSearchContent,
                                firstEnter  : true
                            }
                        })
                    }else{
                        let nowObj = window.GetNowDateAndTime();
                        dispatch({
                            type : 'updateState',
                            payload : {
                                startTime : nowObj.startDate,
                                endTime : nowObj.endDate,
                                dataSelectValue : undefined,

                            }
                        })
                        dispatch({
                            type : 'generatingReports',
                            payload : {
                                values      : window.GetNowDateAndTime(),
                                firstEnter  : true
                            }
                        })
                    }

                }
            });
        },
    },

    effects: {
		*generatingReports({ payload },{ call, put, select }){
			yield put({	type : 'updateState', payload : { loading : true } });
			let { values } = payload;
			yield put({
				type : 'updateState',
				payload : {
					searchContent : values,
					firstEnter : payload.firstEnter || false
				}
			})
			/*按课程统计数据*/
			let courseList = yield call( getCourseList, ( values ));
			if( courseList && courseList.ret && courseList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						courseList : courseList.ret.results
					}
				})
			}else{
				message.error( courseList && courseList.ret && courseList.ret.errorMessage || '课程统计出错' )
			}
            /*按机构数据*/
			let organList = yield call( getOrganList, ( values ));
			if( organList && organList.ret && organList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						organList : organList.ret.results
					}
				})
			}else{
				message.error( courseList && courseList.ret && courseList.ret.errorMessage || '课程统计出错' )
			}
			/*按老师统计*/
			let teacherList = yield call( getTeacherList, ( values ));
			if( teacherList && teacherList.ret && teacherList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						teacherList : teacherList.ret.results
					}
				})
			}else{
				message.error( teacherList && teacherList.ret && teacherList.ret.errorMessage || '老师统计出错' )
			}
			/*按负责销售统计*/
			let salesList = yield call( getSalesList, ( values ));
			if( salesList && salesList.ret && salesList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						salesList : salesList.ret.results
					}
				})
			}else{
				message.error( salesList && salesList.ret && salesList.ret.errorMessage || '负责销售统计出错' )
			}
			/*按负责顾问统计*/
			let counselorList = yield call( getCounselorList, ( values ));
			if( counselorList && counselorList.ret && counselorList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						counselorList : counselorList.ret.results
					}
				})
			}else{
				message.error( counselorList && counselorList.ret && counselorList.ret.errorMessage || '负责顾问统计出错' )
			}
			/*按负责客服统计*/
			let params = {
				...values
			}
			if(values.orgId || values.orgId === 0){
				params.depId = 0
			}
			let customer = yield call( getCustomerList, ( params ));
			if( customer && customer.ret && customer.ret.errorCode === 0 ){
				let customerList = []
				customer.ret.results && customer.ret.results.forEach((item, index) => {
					if(index < 10){
						customerList.push(item)
					}
				})
				yield put({
					type : 'updateState',
					payload : {
						customerList
					}
				})
			}else{
				message.error( customer && customer.ret && customer.ret.errorMessage || '负责客服统计出错' )
			}
			yield put({ type : 'updateState', payload : { loading : false, firstEnter : false } })
		}
	},


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
    },
};
