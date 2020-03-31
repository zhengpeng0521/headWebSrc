import React from 'react';
import { message , Tabs , Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import LeadsAddComponent from '../../../components/crm/leads-follow/leads-add/LeadsAdd/LeadsAdd';
import CheckSameNameModal from '../../../components/crm/leads-follow/leads-add/CheckSameName/CheckSameNameModal';
import LeadsImportModal from '../../../components/crm/leads-follow/leads-add/LeadsImportModal/LeadsImportModal';
import { AlertModal } from '../../../components/common/new-component/NewComponent';

/*leads分配*/
function LeadsAdd({ dispatch , leadsAdd }) {

    let {
        localOrgId,                         //分布系统当前校区orgId
        leadsAddLoading,                    //整个页面是否加载状态
        leadsAddButtonLoading,              //新增提交按钮加载状态
        leadsAddType,                       //名单添加类型('1'公海池/'2'选择销售)
        leadsAddCurrentStaffId,             //当前操作用户的ID，用来选择销售时填写到默认值
        leadsAddFollowType,                 //跟进状态下拉列表内容
        leadsAddParentRelationship,         //获取数据字典家长关系下拉列表
        leadsAddOrgStaff,                   //选中机构下员工下拉列表内容
        leadsAddfirstChannel,               //一级来源下拉列表内容
        leadsAddSecondChannel,              //二级来源下拉列表内容
        leadsAddRecommender,                //推荐人(家长)下拉列表内容
        leadsAddCollector,                  //收集人(租户下所有员工)下拉列表内容

        //名单查重modal
        checkSameNameModalLoading,          //查重列表加载状态
        checkSameNameModalVisible,          //modal是否显示
        checkSameNameCurrentOrg,            //查重时当前的校区
        checkSameNameInitName,              //查重时在表单中输入的名字
        checkSameNameChangeName,            //查重时input框输入改变的名字
        checkSameNameModalContent,          //查重列表信息
        checkSameNameType,

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

    } = leadsAdd

    //选择校区onChange事件
    function OrgSelectOnChange(orgId){
        dispatch({
            type:'leadsAdd/GetOrgStaffMessage',
            payload:{
                orgId,
                status : 1
            }
        });
        //获取推荐人(当前机构下所有家长)下拉列表内容
        dispatch({
            type:'leadsAdd/GetRecommend',
            payload:{
                orgId,
            }
        });
        //获取收集人(当前机构下所有员工)下拉列表内容
        dispatch({
            type:'leadsAdd/GetCollector',
            payload:{
                orgId,
                status : 1
            }
        });
    }

    //录入区域onChange事件
    function AddTypeRadioGroupOnChange(e){
        dispatch({
            type:'leadsAdd/updateState',
            payload:{
                leadsAddType : e.target.value
            }
        });
    }

    //孩子姓名输入框onChange事件
    function AddLeadsNameOnChange(e){
        dispatch({
            type:'leadsAdd/updateState',
            payload:{
                checkSameNameInitName : !!(e.target.value + '') ? e.target.value.trim() : ''
            }
        });
    }
    //家长手机号输入框onChange事件
    function AddLeadsTelOnChange(e){
        dispatch({
            type:'leadsAdd/updateState',
            payload:{
                checkSameNameInitName : !!(e.target.value + '') ? e.target.value.trim() : ''
            }
        });
    }
    //孩子姓名，家长姓名，手机号输入框onBlur事件，用来即时查重
    function AddLeadsCheckSameOnBlur(msg,type,orgId){
        let obj = {};
        if(msg != '' && msg != undefined && msg != null && !/^[\s]*$/.test(msg)){
            obj[type] = msg;
            obj.orgId = orgId;
            obj.type = type;
            dispatch({
                type:'leadsAdd/AddLeadsOnBlurCheckSame',
                payload:{
                    ...obj
                }
            });
        }
    }

    //孩子姓名点击查重(orgId,name),家长手机号点击查重
    function LeadsAddCheckSameName(type,orgId,tureMsg){
        dispatch({
            type : 'leadsAdd/updateState',
            payload : {
                checkSameNameType : type,
            }
        })
        if(orgId == undefined || orgId == '' || orgId == null || /^[\s]*$/.test(orgId)){
            message.warn('请选择校区')
        }else if(tureMsg == undefined || tureMsg == '' || tureMsg == null || /^[\s]*$/.test(tureMsg)){
            if(type == 'name'){
                message.warn('请输入孩子姓名')
            }else if(type == 'tel'){
                message.warn('请输入家长手机号')
            }
        }else{
            //在全部leads中查询当前校区下这个名称的学员
            dispatch({
                type:'leadsAdd/GetNameFormThisOrg',
                payload:type == 'name' ? {
                    orgId,
                    tureName : (tureMsg + '').trim(),
                    pageIndex : 0,
                    pageSize : 99999,
                }: {
                    orgId,
                    parentMobile : (tureMsg + '').trim(),
                    pageIndex : 0,
                    pageSize : 99999,
                }
            });
        }
    }

    //名单查重modal的input的onChange事件
    function CheckSameNameModalInputOnchange(e){
        dispatch({
            type:'leadsAdd/updateState',
            payload:{
                checkSameNameChangeName : e.target.value
            }
        });
    }

    //名单查重modal点击搜索
    function CheckSameNameModalSubmit(){
        dispatch({
            type:'leadsAdd/CheckSameNameModalSubmit',
            payload:checkSameNameType == 'name' ? {
                orgId : localOrgId,
                tureName : checkSameNameChangeName,
                pageIndex : 0,
                pageSize : 99999,
            }:{
                orgId : localOrgId,
                parentMobile : checkSameNameChangeName,
                pageIndex : 0,
                pageSize : 99999,
            }
        });
    }

    //查重modal关闭
    function CheckSameNameModalClose(){
        dispatch({
            type:'leadsAdd/updateState',
            payload:{
                checkSameNameModalVisible : false
            }
        });
    }

    //点击新增保存
    function AddNewLeads(data,clear){
        dispatch({
            type:'leadsAdd/AddNewLeads',
            payload:{
                clear,
                ...data
            }
        });
    }

    //点击导入名单
    function ImportLeads(){
        dispatch({
            type:'leadsAdd/updateState',
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
                    5 : "studentFollowState",
                    6 : "parentName",
                    7 : "firstChannel",
                    8 : "seller",
                    9 : "conaddress",
                    10 : "schaddress",
                    11 : "secondChannel",
                    12 : "recommender",
                    13 : "collecter",
                    14 : "followRecord"
                };
                //获取预览表格
                dispatch({
                    type:'leadsAdd/LeadsImportPreview',
                    payload:{
                        id : leadsImportModalExcelId,
                        regex : JSON.stringify(regex)
                    }
                });
            }else{
                //不是模板条件下第一步点击下一步进入第二步获取数据
                dispatch({
                    type:'leadsAdd/FirstFinishGetSourceData',
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
                type:'leadsAdd/updateState',
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
                type:'leadsAdd/LeadsImportPreview',
                payload:{
                    id : leadsImportModalExcelId,
                    regex : JSON.stringify(regex)
                }
            });
        }else if(type == 'third_prestep'){      //第三步点击上一步
            //如果是模板文件 跳回第一步 反之则跳会第二步
            if(leadsImportIsModal){
                dispatch({
                    type:'leadsAdd/updateState',
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
                    type:'leadsAdd/updateState',
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
                type:'leadsAdd/updateState',
                payload:{
                    leadsImportModalStep : 3
                }
            });
        }else if(type == 'forth_prestep'){      //第四步点击上一步
            dispatch({
                type:'leadsAdd/updateState',
                payload:{
                    leadsImportModalStep : 2
                }
            });
        }else if(type == 'finish'){
            if(forthStepChooseItem == '' || forthStepChooseItem == null || forthStepChooseItem == undefined){
                return message.warn('请选择处理方式');
            }else{
                dispatch({
                    type:'leadsAdd/LeadsImportSubmit',
                    payload:{
                        id : leadsImportModalExcelId,
                        regex : leadsImportRegex,                   //leads导入中的regex
                        proMode : forthStepChooseItem
                    }
                });
            }
        }
    }

    /*第一步*/
        //点击下载数据模板
        function FirstStepDownLoadDataModal(){
            window.open(`${BASE_URL}/download/downloadStuInfoModel?type=2`);
        }

        //选择校区onChange事件
        function FirstStepOrgOnChange(orgId){
            dispatch({
                type:'leadsAdd/updateState',
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
                    type:'leadsAdd/CheckWetherModalFile',
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
                    type:'leadsAdd/updateState',
                    payload:{
                        leadsImportSecondSuc : true
                    }
                });
            }else{
                dispatch({
                    type:'leadsAdd/updateState',
                    payload:{
                        leadsImportSecondSuc : false
                    }
                });
            }
            dispatch({
                type:'leadsAdd/updateState',
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
            dispatch({
                type:'leadsAdd/updateState',
                payload:{
                    forthStepChooseItem : e.target.value
                }
            });
        }

    //leads导入modal关闭
    function LeadsImportModalClose(){
        dispatch({ type:'leadsAdd/clearUploadModal' });
    }

    //提示框点击下载错误日志
    function leadsImportSucAlertModalOnOk(){
        if(leadsImportSucModalWetherImportAll){
            dispatch({
                type:'leadsAdd/updateState',
                payload:{
                    leadsImportSucAlertModalVisible : false
                }
            });
        }else{
            window.open(`${BASE_URL}/leads/download/downloadByFileSys?id=${leadsImportSucAlertModalId}`);
        }
    }

    //提示框点击取消
    function leadsImportSucAlertModalOnCancel(){
        dispatch({
            type:'leadsAdd/updateState',
            payload:{
                leadsImportSucAlertModalVisible : false
            }
        });
    }

    let LeadsAddComponentProps = {
        localOrgId,                         //分布系统当前校区orgId
        leadsAddLoading,                    //整个页面是否加载状态
        leadsAddButtonLoading,              //新增提交按钮加载状态
        leadsAddType,                       //名单添加类型('1'公海池/'2'选择销售)
        leadsAddCurrentStaffId,             //当前操作用户的ID，用来选择销售时填写到默认值
        leadsAddFollowType,                 //跟进状态下拉列表内容
        leadsAddParentRelationship,         //获取数据字典家长关系下拉列表
        leadsAddOrgStaff,                   //选中机构下员工下拉列表内容
        leadsAddfirstChannel,               //一级来源下拉列表内容
        leadsAddSecondChannel,              //二级来源下拉列表内容
        leadsAddRecommender,                //推荐人(家长)下拉列表内容
        leadsAddCollector,                  //收集人(租户下所有员工)下拉列表内容

        OrgSelectOnChange,                  //选择校区onChange事件
        AddTypeRadioGroupOnChange,          //录入区域onChange事件
        AddLeadsNameOnChange,               //孩子姓名输入框onChange事件
        AddLeadsTelOnChange,
        AddLeadsCheckSameOnBlur,            //孩子姓名，家长姓名，手机号输入框onBlur事件，用来即时查重
        LeadsAddCheckSameName,              //点击查重(orgId,name)
        AddNewLeads,                        //点击新增保存
    }

    //名单查重modal属性
    let CheckSameNameModalProps = {
        checkSameNameModalLoading,          //查重列表加载状态
        checkSameNameModalVisible,          //查重modal是否显示
        checkSameNameInitName,              //查重时在表单中输入的名字
        checkSameNameChangeName,            //查重时input框输入改变的名字
        checkSameNameModalContent,          //查重列表信息

        CheckSameNameModalInputOnchange,    //名单查重modal的input的onChange事件
        CheckSameNameModalSubmit,           //名单查重modal点击搜索
        CheckSameNameModalClose,            //名单查重modal关闭方法
        checkSameNameType,
    }

    //批量导入leads属性
    let LeadsImportModalProps = {
        localOrgId,                         //分布系统当前校区orgId
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
        <div className='leads_add_pages'>
            <Button type='primary' onClick = { ImportLeads } style = {{ position : 'absolute' , right : 11 , top : 13 }}>导入名单</Button>
            <LeadsAddComponent {...LeadsAddComponentProps} />
            { checkSameNameModalVisible ? <CheckSameNameModal {...CheckSameNameModalProps}/> : null }
            { leadsImportModalVisible ? <LeadsImportModal {...LeadsImportModalProps}/> : null }
            { leadsImportSucAlertModalVisible ? <AlertModal {...AlertModalProps}/> : null }
        </div>
    );
}

function mapStateToProps({ leadsAdd }) {
    return { leadsAdd };
}

export default connect(mapStateToProps)(LeadsAdd);
