import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import LeadsFollowTable from '../../../components/crm/leads-follow/leads-follow-table/LeadsFollowTable';
import LeadsFollowRightSuperSearch from '../../../components/crm/leads-follow/leads-follow-table/LeadsFollowSuperSearch';
import LeadsFollowDetailModal from '../../../components/crm/leads-follow/leads-follow-table/LeadsFollowDetailModal';
import LeadsFollowLeadsDispatchModal from '../../../components/crm/leads-follow/leads-follow-table/LeadsFollowLeadsDispatchModal/LeadsFollowLeadsDispatchModal';
import LeadsImportModal from '../../../components/crm/leads-follow/leads-add/LeadsImportModal/LeadsImportModal';
import { AlertModal } from '../../../components/common/new-component/NewComponent';

function LeadsFollow({ dispatch , leadsFollow }) {

    let {
        localOrgId,
        leadsFollowFastSearchContent,           //快捷搜索栏搜索内容

        /*高级搜索*/
        leadsFollowRightSuperSearchVisible,     //高级搜索是否显示
        leadsFollowRightSuperSearchContent,     //高级搜索栏搜索内容

        /*table*/
        leadsFollowTableNewColumns,             //选择列表是否显示字段是哪些
        leadsFollowTableLoading,                //列表是否加载状态
        leadsFollowTableDataSource,             //列表数据
        leadsFollowTableSelectedRowKeys,        //多选框选中项的id,若无id，则取到当前索引
        leadsFollowTableSelectedRows,           //多选框选中的项的对象数组

        /*pagination*/
        leadsFollowDataTotal,                   //数据总共数目
        leadsFollowPageIndex,                   //页码
        leadsFollowPageSize,                    //每页条数


        /*详情左划框*/
        leadsFollowDetailModalVisible,          //划入框是否显示
        leadsFollowDetailModalTabKey,           //tab项索引
        leadsFollowDetailLeadMessage,           //选中leads名单查看详情时当前人的信息

         /*分配modal*/
        leadsFollowLeadsDispatchModalVisible,           //分配modal是否显示
        leadsFollowLeadsDispatchModalButtonLoading,     //分配modal按钮是否加载状态
        leadsFollowLeadsDispatchOrgList,                //分配校区列表

        //名单批量导入modal
        leadsImportModalOrgId,              //批量导入时选择校区ID
        leadsImportModalVisible,            //leads导入modal是否显示
        leadsImportModalButtonLoading,      //leads导入按钮加载状态
        leadsImportModalStep,               //leads导入进行的步数
        leadsImportRegex,                   //leads导入中的regex
        /*第一步*/
        leadsImportFirstSuc,                //第一步是否完成
        leadsImportModalExcelName,          //leads导入上传文件名
        leadsImportModalExcelId,            //leads导入上传文件id
        leadsImportIsModal,                 //导入的文件是否是模板
        /*第二步*/
        leadsImportSecondSuc,               //第二步是否完成
        secondStepMatchData,                //第二步匹配数据
        secondStepMisMatchData,             //第二步不匹配数据
        secondStepSelectData,               //第二步下拉列表数据
        secondStepHasChoosedData,           //第二步中已选中的未配对数据
        /*第三步*/
        thirdStepTableTitle,                //第三步表头
        thirdStepTableDataSourse,           //第三步列表数据
        thirdStepTableDataTotal,            //第三步列表数据数量
        /*第四步*/
        forthLastButtonDisplay,             //第四步中上一步按钮是否显示(点击确定后消失)
        forthStepChooseItem,                //第四步选中的选项

        //导入成功提示框
        leadsImportSucAlertModalVisible,            //提示框是否显示
        leadsImportSucModalWetherImportAll,         //是否全部上传完毕
        leadsImportSucAlertModalId,                 //导出错误日志的id
        leadsImportSucAlertModalTitle,              //提示框标题
        leadsImportSucAlertModalContent,            //提示框内容

    } = leadsFollow

    //搜索栏的OnSearch事件
    function LeadsSearchBarOnSearch(data){
        if(!!data && !!data.dept_org){
            data.orgId = data.dept_org.substr(data.dept_org.indexOf('-') + 1);
            delete data.dept_org;
        }
        dispatch({
            type:'leadsFollow/GetTableList',
            payload:{
                pageIndex : 0,
                pageSize : leadsFollowPageSize,
                fastSearchContent : data,
                superSearchContent : leadsFollowRightSuperSearchContent
            }
        });
    }


    //table点击高级搜索事件和高级搜索点击右上角的X
    function LeadsSuperSearchOnSearch(){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsFollowRightSuperSearchVisible : !leadsFollowRightSuperSearchVisible
            }
        });
    }

    //高级搜索点击搜索
    function LeadsFollowRightSuperSearchClick(data){
        //处理生日时间范围
        if(data && data.birthday && data.birthday.length > 0){
            data.startBirthday = data.birthday[0] != undefined ? data.birthday[0].format('YYYY-MM-DD HH:mm') : undefined;
            data.endBirthday = data.birthday[1] != undefined ? data.birthday[1].format('YYYY-MM-DD HH:mm') : undefined;
            delete data.birthday;
        }

        dispatch({
            type:'leadsFollow/GetTableList',
            payload:{
                pageIndex : 0,
                pageSize : leadsFollowPageSize,
                fastSearchContent : leadsFollowFastSearchContent,
                superSearchContent : data
            }
        });

    }

    //复选框onChange事件
    function LeadsTableSelectedRowOnChange(selectedRowKeys, selectedRows){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsFollowTableSelectedRowKeys : selectedRowKeys,
                leadsFollowTableSelectedRows : selectedRows
            }
        });
    }

    //分页改变事件
    function LeadsTablePageOnChange(pageIndex,pageSize){
        dispatch({
            type:'leadsFollow/GetTableList',
            payload:{
                pageIndex : pageIndex - 1,
                pageSize : pageSize,
                fastSearchContent : leadsFollowFastSearchContent,
                superSearchContent : leadsFollowRightSuperSearchContent
            }
        });

    }
    //列表控制显示行
    function LeadsTableChangeColumns(leadsFollowTableNewColumns){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsFollowTableNewColumns
            }
        });
    }

    //table点击姓名打开详情
    function TableClickOpenDetail(data){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsFollowDetailModalVisible : true,
                leadsFollowDetailModalTabKey : '1',
                leadsFollowDetailLeadMessage : data,
            }
        });
    }
     //详情内tab的onChange事件
    function LeadsFollowDetailModalTabChange(e){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsFollowDetailModalTabKey : e
            }
        });
    }

    //详情划入框关闭
    function LeadsFollowDetailModalCancel(){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsFollowDetailModalVisible : false,

            }
        });
    }
    //分配校区
    function LeadsFollowTableDispatch(){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsFollowLeadsDispatchModalVisible : true
            }
        });
        dispatch({
            type:'leadsFollow/orgList',
            payload:{

            }
        });

    }
    //分配校区关闭
    function LeadsFollowLeadsDispatchModalCancel(){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsFollowLeadsDispatchModalVisible : false
            }
        });
    }
    //分配校区提交
    function LeadsFollowLeadsDispatchModalSubmit(data){
        dispatch({
            type:'leadsFollow/distribute',
            payload:{
                orgId : data.orgId,
                id : leadsFollowTableSelectedRowKeys.join(','),
            }
        });
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsFollowLeadsDispatchModalButtonLoading : true
            }
        });
    }

    //导入名单
    function importList(){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsImportModalVisible : true,
                leadsImportModalStep : 0,
                leadsImportFirstSuc : false,                //初始化第一步未完成
                leadsImportModalExcelId : '',               //初始化文件id
                leadsImportIsModal : false,                 //导入的文件是否是模板
                leadsImportSecondSuc : false,               //初始化第二步未完成
            }
        });
    }

    //点击modal内按钮(上一步，下一步，确认等)
    function ModalOperation(type){
        if(type == 'first_next'){
            //如果是模板文件 跳到第三步 反之则进入第二步
            if(leadsImportIsModal){
                let regex = {
                    0 : "name",
                    1 : "parentMobile",
                    2 : "sex",
                    3 : "birthday",
                    4 : "nickname",
                    5 : "parentName",
                    6 : "conaddress",
                    7 : "schaddress",
                    8 : "collecter",
                };
                //获取预览表格
                dispatch({
                    type:'leadsFollow/LeadsImportPreview',
                    payload:{
                        id : leadsImportModalExcelId,
                        regex : JSON.stringify(regex)
                    }
                });
            }else{
                //不是模板条件下第一步点击下一步进入第二步获取数据
                dispatch({
                    type:'leadsFollow/FirstFinishGetSourceData',
                    payload:{
                        id : leadsImportModalExcelId
                    }
                });
            }
        }else if(type == 'second_prestep'){     //第二步点击上一步
            //初始化是否选中数据
            for(let i in secondStepSelectData){
                secondStepSelectData[i].disabled = false;
                secondStepMisMatchData[i].disabled = false;
            }
            dispatch({
                type:'leadsFollow/updateState',
                payload:{
                    leadsImportModalStep : 0,
                    leadsImportSecondSuc : false,
                    secondStepSelectData,
                    secondStepMisMatchData,
                    secondStepHasChoosedData : []
                }
            });
        }else if(type == 'second_next'){        //第二步点击下一步
            let regex = {};
            for(let i in secondStepHasChoosedData){
                regex[secondStepHasChoosedData[i].value] = secondStepHasChoosedData[i].key;
            }
            //获取预览表格
            dispatch({
                type:'leadsFollow/LeadsImportPreview',
                payload:{
                    id : leadsImportModalExcelId,
                    regex : JSON.stringify(regex)
                }
            });
        }else if(type == 'third_prestep'){      //第三步点击上一步
            //如果是模板文件 跳回第一步 反之则跳会第二步
            if(leadsImportIsModal){
                dispatch({
                    type:'leadsFollow/updateState',
                    payload:{
                        leadsImportModalStep : 0
                    }
                });
            }else{
                //初始化第二步数据选中数据
                for(let i in secondStepSelectData){
                    secondStepSelectData[i].disabled = false;
                    secondStepMisMatchData[i].disabled = false;
                }
                dispatch({
                    type:'leadsFollow/updateState',
                    payload:{
                        leadsImportModalStep : 1,
                        secondStepSelectData,
                        secondStepMisMatchData,
                        secondStepHasChoosedData : [],
                        leadsImportSecondSuc : false,
                    }
                });
            }
        }else if(type == 'third_next'){         //第三步点击下一步
            dispatch({
                type:'leadsFollow/updateState',
                payload:{
                    leadsImportModalStep : 3
                }
            });
        }else if(type == 'forth_prestep'){      //第四步点击上一步
            dispatch({
                type:'leadsFollow/updateState',
                payload:{
                    leadsImportModalStep : 2
                }
            });
        }else if(type == 'finish'){
//            if(forthStepChooseItem == '' || forthStepChooseItem == null || forthStepChooseItem == undefined){
//                return message.warn('请选择处理方式');
//            }else{
                dispatch({
                    type:'leadsFollow/LeadsImportSubmit',
                    payload:{
                        id : leadsImportModalExcelId,
                        regex : leadsImportRegex,                   //leads导入中的regex
//                        proMode : forthStepChooseItem
                    }
                });
//            }
        }
    }

    //leads导入modal关闭
    function LeadsImportModalClose(){
        dispatch({ type:'leadsFollow/clearUploadModal' });
    }

    /*第一步*/
        //点击下载数据模板
        function FirstStepDownLoadDataModal(){
//            window.open(`${BASE_URL}/crm/hq/stuInfoImport/downloadStuInfoModel?type=5`);
            let params = {
                type : '5'
            }
            window.excelExport('/crm/hq/stuInfoImport/downloadStuInfoModel',params)
        }

        //选择校区onChange事件
        function FirstStepOrgOnChange(orgId){
            dispatch({
                type:'leadsFollow/updateState',
                payload:{
                    leadsImportModalOrgId : orgId
                }
            });
        }

        //选择文件onChange事件
        function FirstStepUploadOnChange(info){
            if(!leadsImportModalOrgId && leadsImportModalOrgId != 0) {
				return message.warn('请选择校区');
			}

			if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != 9000) {
                return message.error(info.file.response.errorMessage || `上传失败`);
    		}

			if(info.file.status == 'done') {
                message.success(`上传成功,正在检测文件类型`);
                /*检查是不是模板文件*/
                dispatch({
                    type:'leadsFollow/CheckWetherModalFile',
                    payload:{
                        id : info&&info.fileList.length > 0 && info.fileList[info.fileList.length - 1].response.id || undefined,
                        name : info.file.name,
                    }
                });
			}else if(info.file.status === 'error') {
			  	message.error(`上传失败`);
			}
        }

    /*第二步*/
        //第二步下拉列表onChange事件
        function SecondStepSelectOnChange(value,key){
            if(value != '' && value != null && value != undefined){     //选中
                let flag = false;
                for(let i in secondStepHasChoosedData){
                    if(secondStepHasChoosedData[i].key == key){
                        flag = true
                        break;
                    }
                }
                if(flag){
                    //替换原有数据
                    for(let i in secondStepHasChoosedData){
                        if(key == secondStepHasChoosedData[i].key){
                            let obj = { value : value , key : key };
                            secondStepHasChoosedData.splice(i,1,obj);
                            break;
                        }
                    }
                }else{
                    //新增数据
                    secondStepHasChoosedData.push({
                        value,
                        key
                    });
                }

                //初始化是否选中数据
                for(let i in secondStepSelectData){
                    secondStepSelectData[i].disabled = false;
                }
                //找到选中项并且将disabled改为true
                for(let i in secondStepHasChoosedData){
                    secondStepSelectData[secondStepHasChoosedData[i].value].disabled = true;
                }
            }else{      //取消选中
                //将取消选中项的disabled改为false
                for(let i in secondStepHasChoosedData){
                    if(key == secondStepHasChoosedData[i].key){
                        for(let j in secondStepSelectData){
                            if(secondStepHasChoosedData[i].value == j){
                                secondStepSelectData[j].disabled = false;
                                break;
                            }
                        }
                        break;
                    }
                }

                //从已选中项中删除当前项
                for(let i in secondStepHasChoosedData){
                    if(key == secondStepHasChoosedData[i].key){
                        secondStepHasChoosedData.splice(i,1);
                        break;
                    }
                }
            }

            //如果必填项已经全部选中，则第二步可进行下去 否则不可点击下一步
            let array = [];
            for(let i in secondStepHasChoosedData){
                array.push(secondStepHasChoosedData[i].key);
            }
            let str = array.join(',');
            if(str.indexOf('name') > -1 && str.indexOf('parentMobile') > -1){
                dispatch({
                    type:'leadsFollow/updateState',
                    payload:{
                        leadsImportSecondSuc : true
                    }
                });
            }else{
                dispatch({
                    type:'leadsFollow/updateState',
                    payload:{
                        leadsImportSecondSuc : false
                    }
                });
            }
            dispatch({
                type:'leadsFollow/updateState',
                payload:{
                    secondStepHasChoosedData,
                    secondStepSelectData,
                    secondStepMisMatchData : secondStepSelectData,
                }
            });
        }

    /*第四步*/
        //第四步单选框onChange事件
        function ForthStepRadioOnChange(e){
//            dispatch({
//                type:'leadsFollow/updateState',
//                payload:{
//                    forthStepChooseItem : e.target.value
//                }
//            });
        }

    //提示框点击下载错误日志
    function leadsImportSucAlertModalOnOk(){
        if(leadsImportSucModalWetherImportAll){
            dispatch({
                type:'leadsFollow/updateState',
                payload:{
                    leadsImportSucAlertModalVisible : false
                }
            });
            dispatch({
                type : 'leadsFollow/GetTableList',
                payload : {
                    pageSize : leadsFollowPageSize,
                    pageIndex : leadsFollowPageIndex,
                    fastSearchContent : leadsFollowFastSearchContent,
                    superSearchContent : leadsFollowRightSuperSearchContent
                }

            })
        }else{
            let params = {
                id : leadsImportSucAlertModalId
            }
//            window.open(`${BASE_URL}/crm/hq/download/downloadByFileSys?id=${leadsImportSucAlertModalId}`);
            window.excelExport('/crm/hq/download/downloadByFileSys',params)
        }
    }

    //提示框点击取消
    function leadsImportSucAlertModalOnCancel(){
        dispatch({
            type:'leadsFollow/updateState',
            payload:{
                leadsImportSucAlertModalVisible : false
            }
        });
    }

    /*分配modal属性*/
    let LeadsFollowLeadsDispatchModalProps = {
        leadsFollowLeadsDispatchOrgList,                //分配校区列表
        leadsFollowLeadsDispatchModalVisible,       //分配modal是否显示
        leadsFollowLeadsDispatchModalButtonLoading, //分配modal按钮是否加载状态
        leadsFollowTableSelectedRowKeys,            //多选框选中项的id,若无id，则取到当前索引
        leadsFollowTableSelectedRows,               //多选框选中的项的对象数组
        LeadsFollowLeadsDispatchModalSubmit,        //分配modal提交
        LeadsFollowLeadsDispatchModalCancel,        //分配modal关闭
    };
    /*高级搜索属性*/
    let LeadsFollowRightSuperSearchProps = {
        leadsFollowRightSuperSearchVisible,         //高级搜索是否显示
        leadsFollowRightSuperSearchContent,         //高级搜索栏搜索内容
        LeadsFollowRightSuperSearchClick,           //高级搜索点击搜索或者重置
        LeadsSuperSearchOnSearch,                   //点击右上角的X
    };


    //详情左边划入框属性
    let LeadsFollowDetailModalProps = {
        leadsFollowDetailModalVisible,          //划入框是否显示
        leadsFollowDetailModalTabKey,           //tab项索引
        leadsFollowDetailLeadMessage,           //选中leads名单查看详情时当前人的信息

        LeadsFollowDetailModalTabChange,        //详情内tab的onChange事件
        LeadsFollowDetailModalCancel,           //详情划入框关闭

    }

    //table整体属性
    let LeadsFollowTableProps = {
        TableClickOpenDetail,                   //table点击姓名打开详情
        search : {
            onSearch : (data) => LeadsSearchBarOnSearch(data),
            onClear : (data) => LeadsSearchBarOnSearch(data),
            fields : [
                { key : 'dept_org' , type : 'dept_org' },
                { key : 'name' ,
                  type : 'input' ,
                  placeholder : '名单姓名' },
                { key : 'parentMobile' ,
                  type : 'input' ,
                  placeholder : '手机号' },
            ],
        },
        table : {
            newColumns : leadsFollowTableNewColumns,
            changeColumns : LeadsTableChangeColumns,
            loading : leadsFollowTableLoading,
            dataSource : leadsFollowTableDataSource,
            rowSelection : {
                selectedRowKeys : leadsFollowTableSelectedRowKeys,
                onChange : LeadsTableSelectedRowOnChange,        //复选框onChange事件
            },
        },
        pagination : {
            total : leadsFollowDataTotal,
            pageIndex : leadsFollowPageIndex,
            pageSize : leadsFollowPageSize,
            onChange : LeadsTablePageOnChange,
            onShowSizeChange : LeadsTablePageOnChange,
            showSizeChanger : true,
            showQuickJumper : true,
            showTotal : () => (`共${leadsFollowDataTotal}条`),
        },
        leftBars : {
            label : '已选',
            labelNum : leadsFollowTableSelectedRows.length,
            btns :[{label : '分配' , handle : () => LeadsFollowTableDispatch() , confirm : false}]
        },
        rightBars : {
            isSuperSearch : true,
            superSearchVisible : leadsFollowRightSuperSearchVisible,
            superSearch : LeadsSuperSearchOnSearch,
            closeSearch : LeadsSuperSearchOnSearch,
            btns : [
                { label : '导入名单' , handle : importList },
            ],
        }
    };

    //批量导入leads属性
    let LeadsImportModalProps = {
        localOrgId,
        leadsImportModalVisible,            //leads导入modal是否显示
        leadsImportModalButtonLoading,      //leads导入按钮加载状态
        leadsImportModalStep,               //leads导入进行的步数

        ModalOperation,                     //点击modal内按钮
        LeadsImportModalClose,              //leads导入modal关闭

        /*第一步*/
        leadsImportFirstSuc,                //第一步是否完成
        leadsImportModalExcelName,          //leads导入上传文件名
        FirstStepOrgOnChange,               //选择校区onChange事件
        FirstStepUploadOnChange,            //选择文件onChange事件
        FirstStepDownLoadDataModal,         //点击下载数据模板

        /*第二步*/
        leadsImportSecondSuc,               //第二步是否完成
        secondStepMatchData,                //第二步匹配数据
        secondStepMisMatchData,             //第二步不匹配数据
        secondStepSelectData,               //第二步下拉列表数据

        SecondStepSelectOnChange,           //第二步下拉列表onChange事件

        /*第三步*/
        thirdStepTableTitle,                //第三步表头
        thirdStepTableDataSourse,           //第三步列表数据
        thirdStepTableDataTotal,            //第三步列表数据数量

        /*第四步*/
        forthLastButtonDisplay,             //第四步中上一步按钮是否显示(点击确定后消失)
        ForthStepRadioOnChange,             //第四步单选框onChange事件
    }

    //导入成功提示框
    let AlertModalProps = {
        visible : leadsImportSucAlertModalVisible,                      //提示框是否显示
        title : leadsImportSucAlertModalTitle,                          //提示框标题
        content : leadsImportSucAlertModalContent,                      //提示框内容
        onOk : leadsImportSucAlertModalOnOk,                            //提示框点击下载
        onCancel : leadsImportSucAlertModalOnCancel,                    //提示框点击取消
        footerEnsure : leadsImportSucModalWetherImportAll ? '确定' : '下载错误日志',
        footerCancel : '关闭'
    }

    return (
        <div style = {{ overflow : 'hidden', height : '100%' }}>
            <LeadsFollowTable {...LeadsFollowTableProps} />
            <LeadsFollowRightSuperSearch {...LeadsFollowRightSuperSearchProps}/>
            <LeadsFollowDetailModal {...LeadsFollowDetailModalProps}/>
            { leadsFollowLeadsDispatchModalVisible ? <LeadsFollowLeadsDispatchModal {...LeadsFollowLeadsDispatchModalProps}/> : null }
            { leadsImportModalVisible ? <LeadsImportModal {...LeadsImportModalProps}/> : null }
            { leadsImportSucAlertModalVisible ? <AlertModal {...AlertModalProps}/> : null }
        </div>
    );
}

function mapStateToProps({ leadsFollow }) {
    return { leadsFollow };
}

export default connect(mapStateToProps)(LeadsFollow);
