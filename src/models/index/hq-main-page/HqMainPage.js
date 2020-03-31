import {
    sellerJobDataSe,
    sellerJobDataYe,
    sellerPerDataSe,
    sellerPerDataYe,
    periodIndexSe,
    periodIndexYe,
    purMoneySortListSe,
    purMoneySortListYe,
    costCourseMoneySortListSe,
    costCourseMoneySortListYe,
    getTmkHome,
}from '../../../services/hq-main-page/HqMainPageService';
import { parse } from 'qs';
import { message } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

/*教学课件*/
export default {

    namespace: 'hqMainPage',

    state: {
        loading    : false,             //加载状态
        selectMonth: '',            /*选中的月份 YYYY-MM*/
        selectType : 'today',     //下拉框选择类型
        selectYear : undefined,     //选择的年份
        startDate : moment().format('YYYY-MM-DD'),
        endDate : moment().format('YYYY-MM-DD'),
        sellerJobList : [],  //销售工作表数据
        sellerPerList : [],  //销售业绩表
        periodIndexList : [], //学员消课表数据
        purMoneySortList : [] ,//合同总金额数据列表
        costCourseMoneySortList : [], //消课总金额
        windowWidth : '',                   //当前浏览器宽度
        windowWidthLevel : '',              //浏览器宽度等级(Lv1 1500+ / Lv2 1058+ / Lv3 666+ / Lv4 0+)

        funnelList: [],         //漏斗数据
        tmkData: {},            //表格数据
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/hq_homepage') {
                    dispatch({
                        type : 'allDateList',
                        payload:{
                            startDate : moment().format('YYYY-MM-DD'),
                            endDate : moment().format('YYYY-MM-DD'),
                        }
                    });
                    dispatch({
                        type : 'updateState',
                        payload:{
                            startDate : moment().format('YYYY-MM-DD'),
                            endDate : moment().format('YYYY-MM-DD'),
                        }
                    });
                }
            });
        },
    },

    effects: {
        /*获取浏览器内容器宽度*/
        *'WindowBeginSize'({ payload },{ put , select , call }){
            if(document.getElementById("wyp_home_card") != null){
                let width = document.getElementById("wyp_home_card").offsetWidth;
                if(parseInt(width) > 1500){
                    yield put({
                        type:'updateState',
                        payload:{
                            windowWidthLevel : 'Lv1',
                            windowWidth : parseInt(width),      //当前浏览器宽度
                        }
                    });
                }else if(parseInt(width) > 1200){
                    yield put({
                        type:'updateState',
                        payload:{
                            windowWidthLevel : 'Lv2',
                            windowWidth : parseInt(width),      //当前浏览器宽度
                        }
                    });
                }else if(parseInt(width) > 900){
                    yield put({
                        type:'updateState',
                        payload:{
                            windowWidthLevel : 'Lv3',
                            windowWidth : parseInt(width),      //当前浏览器宽度
                        }
                    });
                }else{
                    yield put({
                        type:'updateState',
                        payload:{
                            windowWidthLevel : 'Lv3',
                            windowWidth : parseInt(width),      //当前浏览器宽度
                        }
                    });
                }
            }
        },
        //所有按开始日期、结束日期的接口
        *allDateList ({ payload },{ call , put, select }){

            yield put({
                type : 'sellerJobDataSe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type : 'sellerPerDataSe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type : 'periodIndexSe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type : 'purMoneySortListSe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type : 'costCourseMoneySortListSe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type: 'getTmkHomeRange',
                payload: {
                    ...payload
                }
            })
            yield put({
                type:'WindowBeginSize'
            });
        },
        //所有按年份的接口
        *allYearDateList ({ payload },{ call , put, select }){
            yield put({
                type : 'sellerJobDataYe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type : 'sellerPerDataYe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type : 'periodIndexYe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type : 'purMoneySortListYe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type : 'costCourseMoneySortListYe',
                payload : {
                    ...payload
                }
            })
            yield put({
                type: 'getTmkHomeRange',
                payload: {
                    ...payload
                }
            })
        },
        //首页-销售工作表数据概览 开始日期-结束日期
        *sellerJobDataSe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( sellerJobDataSe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						sellerJobList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
        //首页-销售工作表数据概览 年月查询
        *sellerJobDataYe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( sellerJobDataYe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						sellerJobList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
        //首页-销售业绩表数据概览 开始日期-结束日期
        *sellerPerDataSe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( sellerPerDataSe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						sellerPerList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
        //首页-销售业绩表数据概览 年月查询
        *sellerPerDataYe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( sellerPerDataYe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						sellerPerList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
        //首页-学员消课表数据概览 开始日期-结束日期
        *periodIndexSe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( periodIndexSe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						periodIndexList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
        //首页-学员消课表数据概览 年月查询
        *periodIndexYe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( periodIndexYe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						periodIndexList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
        //校区排行-总合同金额排名列表(开始日期--结束日期)
        *purMoneySortListSe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( purMoneySortListSe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						purMoneySortList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
        //校区排行-总合同金额排名列表(年月查询)
        *purMoneySortListYe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( purMoneySortListYe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						purMoneySortList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
        //校区排行-消课总金额排名列表(开始日期--结束日期)
        *costCourseMoneySortListSe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( costCourseMoneySortListSe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						costCourseMoneySortList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
        //校区排行-消课总金额排名列表(年月查询)
        *costCourseMoneySortListYe({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true }});
			let hqMainPage = yield select( state => state.hqMainPage );
			let { ret } = yield call( costCourseMoneySortListYe, parse(payload) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						costCourseMoneySortList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
		},
         /*点击区块跳转到相应路由*/
        *'JumpToOtherRouter'({ payload }, { call, put, select }){
            let hqMainPage = yield select( state => state.hqMainPage );
            let endDate = hqMainPage.endDate;
            let startDate = hqMainPage.startDate;
            let exportSearchContent = {};             //搜索栏搜索条件
            exportSearchContent.endDate = endDate;
            exportSearchContent.startDate = startDate;

            yield put(routerRedux.push({  //跳到销售工作报表、销售业绩表、学员消课表
                pathname: payload.routerPath,
                query:{
                    jump : true,
                    ...exportSearchContent ,
                }
            }));

        },

        /** tmk数据 */
        *getTmkHomeRange({ payload }, { call, put, select }){
            yield put({ type : 'updateState', payload : { loading : true }});
			let { ret } = yield call( getTmkHome, parse(payload) );
			if( ret && ret.errorCode === 0 ){
                let dataCount = ret.dataCount || {}
                let funnelList = [
                    { name: '新增名单', key: 'newCount', num: dataCount.newCount },
                    { name: '已跟进数', key: 'followCount', num: dataCount.followCount },
                    { name: '预约到访', key: 'bookArriveCount', num: dataCount.bookArriveCount },
                    { name: '实际到访', key: 'arriveCount', num: dataCount.arriveCount },
                    { name: '签约客户', key: 'signingCount', num: dataCount.signingCount }
                ]

				yield put({
					type : 'updateState',
					payload : {
                        tmkData: ret.dataInfo,
                        funnelList
					}
				})
			}else{
				message.error( ret && ret.errorMessage || 'tmk数据查询失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }});
        },
    },


    reducers: {

        updateState(state, action) {
            return { ...state, ...action.payload, };
        },

    },
};
