import {
    GetUserBranch,          //可以获取当前用户的ID
    GetDictMessage,         //获取数据字典数据(跟进状态，一级来源)下拉列表内容
    GetOrgStaffMessage,     //获取机构下的员工下拉列表内容
    GetRecommend,           //获取推荐人(家长)下拉列表内容
    AddLeadsOnBlurCheckSame,//孩子姓名，家长姓名，家长手机号onblur查重
    GetNameFormThisOrg,     //在全部leads中查询当前校区下这个名称的学员
    AddNewLeads,            //点击新增保存
    CheckWetherModalFile,   //导入leads查看是不是模版文件
    FirstFinishGetSourceData,//不是模板条件下第一步点击下一步进入第二步获取数据
    LeadsImportPreview,     //第一步上传模板跳到第三步 或者 第二步选择完成进入第三步 获取预览表格
    LeadsImportSubmit,      //批量导入提交
    PollingCheckImport      //轮询查看合同是否导入完毕
} from '../../../../services/crm/leads-follow/LeadsAdd';
import React from 'react';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

/*English*/
export default {

    namespace: 'leadsAdd',

    state: {
        localOrgId : undefined,             //分布系统当前校区orgId
        leadsAddLoading : false,            //整个页面是否加载状态
        leadsAddButtonLoading : false,      //新增提交按钮加载状态
        leadsAddType : '1',                 //名单添加类型('1'公海池/'2'选择销售)
        leadsAddCurrentStaffId : '',        //当前操作用户的ID，用来选择销售时填写到默认值
        leadsAddFollowType : [],            //跟进状态下拉列表内容
        leadsAddOrgStaff : [],              //选中机构下员工下拉列表内容
        leadsAddParentRelationship : [],    //获取数据字典家长关系下拉列表
        leadsAddfirstChannel : [],          //一级来源下拉列表内容
        leadsAddSecondChannel : [],         //二级来源下拉列表内容
        leadsAddRecommender : [],           //推荐人(家长)下拉列表内容
        leadsAddCollector : [],             //收集人(租户下所有员工)下拉列表内容

        //名单查重modal
        checkSameNameModalLoading : false,          //查重列表加载状态
        checkSameNameModalVisible : false,          //modal是否显示
        checkSameNameCurrentOrg : '',               //查重时当前的校区
        checkSameNameInitName : '',                 //查重时在表单中输入的名字
        checkSameNameChangeName : '',               //查重时input框输入改变的名字
        checkSameNameModalContent : [],             //查重列表信息
        wetherAddSuccess : false,                   //是否新增成功(用来清空表单)
        checkSameNameType : '',

        //名单批量导入modal
        leadsImportModalOrgId : '',                 //批量导入时选择校区ID
        leadsImportModalVisible : false,            //leads导入modal是否显示
        leadsImportModalButtonLoading : false,      //leads导入按钮加载状态
        leadsImportModalStep : 0,                   //leads导入进行的步数
        leadsImportRegex : {},                      //leads导入中的regex
        /*第一步*/
        leadsImportFirstSuc : false,                //第一步是否完成
        leadsImportModalExcelName : '请上传文件',    //leads导入上传文件名
        leadsImportModalExcelId : '',               //leads导入上传文件id
        leadsImportIsModal : false,                 //导入的文件是否是模板
        /*第二步*/
        leadsImportSecondSuc : false,               //第二步是否完成
        secondStepMatchData : [],                   //第二步匹配数据
        secondStepMisMatchData : [],                //第二步不匹配数据
        secondStepSelectData : [],                  //第二步下拉列表数据
        secondStepHasChoosedData : [],              //第二步中已选中的未配对数据
        /*第三步*/
        thirdStepTableTitle : [],                   //第三步表头
        thirdStepTableDataSourse : [],              //第三步列表数据
        thirdStepTableDataTotal : [],               //第三步列表数据数量
        /*第四步*/
        forthLastButtonDisplay : 'inline-block',    //第四步中上一步按钮是否显示(点击确定后消失)
        forthStepChooseItem : undefined,            //第四步选中的选项

        //导入成功提示框
        leadsImportSucAlertModalVisible : false,                    //提示框是否显示
        leadsImportSucModalWetherImportAll : false,                 //是否全部上传完毕
        leadsImportSucAlertModalId : undefined,                     //导出错误日志的id
        leadsImportSucAlertModalTitle : '',                         //提示框标题
        leadsImportSucAlertModalContent : '',                       //提示框内容
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/crm_leads_add'){
                    dispatch({
                        type:'updateState',
                        payload:{
                            leadsAddType : '1',
                            localOrgId : window._init_data.cerp_orgId,
                            leadsImportModalOrgId : window._init_data.cerp_orgId,
                        }
                    });
                    //可以获取当前用户的ID
                    dispatch({
                        type:'GetUserBranch'
                    });
                    //获取跟进状态下拉列表内容
                    dispatch({
                        type:'GetFollowType',
                        payload:{
                            dictkey : 'studentFollowState'
                        }
                    });
                    //获取机构下的员工下拉列表内容
                    dispatch({
                        type:'GetOrgStaffMessage',
                        payload:{
                            orgId : window._init_data.cerp_orgId,
                            status : 1
                        }
                    });
                    //获取家长关系
                    dispatch({
                        type:'GetParentRelationship',
                        payload:{
                            dictkey : 'parentRelationship'
                        }
                    });
                    //获取一级来源下拉列表内容
                    dispatch({
                        type:'GetFirstChannel',
                        payload:{
                            dictkey : 'firstChannel'
                        }
                    });
                    //获取二级来源下拉列表内容
                    dispatch({
                        type:'GetSecondChannel',
                        payload:{
                            dictkey : 'secondChannel'
                        }
                    });
                    //获取推荐人(家长)下拉列表内容
                    dispatch({
                        type:'GetRecommend',
                        payload:{
                            orgId : window._init_data.cerp_orgId,
                        }
                    });
                    //获取收集人(当前机构下所有员工)下拉列表内容
                    dispatch({
                        type:'GetCollector',
                        payload:{
                            orgId : window._init_data.cerp_orgId,
                            status : 1
                        }
                    });
                }
            });
        },
    },

    effects: {
        //可以获取当前用户的ID
        *'GetUserBranch'({ payload },{ call, put, select }){
            let { ret } = yield call(GetUserBranch,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        leadsAddCurrentStaffId : ret.userId + ''
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取当前用户信息失败');
            }
        },

        //获取跟进状态下拉列表内容
        *'GetFollowType'({ payload },{ call, put, select }){
            let { ret } = yield call(GetDictMessage,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        leadsAddFollowType : ret.list
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取跟进状态失败');
            }
        },

        //获取家长关系
        *'GetParentRelationship'({ payload },{ call, put, select }){
            let { ret } = yield call(GetDictMessage,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        leadsAddParentRelationship : ret.list
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取家长关系失败');
            }
        },

        //获取机构下的员工下拉列表内容
        *'GetOrgStaffMessage'({ payload },{ call, put, select }){
            let { ret } = yield call(GetOrgStaffMessage,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        leadsAddOrgStaff : ret.results
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取员工信息失败');
            }
        },

        //获取一级来源下拉列表内容
        *'GetFirstChannel'({ payload },{ call, put, select }){
            let { ret } = yield call(GetDictMessage,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        leadsAddfirstChannel : ret.list
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取跟进状态失败');
            }
        },
        //获取二级来源下拉列表内容
        *'GetSecondChannel'({ payload },{ call, put, select }){
            let { ret } = yield call(GetDictMessage,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        leadsAddSecondChannel : ret.list
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取跟进状态失败');
            }
        },

        //获取推荐人(家长)下拉列表内容
        *'GetRecommend'({ payload },{ call, put, select }){
            let { ret } = yield call(GetRecommend,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        leadsAddRecommender : ret.results
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取推荐人信息失败');
            }
        },

        //获取收集人(租户下所有员工)下拉列表内容
        *'GetCollector'({ payload },{ call, put, select }){
            let { ret } = yield call(GetOrgStaffMessage,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        leadsAddCollector : ret.results
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取收集人信息失败');
            }
        },

        //孩子姓名，家长姓名，家长手机号onblur查重
        *'AddLeadsOnBlurCheckSame'({ payload },{ call, put, select }){
            let { ret } = yield call(AddLeadsOnBlurCheckSame,parse(payload));
            if(ret && ret.errorCode === 1000){
                message.error(ret && ret.errorMessage || '有重复');
            }
        },

        //在全部leads中查询当前校区下这个名称的学员
        *'GetNameFormThisOrg'({ payload },{ call, put, select }){
            yield put({ type:'showLoading' });
            let { ret } = yield call(GetNameFormThisOrg,parse(payload));
            if(ret && ret.errorCode === 9000){
                let leadsAdd = yield select( state => state.leadsAdd );
                let checkSameNameInitName = leadsAdd.checkSameNameInitName;
                yield put({
                    type:'updateState',
                    payload:{
                        checkSameNameModalVisible : true,
                        checkSameNameCurrentOrg : payload.orgId,
                        checkSameNameModalContent : ret.results,
                        checkSameNameChangeName : checkSameNameInitName
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('查重失败');
            }
            yield put({ type:'closeLoading' });
        },

        /*查重modal内点击查询*/
        *'CheckSameNameModalSubmit'({ payload },{ call, put, select }){
            yield put({ type:'showCheckModalLoading' });
            let { ret } = yield call(GetNameFormThisOrg,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        checkSameNameModalContent : ret.results,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('查重失败');
            }
            yield put({ type:'closeCheckModalLoading' });
        },

        //点击新增保存
        *'AddNewLeads'({ payload },{ call, put, select }){
            yield put({ type:'showLoading' });
            yield put({ type:'showCheckModalButtonLoading' });
            let clear = payload && payload.clear ? payload.clear : undefined;
            delete payload.clear;
            let { ret } = yield call(AddNewLeads,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success('新增成功');
                yield put({
                    type:'updateState',
                    payload:{
                        leadsAddType : '1',
                    }
                });
                //新增成功清空表单
                if(!!clear){ clear() }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('新增失败');
            }
            yield put({ type:'closeCheckModalButtonLoading' });
            yield put({ type:'closeLoading' });
        },

        //查看是不是模板文件
        *'CheckWetherModalFile'({ payload },{ call, put, select }){
            let name = payload.name;
            delete payload.name;
            let { ret } = yield call(CheckWetherModalFile,parse(payload));
            if(ret && ret.errorCode === 9000){
                if(ret.flag){
                    message.success('检测成功，该文件为模版文件')
                }else{
                    message.success('检测成功，该文件非模版文件')
                }
                yield put({
                    type:'updateState',
                    payload:{
                        leadsImportFirstSuc : true,
                        leadsImportIsModal : ret.flag,
                        leadsImportModalExcelId : payload.id,               //leads导入上传文件id
                        leadsImportModalExcelName : name,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('文件检测失败');
            }
        },

        //不是模板条件下第一步点击下一步进入第二步获取数据
        *'FirstFinishGetSourceData'({ payload },{ call, put, select }){
            yield put({ type:'showLeadsImportButtonLoading' });
            let { ret } = yield call(FirstFinishGetSourceData,parse(payload));
            if(ret && ret.errorCode === 9000){
                let sourceFields = ret.data.sourceFields;
                for(let i in sourceFields){
                    sourceFields[i].disabled = false
                }
                yield put({
                    type:'updateState',
                    payload:{
                        leadsImportModalStep : 1,
                        secondStepMatchData : ret.data.dataModelFields,
                        secondStepMisMatchData : sourceFields,
                        secondStepSelectData : sourceFields
                    }
                });
            }else if( ret && ret.errorMessage ){
                message.error(ret.errorMessage);
            }else{
                message.error('获取文件信息失败');
            }
            yield put({ type:'closeLeadsImportButtonLoading' });
        },

        //第一步上传模板跳到第三步 或者 第二步选择完成进入第三步 获取预览表格
        *'LeadsImportPreview'({ payload },{ call, put, select }){
            yield put({ type:'showLeadsImportButtonLoading' });
            let { ret } = yield call(LeadsImportPreview,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        leadsImportModalStep : 2,
                        leadsImportRegex : payload.regex,
                        thirdStepTableTitle : ret.dataModelFields,
                        thirdStepTableDataSourse : ret.results,             //第三步列表数据
                        thirdStepTableDataTotal : ret.results.length,       //第三步列表数据数量
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取预览信息失败');
            }
            yield put({ type:'closeLeadsImportButtonLoading' });
        },

        /*批量导入提交*/
        *'LeadsImportSubmit'({ payload },{ call, put, select }){
            yield put({ type:'showLeadsImportButtonLoading' });
            yield put({ type:'closeLastStepButtonDisplay' });
            let { ret } = yield call(LeadsImportSubmit,parse(payload));
            if(ret && ret.errorCode === 9000){
                let sleep = function(ms) {
                    return new Promise(function(resolve, reject){
                        setTimeout(function(){
                            resolve()
                        }, ms);
                    });
                }
                yield sleep(5000);
                yield put({
                    type:'PollingCheckImport',
                    payload:{
                        orgId : ret.data.orgId,
                        logFileId : ret.data.logFileId
                    }
                });
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('批量导入失败');
                yield put({ type:'clearUploadModal' })
                yield put({ type:'closeLeadsImportButtonLoading' });
            }
        },

        //轮询查看名单是否导入完毕
        *'PollingCheckImport'({ payload },{ call, put, select }){
            yield put({ type:'showLeadsImportButtonLoading' });
            yield put({ type:'closeLastStepButtonDisplay' });
            let { ret } = yield call(PollingCheckImport,parse(payload));
            if(ret && ret.errorCode === 9000){
                let sleep = function(ms) {
                    return new Promise(function(resolve, reject){
                        setTimeout(function(){
                            resolve()
                        }, ms);
                    });
                }
                if (!ret.data.complete) {
                    yield sleep(5000);
                    yield put({
                        type:'PollingCheckImport',
                        payload:{
                            orgId : payload.orgId,
                            logFileId : payload.logFileId
                        }
                    })
                }else{
                    yield put({ type:'clearUploadModal' });
                    yield put({
                        type:'updateState',
                        payload:{
                            //导入成功后提示框
                            leadsImportSucAlertModalVisible : true,                    //提示框是否显示
                            leadsImportSucAlertModalTitle : '导入完成',                 //提示框标题
                            leadsImportSucAlertModalId : ret.data.logFileId,           //导出错误日志的id
                            leadsImportSucAlertModalContent : (
                                <div>
                                    <div>成功{ ret.data.sucNum }条</div>
                                    <div>失败{ ret.data.failNum }条</div>
                                </div>
                            ),                       //提示框内容
                        }
                    });
                    if(ret.data.failNum != '0'){        //导入有失败，未完全导入，提醒下载错误日志
                        yield put({
                            type:'updateState',
                            payload:{
                                leadsImportSucModalWetherImportAll : false
                            }
                        });
                    }else{
                        yield put({                     //导入无失败
                            type:'updateState',
                            payload:{
                                leadsImportSucModalWetherImportAll : true
                            }
                        });
                    }
                    yield put({ type:'closeLeadsImportButtonLoading' });
                }
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('批量导入失败');
                yield put({
                    type:'clearUploadModal'
                });
                yield put({ type:'closeLeadsImportButtonLoading' });
            }
        }
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        //整个页面列表加载状态
        showLoading(state, action) {
            return { ...state, ...action.payload , leadsAddLoading : true};
        },
        //整个页面加载状态
        closeLoading(state, action) {
            return { ...state, ...action.payload , leadsAddLoading : false};
        },
        //查重列表加载状态
        showCheckModalLoading(state, action) {
            return { ...state, ...action.payload , checkSameNameModalLoading : true};
        },
        //查重列表加载状态
        closeCheckModalLoading(state, action) {
            return { ...state, ...action.payload , checkSameNameModalLoading : false};
        },
        //查重列表提交按钮加载状态
        showCheckModalButtonLoading(state, action) {
            return { ...state, ...action.payload , leadsAddButtonLoading : true};
        },
        //查重列表提交按钮加载状态
        closeCheckModalButtonLoading(state, action) {
            return { ...state, ...action.payload , leadsAddButtonLoading : false};
        },
        //导入名单按钮开启加载状态
        showLeadsImportButtonLoading(state, action){
            return { ...state, ...action.payload , leadsImportModalButtonLoading : true};
        },
        //导入名单按钮关闭加载状态
        closeLeadsImportButtonLoading(state, action){
            return { ...state, ...action.payload , leadsImportModalButtonLoading : false};
        },
        //点击上传后使最后一步的上一步按钮消失
        closeLastStepButtonDisplay(state, action){
            return { ...state, ...action.payload , forthLastButtonDisplay : 'none'};
        },
        clearUploadModal(state, action){
            return {
                ...state,
                leadsImportModalOrgId : (window._init_data.firstOrg).key,                 //批量导入时选择校区ID
                leadsImportModalVisible : false,            //leads导入modal是否显示
                leadsImportModalButtonLoading : false,      //leads导入按钮加载状态
                leadsImportModalStep : 0,                   //leads导入进行的步数
                leadsImportRegex : {},                      //leads导入中的regex
                /*第一步*/
                leadsImportFirstSuc : false,                //第一步是否完成
                leadsImportModalExcelName : '请上传文件',    //leads导入上传文件名
                leadsImportModalExcelId : '',               //leads导入上传文件id
                leadsImportIsModal : false,                 //导入的文件是否是模板
                /*第二步*/
                leadsImportSecondSuc : false,               //第二步是否完成
                secondStepMatchData : [],                   //第二步匹配数据
                secondStepMisMatchData : [],                //第二步不匹配数据
                secondStepSelectData : [],                  //第二步下拉列表数据
                secondStepHasChoosedData : [],              //第二步中已选中的未配对数据
                /*第三步*/
                thirdStepTableTitle : [],                   //第三步表头
                thirdStepTableDataSourse : [],              //第三步列表数据
                thirdStepTableDataTotal : [],               //第三步列表数据数量
                /*第四步*/
                forthLastButtonDisplay : 'inline-block',    //第四步中上一步按钮是否显示(点击确定后消失)
                forthStepChooseItem : undefined,            //第四步选中的选项
            }
        },
    },
};
