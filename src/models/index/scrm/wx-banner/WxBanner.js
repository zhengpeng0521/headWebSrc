import {
    GetBannerList,              /*获取banner列表*/
    GetCourseSelectContent,     /*modal课程外链下拉列表*/
    GetActivitySelectContent,   /*modal活动外链下拉列表*/
    ChangeWxBannerStatus,       /*banner改变状态(显示，隐藏，删除)*/
    CheckOrgBannersNum,         /*刚进入新增表单和表单选择校区onChange事件发生时查看当前校区banner数量有没有到限制数(5个)*/
    AddOrEditBanner,            /*新增编辑banner*/
} from '../../../../services/scrm/wx-banner/WxBanner';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

//学员请假
export default {

    namespace: 'wxBanner',

    state: {
        /*searchBar*/
        wxBannerSearchVisible : false,                  //搜索栏是否显示
        wxBannerSearchContent : {},                     //搜索栏搜素内容

        /*table*/
        wxBannerPageIndex : 0,                          //页码
        wxBannerPageSize : 20,                          //每页条数
        wxBannerTableLoading : false,                   //表格加载状态
        wxBannerTableContent : [],                      //表格数据
        wxBannerTableTotal : undefined,                 //表格数据总数
        wxBannerTableSelectedRowKeys : [],              //表格多选选中的数组
        wxBannerTableSelectedRow : [],                  //表格多选中的对象数组

        /*banner新增编辑modal*/
        wxBannerAddOrEditBannerModalType : undefined,       //modal类型('add'/'edit')
        wxBannerAddOrEditBannerModalVisible : false,        //modal是否显示
        wxBannerAddOrEditBannerModalLoading : false,        //modal是否loading
        wxBannerAddOrEditBannerButtonLoading : false,       //modal按钮是否加载状态
        wxBannerAddOrEditBannerModalWetherAdd : {},         //新增时是否可以在该校区下添加banner
        wxBannerAddOrEditBannerModalLetUChoose : false,     //新增时说明(若未选择校区 则提示用户请选择校区)
        wxBannerAddOrEditBannerModalContent : {},           //modal回填数据(主要用到校区ID和校区name)
        wxBannerAddOrEditBannerModalHrefType : '0',         //选择外链方式类型('0'无,'1'自定义,'2'活动,'3'课程)
        wxBannerAddOrEditBannerCourseSelectContent : [],    //modal课程外链下拉列表
        wxBannerAddOrEditBannerActivitySelectContent : [],  //modal活动外链下拉列表
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/scrm_woffice_banner') {
                    /*获取banner列表*/
                    dispatch({
                        type:'GetBannerList',
                        payload:{
                            pageIndex : 0,
                            pageSize : 20,
                        }
                    });

                    /*modal课程外链下拉列表*/
                    dispatch({
                        type:'GetCourseSelectContent',
                        payload:{
                            pageIndex : 0,
                            pageSize : 99999,
                            status : 1,
                            orgId: window._init_data && window._init_data.firstOrg && window._init_data.firstOrg.key || '',
                        }
                    });
                    /*modal活动外链下拉列表*/
                    dispatch({
                        type:'GetActivitySelectContent',
                        payload:{
                            pageIndex : 0,
                            pageSize : 99999,
                            status : 1,
                            orgId: window._init_data && window._init_data.firstOrg && window._init_data.firstOrg.key || '',
                        }
                    });
                }
            });
        },
    },

    effects: {
        /*modal课程外链下拉列表*/
        *'GetCourseSelectContent'({ payload },{ call, put, select }){
            let { ret } = yield call(GetCourseSelectContent,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        wxBannerAddOrEditBannerCourseSelectContent : ret.results
                    }
                })
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*modal活动外链下拉列表*/
        *'GetActivitySelectContent'({ payload },{ call, put, select }){
            let { ret } = yield call(GetActivitySelectContent,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        wxBannerAddOrEditBannerActivitySelectContent : ret.results
                    }
                })
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*获取banner列表*/
        *'GetBannerList'({ payload },{ call, put, select }){
            yield put({type : 'showTableLoading'});
            let { ret } = yield call(GetBannerList,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                let pageIndex = payload.pageIndex;
                let pageSize = payload.pageSize;
                delete payload.pageIndex;
                delete payload.pageSize;
                yield put({
                    type : 'updateState',
                    payload : {
                        wxBannerSearchContent : payload,
                        wxBannerPageIndex : pageIndex,
                        wxBannerPageSize : pageSize,
                        wxBannerTableContent : ret.results,
                        wxBannerTableTotal : ret.data.resultCount,
                        wxBannerTableSelectedRowKeys : [],              //表格多选选中的数组
                        wxBannerTableSelectedRow : [],                  //表格多选中的对象数组
                    }
                })
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({type : 'closeTableLoading'});
        },

        /*各种操作之后进行列表查询操作*/
        *'AfterOperationShowBannerList'({ payload },{ call, put, select }){
            let wxBanner = yield select(state => state.wxBanner);
            let wxBannerSearchContent = wxBanner.wxBannerSearchContent || {};
            let pageIndex = wxBanner.wxBannerPageIndex;
            let pageSize = wxBanner.wxBannerPageSize;
            let params = { pageIndex,pageSize,...wxBannerSearchContent };
            let { ret } = yield call(GetBannerList,parse(params));
            if(ret && ret.errorCode === 9000){
                if((ret.results).length == 0 && pageIndex > 0){
                    params.pageIndex = pageIndex-1;     //发送前一页数据请求的页码
                    let { ret } = yield call(GetBannerList,parse(params));
                    if(ret && ret.errorCode === 9000){
                        yield put({
                            type:'updateState',
                            payload:{
                                wxBannerTableContent : ret.results,
                                wxBannerTableTotal : (ret.data).resultCount,
                                wxBannerTableSelectedRowKeys : [],        //表格多选选中的数组
                                wxBannerTableSelectedRow : [],            //表格多选中的对象数组
                                wxBannerPageIndex : params.pageIndex,
                                wxBannerAddOrEditBannerModalVisible : false,        //modal是否显示
                                wxBannerAddOrEditBannerButtonLoading : false,       //modal按钮是否加载状态
                            }
                        })
                    }else if(ret && ret.errorMessage){
                        message.error(ret.errorMessage);
                    }else{
                        message.error('您的网络状况不佳，请检查网络情况');
                    }
                }else{
                    yield put({
                        type:'updateState',
                        payload:{
                            wxBannerTableContent : ret.results,
                            wxBannerTableTotal : (ret.data).resultCount,
                            wxBannerTableSelectedRowKeys : [],        //表格多选选中的数组
                            wxBannerTableSelectedRow : [],
                            wxBannerPageIndex : params.pageIndex,
                            wxBannerAddOrEditBannerModalVisible : false,        //modal是否显示
                            wxBannerAddOrEditBannerButtonLoading : false,       //modal按钮是否加载状态
                        }
                    })
                }
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*banner改变状态(显示，隐藏，删除)*/
        *'ChangeWxBannerStatus'({ payload },{ call, put, select }){
            yield put({type : 'showTableLoading'});
            let { ret } = yield call(ChangeWxBannerStatus,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationShowBannerList',
                })
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({type : 'closeTableLoading'});
        },

        /*刚进入新增表单和表单选择校区onChange事件发生时查看当前校区banner数量有没有到限制数(5个)*/
        *'CheckOrgBannersNum'({ payload },{ call, put, select }){
            yield put({type : 'showModalLoading'});
            let { ret } = yield call(CheckOrgBannersNum,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type: 'updateState',
                    payload: {
                        wxBannerAddOrEditBannerModalType : 'add',
                        wxBannerAddOrEditBannerModalVisible : true,
                        wxBannerAddOrEditBannerButtonLoading : false,
                        wxBannerAddOrEditBannerModalContent : {},
                        wxBannerAddOrEditBannerModalHrefType : '0',
                        wxBannerAddOrEditBannerModalWetherAdd : ret.results,        //新增时是否可以在该校区下添加banner
                        wxBannerAddOrEditBannerModalLetUChoose : false
                    },
                })
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({type : 'closeModalLoading'});
        },

        /*新增编辑banner*/
        *'AddOrEditBanner'({ payload },{ call, put, select }){
            yield put({type : 'showTableLoading'});
            yield put({type : 'showModalButtonLoading'});
            let { ret } = yield call(AddOrEditBanner,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationShowBannerList',
                })
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({type : 'closeTableLoading'});
            yield put({type : 'closeModalButtonLoading'});
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
        showTableLoading(state, action) {
            return { ...state, ...action.payload, wxBannerTableLoading : true};
        },
        closeTableLoading(state, action) {
            return { ...state, ...action.payload, wxBannerTableLoading : false};
        },
        showModalLoading(state, action) {
            return { ...state, ...action.payload, wxBannerAddOrEditBannerModalLoading : true};
        },
        closeModalLoading(state, action) {
            return { ...state, ...action.payload, wxBannerAddOrEditBannerModalLoading : false};
        },
        showModalButtonLoading(state, action) {
            return { ...state, ...action.payload, wxBannerAddOrEditBannerButtonLoading : true};
        },
        closeModalButtonLoading(state, action) {
            return { ...state, ...action.payload, wxBannerAddOrEditBannerButtonLoading : false};
        },

    },

}
