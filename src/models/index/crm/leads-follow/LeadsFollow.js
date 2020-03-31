import {

    GetTableList,                           /*获取全部列表数据*/
    distribute,                             //分配名单
    orgList,                                //校区列表
    GetStuSource,                           //一级来源列表

    LeadsImportPreview,     //第一步上传模板跳到第三步 或者 第二步选择完成进入第三步 获取预览表格
    FirstFinishGetSourceData,//不是模板条件下第一步点击下一步进入第二步获取数据
    LeadsImportSubmit,      //批量导入提交
    CheckWetherModalFile,   //导入leads查看是不是模版文件
    PollingCheckImport,      //轮询查看合同是否导入完毕
    headOrgInfoQuery,

} from '../../../../services/crm/leads-follow/LeadsFollow';
import { parse } from 'qs';
import { message } from 'antd';
import React from 'react';
import { routerRedux } from 'dva/router';

/*名单*/
export default {

    namespace: 'leadsFollow',

    state: {

        wetherChangeRouter : false,                     //是否切换路由，用于清空快捷搜索与高级搜索栏内容


        /*快捷搜索*/
        leadsFollowFastSearchFollowState : [],          //快捷搜索栏跟进状态下拉列表内容，还可以用来格式化跟进状态
        leadsFollowFastSearchStuSource : [],            //快捷搜索栏一级来源下拉列表内容
        leadsFollowFastSearchContent : {},              //快捷搜索栏搜索内容

        /*高级搜索*/
        leadsFollowRightSuperSearchVisible : false,     //高级搜索是否显示
        leadsFollowRightSuperSearchContent : {},        //高级搜索栏搜索内容

        /*table*/
        leadsFollowTableNewColumns : [],                //选择列表是否显示字段是哪些
        leadsFollowTableLoading : false,                //列表是否加载状态
        leadsFollowTableDataSource : [],                //table列表数据
        leadsFollowTableSelectedRowKeys : [],           //多选框选中项的id,若无id，则取到当前索引
        leadsFollowTableSelectedRows : [],              //多选框选中的项的对象数组

        /*pagination*/
        leadsFollowDataTotal : 0,                       //数据总共数目
        leadsFollowPageIndex : 0,                       //页码
        leadsFollowPageSize : 20,                       //每页条数


        /*详情左划框*/
        leadsFollowDetailModalVisible : false,          //划入框是否显示
        leadsFollowDetailModalTabKey : '2',             //tab项索引
        leadsFollowDetailLeadMessage : {},              //选中leads名单查看详情时当前人的信息

        /*分配modal*/
        leadsFollowLeadsDispatchModalVisible : false,           //分配modal是否显示
        leadsFollowLeadsDispatchModalButtonLoading : false,     //分配modal按钮是否加载状态
        leadsFollowLeadsDispatchOrgList : [],   //分配校区列表

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
            history.listen(location => {
                if (location.pathname == '/hq_org_cluestudent') {
                    dispatch({
                        type : 'updateState',
                        payload : {
                            leadsFollowDetailModalVisible : false,
                            localOrgId : window._init_data.orgId,
                        }
                    });

                    //一级来源及列表查询
                    dispatch({
                        type : 'GetStuSource',
                        payload : {
                            key : 'firstChannel'
                        }
                    });
                }
            });
        },

    },

    effects: {
        /*获取全部列表数据*/
        *'GetTableList'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            let fastSearchContent = payload.fastSearchContent || {};
            let superSearchContent = payload.superSearchContent || {};
            delete payload.fastSearchContent;
            delete payload.superSearchContent;
            let params = { ...payload , ...fastSearchContent , ...superSearchContent };
            let leadsFollow = yield select( state => state.leadsFollow );
            let leadsFollowFastSearchStuSource = leadsFollow.leadsFollowFastSearchStuSource;        //格式化一级来源时需要遍历比对
            let resInit = yield call(GetTableList,parse(params));
            if( !!resInit && resInit.ret && resInit.ret.errorCode === 9000 ){
                let { ret } = resInit;
                let leadsFollow = yield select( state => state.leadsFollow );

                if(ret.results && ret.results.length == 0 && params.pageIndex > 0){
                    params.pageIndex -= 1;
                    let resAgain = yield call(GetTableList,parse(params));
                    if(!!resAgain && resAgain.ret && resAgain.ret.errorCode === 9000){
                        let { ret } = resAgain;
                        for(let i in ret.results){
                            //格式化一级来源
                            for(let j in leadsFollowFastSearchStuSource){
                                if(ret.results[i].channel == leadsFollowFastSearchStuSource[j].key){
                                    ret.results[i].channel = leadsFollowFastSearchStuSource[j].value;
                                    break;
                                }
                            }

                            //格式化性别
                            switch(ret.results[i].sex){
                                case '1' : ret.results[i].sex = '男' ; break ;
                                case '2' : ret.results[i].sex = '女' ; break ;
                                default : ret.results[i].sex = '--' ; break;
                            }
                        }
                        yield put({
                            type  :'updateState',
                            payload : {
                                wetherChangeRouter : false,
                                leadsFollowTableDataSource : ret.results || [],  //table列表数据
                                leadsFollowTableSelectedRowKeys : [],           //复选框选中项清空
                                leadsFollowTableSelectedRows : [],              //复选框选中项清空

                                leadsFollowDataTotal : ret.data && ret.data.resultCount || 0,    //数据总共数目
                                leadsFollowPageIndex : ret.data && ret.data.pageIndex || 0,      //页码
                                leadsFollowPageSize : ret.data && ret.data.pageSize || 20,       //每页条数

                                leadsFollowFastSearchContent : fastSearchContent,           //更新常用搜索内容项
                                leadsFollowRightSuperSearchContent : superSearchContent,    //更新高级搜索内同

                            }
                        });

                    }else{
                        message.error(!!resAgain && resAgain.ret && resAgain.ret.errorMessage ? resAgain.ret.errorMessage : '获取列表数据失败');
                    }
                }else{
                    for(let i in ret.results){
                        //格式化一级来源
                        for(let j in leadsFollowFastSearchStuSource){
                            if(ret.results[i].channel == leadsFollowFastSearchStuSource[j].key){
                                ret.results[i].channel = leadsFollowFastSearchStuSource[j].value;
                                break;
                            }
                        }

                        //格式化性别
                        switch(ret.results[i].sex){
                            case '1' : ret.results[i].sex = '男' ; break ;
                            case '2' : ret.results[i].sex = '女' ; break ;
                            default : ret.results[i].sex = '--' ; break;
                        }
                    }
                    yield put({
                        type  :'updateState',
                        payload : {
                            wetherChangeRouter : false,

                            leadsFollowTableDataSource : ret.results || [],       //table列表数据
                            leadsFollowTableSelectedRowKeys : [],           //复选框选中项清空
                            leadsFollowTableSelectedRows : [],              //复选框选中项清空

                            leadsFollowDataTotal : ret.data && ret.data.resultCount || 0,    //数据总共数目
                            leadsFollowPageIndex : ret.data && ret.data.pageIndex || 0,      //页码
                            leadsFollowPageSize : ret.data && ret.data.pageSize || 20,       //每页条数

                            leadsFollowFastSearchContent : fastSearchContent,           //更新常用搜索内容项
                            leadsFollowRightSuperSearchContent : superSearchContent,    //更新高级搜索内同

                        }
                    });

                }
            }else{
                message.error(!!resInit && resInit.ret && resInit.ret.errorMessage ? resInit.ret.errorMessage : '获取列表数据失败');
            }
            yield put({ type : 'closeTableLoading' });
        },
        //分配名单 distribute
        *'distribute'({ payload },{ put , call , select }){
            let leadsFollow = yield select( state => state.leadsFollow );
            let { ret } = yield call(distribute,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                 message.success('名单分配成功');
                 yield put({
                    type  :'updateState',
                    payload : {
                        leadsFollowLeadsDispatchModalVisible : false,
                        leadsFollowLeadsDispatchModalButtonLoading : false
                    }
                 })
                yield put({
                    type : 'GetTableList',
                    payload : {
                        pageIndex : 0,
                        pageSize : leadsFollow.pageSize,
                        fastSearchContent : leadsFollow.fastSearchContent,
                        superSearchContent : leadsFollow.superSearchContent,
                    }
                });
            }else{
                yield put({
                    type  :'updateState',
                    payload : {
                        leadsFollowLeadsDispatchModalButtonLoading : false
                    }
                 })
                message.error(ret && ret.errorMessage ? ret.errorMessage : '服务端错误');
            }
        },
        //分配校区列表
        *'orgList'({ payload },{ put , call , select }){
            let leadsFollow = yield select( state => state.leadsFollow );
            let { ret } = yield call(orgList,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                let newList = []
                ret.results && ret.results.forEach(item => {
                    if(item.id != window._init_data.orgId){
                        newList.push(item)
                    }
                })
                 yield put({
                    type  :'updateState',
                    payload : {
                        leadsFollowLeadsDispatchOrgList : newList
                    }
                 })
            }else{
                message.error( ret && ret.errorMessage ? ret.errorMessage : '获取列表数据失败');
            }
        },
        /*获取一级来源下拉列表内容，如果是'我的leads'进行uids查询；如果不是进行列表查询*/
        *'GetStuSource'({ payload },{ put , call , select }){
            let { ret } = yield call(GetStuSource,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type : 'updateState',
                    payload:{
                        leadsFollowFastSearchStuSource : ret.list,
                    }
                });

                yield put({
                    type:'GetTableList',
                    payload:{
                        pageIndex : 0,
                        pageSize : 20,
                    }
                });

            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取来源下拉列表内容失败');
            }
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

        /*批量导入提交*/
        *'LeadsImportSubmit'({ payload },{ call, put, select }){
            yield put({ type:'showLeadsImportButtonLoading' });
            yield put({ type:'closeLastStepButtonDisplay' });
            let indexMainLayoutModel = yield select( state => state.indexMainLayoutModel );
            payload.userId =  !!indexMainLayoutModel.userMsg && indexMainLayoutModel.userMsg.userId;
            payload.orgId = window._init_data.orgId;
            console.info(payload)
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
        //列表加载状态
        showTableLoading(state, action) {
            return { ...state, ...action.payload , leadsFollowTableLoading : true};
        },
        //列表加载状态
        closeTableLoading(state, action) {
            return { ...state, ...action.payload , leadsFollowTableLoading : false};
        },
        //导入名单按钮开启加载状态
        showLeadsImportButtonLoading(state, action){
            return { ...state, ...action.payload , leadsImportModalButtonLoading : true};
        },
        //导入名单按钮关闭加载状态
        closeLeadsImportButtonLoading(state, action){
            return { ...state, ...action.payload , leadsImportModalButtonLoading : false};
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
