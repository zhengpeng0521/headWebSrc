import {
    GetBanner,          /*获取banner图*/
    GetReportData,      /*获取统计报表数据*/
    GetHotMethod,       /*热门招生方案*/
    GetFreeTrailMethod, /*免费申请试用招生方案*/
    GetOrgUseing,       /*机构使用案例*/
    GetScrmMessage,     /*获取营销咨询*/
} from '../../../../services/scrm/scrm-overview/ScrmOverView';
import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {

	namespace : 'scrmOverView',

	state : {

        /*banner图*/
        bannerImg: [],                      //banner图数组

        /*统计图*/
        rechartsLoading : false,            //图表加载状态
        getStuCount : '',                   //招生总条目数
        defeatPercent : '',                 //击败机构百分比数
        selectOrgId : '',                   //选择校区id
        selectDay : 0,                      //选择日期
        reportData : [],                    //统计数据

        /*热门招生方案*/
        hotMethod : [],                     //热门招生方案数组
        windowWidth : '',                   //当前浏览器宽度
        windowWidthLevel : '',              //浏览器宽度等级(Lv1 1500+ / Lv2 1058+ / Lv3 666+ / Lv4 0+)

        /*免费申请试用招生方案模态框属性*/
        freeTrailModalVisible : false,      //免费申请试用招生方案modal是否显示
        hotMethodMessage : '',              //热门招生申请成功或者失败后信息提示

        /*机构使用案例*/
        orgSucPageSize : 4,                 //机构使用案例每页条数
        orgSucPageIndex : 0,                //机构使用案例页码
        orgSucCase : [],                    //机构使用案例数组
        wetherSucCaseExist : true,          //机构案例是否有剩余未加载(true(有剩余)/false(加载完毕))

        /*营销资讯*/
        scrmMessagePageSize : 5,            //营销咨询每页条数
        scrmMessagePageIndex : 0,           //营销资讯页码
        scrmMessage : [],                   //营销咨询数据
        scrmMessageHoverIndex : undefined,  //营销咨询鼠标悬浮数据索引
        wetherScrmMessageExist : true,      //营销咨询是否有剩余未加载(true(有剩余)/false(加载完毕))
	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {
                if(pathname == '/scrm_homepage') {
                    /*获取banner图*/
                    dispatch({
                        type : 'GetBanner',
                    });
                    /*获取统计报表数据*/
                    dispatch({
                        type:'GetReport',
                    });
                    /*热门招生方案*/
                    dispatch({
                        type : 'GetHotMethod',
                    });
                    /*机构使用案例*/
                    dispatch({
                        type : 'GetOrgUseing',
                        payload:{
                            pageSize : 4,
                            pageIndex : 0,
                        }
                    });
                    /*获取营销咨询*/
                    dispatch({
                        type : 'GetScrmMessage',
                        payload:{
                            pageSize : 5,
                            pageIndex : 0,
                        }
                    });
                    dispatch({
                        type:'updateState',
                        payload:{
                            orgSucCase : [],
                            scrmMessage : [],
                            orgSucPageIndex : 0,
                            scrmMessagePageIndex : 0,
                        }
                    });
                }
            });
        },
    },

	effects : {
        /*获取banner*/
        *'GetBanner'({ payload },{ put , select , call }){
            const { ret } = yield call(GetBanner,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        bannerImg : ret.results
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*进入页面时获取统计报表数据*/
        *'GetReport'({ payload },{ put , select , call }){
            yield put({ type : 'showChartLoading' });
            /*取到第一个校区(默认校区)ID*/
            let orgId;
            if(window._init_data.firstOrg != undefined){
                orgId = (window._init_data.firstOrg).key;               //获取选择校区下的第一间校区
                yield put({
                    type:'updateState',
                    payload:{
                        selectOrgId : orgId
                    }
                });
            }
            let selectDay = 0;
            let params = { orgId , selectDay };
            const { ret } = yield call(GetReportData,parse(params));
            if(ret && ret.errorCode === 9000){
                if((ret.results).length>0){
                    let results = [];
                    if((ret.results).length > 0){
                        for(let i in ret.results){
                            if(((ret.results)[i].modelName).length>5){
                                results.push({
                                    name : (ret.results)[i].modelName,
                                    modelName : ((ret.results)[i].modelName).substring(0,5)+'...',
                                    modelNum : (ret.results)[i].modelNum,
                                });
                            }else{
                                results.push({
                                    name : (ret.results)[i].modelName,
                                    modelName : ((ret.results)[i].modelName),
                                    modelNum : (ret.results)[i].modelNum,
                                });
                            }
                        }
                    }
                    yield put({
                        type:'updateState',
                        payload:{
                            reportData : results,
                            getStuCount : ret.totalNum,         //招生总条目数
                            defeatPercent : ret.defeat,         //击败机构百分比数
                        }
                    });
                }
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({ type : 'closeChartLoading' });
        },

        /*统计报表选择时间*/
        *'SelectDay'({ payload },{ put , select , call }){
            yield put({ type : 'showChartLoading' });
            const { ret } = yield call(GetReportData,parse(payload));
            if(ret && ret.errorCode === 9000){
                if((ret.results).length>0){
                    let results = [];
                    if((ret.results).length > 0){
                        for(let i in ret.results){
                            if(((ret.results)[i].modelName).length>5){
                                results.push({
                                    name : (ret.results)[i].modelName,
                                    modelName : ((ret.results)[i].modelName).substring(0,5)+'...',
                                    modelNum : (ret.results)[i].modelNum,
                                });
                            }else{
                                results.push({
                                    name : (ret.results)[i].modelName,
                                    modelName : ((ret.results)[i].modelName),
                                    modelNum : (ret.results)[i].modelNum,
                                });
                            }
                        }
                    }
                    yield put({
                        type:'updateState',
                        payload:{
                            reportData : results,
                            getStuCount : ret.totalNum,         //招生总条目数
                            defeatPercent : ret.defeat,         //击败机构百分比数
                        }
                    });
                }
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({ type : 'closeChartLoading' });
        },

        /*统计报表选择校区*/
        *'SelectOrg'({ payload },{ put , select , call }){
            yield put({ type : 'showChartLoading' });
            const { ret } = yield call(GetReportData,parse(payload));
            if(ret && ret.errorCode === 9000){
                if((ret.results).length>0){
                    let results = [];
                    if((ret.results).length > 0){
                        for(let i in ret.results){
                            if(((ret.results)[i].modelName).length>5){
                                results.push({
                                    name : (ret.results)[i].modelName,
                                    modelName : ((ret.results)[i].modelName).substring(0,5)+'...',
                                    modelNum : (ret.results)[i].modelNum,
                                });
                            }else{
                                results.push({
                                    name : (ret.results)[i].modelName,
                                    modelName : ((ret.results)[i].modelName),
                                    modelNum : (ret.results)[i].modelNum,
                                });
                            }
                        }
                    }
                    yield put({
                        type:'updateState',
                        payload:{
                            reportData : results,
                            getStuCount : ret.totalNum,         //招生总条目数
                            defeatPercent : ret.defeat,         //击败机构百分比数
                        }
                    });
                }
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({ type : 'closeChartLoading' });
        },

        /*获取热门招生方案数据*/
        *'GetHotMethod'({ payload },{ put , select , call }){
            const { ret } = yield call(GetHotMethod,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        hotMethod : ret.results
                    }
                });
                yield put({
                    type:'WindowBeginSize'
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*热门招生加载完后获取浏览器内容器宽度*/
        *'WindowBeginSize'({ payload },{ put , select , call }){
            if(document.getElementById("zj_scrm_overview_pagetwo_modalcontent") != null){
                let width = document.getElementById("zj_scrm_overview").offsetWidth;
                if(parseInt(width) > 1500){
                    yield put({
                        type:'updateState',
                        payload:{
                            windowWidthLevel : 'Lv1',
                            windowWidth : parseInt(width),      //当前浏览器宽度
                        }
                    });
                }else if(parseInt(width) > 1058){
                    yield put({
                        type:'updateState',
                        payload:{
                            windowWidthLevel : 'Lv2',
                            windowWidth : parseInt(width),      //当前浏览器宽度
                        }
                    });
                }else if(parseInt(width) > 666){
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
                            windowWidthLevel : 'Lv4',
                            windowWidth : parseInt(width),      //当前浏览器宽度
                        }
                    });
                }
            }
        },

        /*免费申请试用招生方案*/
        *'GetFreeTrailMethod'({ payload },{ put , select , call }){
            const { ret } = yield call(GetFreeTrailMethod,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        freeTrailModalVisible : true,
                        hotMethodMessage : '系统已记录您的需求，后续将安排顾问与您取得联系！'
                    }
                });
            }else if(ret && ret.errorMessage && ret.errorCode === 5000){
                yield put({
                    type:'updateState',
                    payload:{
                        freeTrailModalVisible : true,
                        hotMethodMessage : ret.errorMessage
                    }
                });
            }else{
                message.error('您的网络状况不佳，请重试')
            }
        },

        /*获取机构使用案例*/
        *'GetOrgUseing'({ payload },{ put , select , call }){
            const { ret } = yield call(GetOrgUseing,parse(payload));
            let scrmOverView = yield select(state => state.scrmOverView);

            let beforeCase = [];

//          beforeCase = scrmOverView.orgSucCase;
            
            if(ret && ret.errorCode === 9000){
                if((ret.results).length > 0){
                    for(let i in ret.results){
                        beforeCase.push((ret.results)[i]);
                    }
                }
                if(beforeCase.length == ret.data.resultCount){
                    yield put({
                        type:'updateState',
                        payload:{
                            orgSucCase : beforeCase,
                            wetherSucCaseExist : false,
                        }
                    });
                }else{
                    yield put({
                        type:'updateState',
                        payload:{
                            orgSucCase : beforeCase,
                            wetherSucCaseExist : true,
                        }
                    });
                }
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*获取营销咨询*/
        *'GetScrmMessage'({ payload },{ put , select , call }){
            const { ret } = yield call(GetScrmMessage,parse(payload));
            let scrmOverView = yield select(state => state.scrmOverView);
//          let beforeMessage = scrmOverView.scrmMessage;
            let beforeMessage = [];
            if(ret && ret.errorCode === 9000){
                if((ret.results).length > 0){
                    for(let i in ret.results){
                        beforeMessage.push((ret.results)[i]);
                    }
                }
                if(beforeMessage.length == ret.data.resultCount){
                    yield put({
                        type:'updateState',
                        payload:{
                            scrmMessage : beforeMessage,
                            wetherScrmMessageExist : false,         //加载完毕
                        }
                    });
                }else{
                    yield put({
                        type:'updateState',
                        payload:{
                            scrmMessage : beforeMessage,
                            wetherScrmMessageExist : true,          //还有剩余
                        }
                    });
                }
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },
    },

	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		},
        showChartLoading( state, action ){
            return { ...state, ...action.payload, rechartsLoading: true };
        },
        closeChartLoading( state, action ){
            return { ...state, ...action.payload, rechartsLoading: false };
        },
	}
}
