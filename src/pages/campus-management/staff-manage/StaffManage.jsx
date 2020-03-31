import React from 'react';
import { Tabs , message, Input, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import Media from 'react-media';
const TabPane = Tabs.TabPane;

import TreeOrgCheckSelect from '../../../components/common/new-component/tree-org-check-select/TreeOrgCheckSelect';

import StaffManageLeftList from '../../../components/campus-management/staff-manage/StaffManageLeftList';                  /*员工管理左边组织架构*/
//import StaffManageAddOrEditSector from '../../../components/campus-management/staff-manage/StaffManageAddOrEditSector';    /*组织架构新增部门modal*/

import StaffManageRightTable from '../../../components/campus-management/staff-manage/StaffManageRightTable';              /*员工管理右边search*/
import StaffManageAddOrEditStaff from '../../../components/campus-management/staff-manage/StaffManageAddOrEditStaff';      /*员工管理新增员工modal*/

import StaffManageChangeStatusFailedModal from '../../../components/campus-management/staff-manage/StaffManageChangeStatusFailedModal';      /*员工修改状态失败的员工会显示在此表单中*/
import StaffManageInviteModal from '../../../components/campus-management/staff-manage/StaffManageInviteModal'     /* 员工邀请modal */
import { connect } from 'dva';
import styles from './StaffManage.less';

function StaffManage({ dispatch, staffManage }) {

    let {

        staffManageType,                        //员工类型(总部hq/校区分部org)
        /*是否是系统管理员*/
        wetherSystemMgr,                        //是否是管理员(如果是管理员，则新增修改员工信息时表单'职能信息'部分不可修改，否则可修改)

        /*组织架构列表*/
        allOrganList,                           //左边组织架构数据
        allOrganListLoading,                    //左边组织架构是否加载中
        secondOrganArray,                       //左边组织架构列表默认打开的二级菜单
        initSecondOrganArrayOpenTag,            //默认打开的节点
        organItemIndexOnMouseMove,              //左边组织架构鼠标放到项目上的索引(用来使对应位置出现'编辑'和'删除')
        organItemIdOnMouseMove,                 //左边组织架构鼠标放到项目上的id(用来使对应位置出现'编辑'和'删除')
        allOrganSearchContent,                  //左边组织架构查询条件

        /*员工列表search*/
        staffTableType,                         //表格类型(使用中'1'/已停用'3')
        staffManageRoleSelectContent,           //表格搜索栏角色列表下拉数据
        staffManageFastSearchContent,           //员工管理查询条件
        staffManageGetchiefUserContent,         //汇报对象下拉数据
        staffList,                              //员工列表查询(总部汇报对象)

        /*员工列表table*/
        staffManagePageSize,                    //页码
        staffManagePageIndex,                   //每页条数
        staffManageTableLoading,                //表格加载状态
        staffManageTableTotal,                  //表格数据总数
        staffManageTableContent,                //表格数据所有内容
        staffManageSearchVisible,               //右边table列表搜索栏是否显示
        staffManageTableSelectedRowKeys,        //表格多选选中的数组
        staffManageTableSelectedRow,            //表格多选中的对象数组

        /*右边列表新增编辑员工modal*/
        addOrEditStaffModalType,                //新增编辑表单类型('add'/'edit'/'modifyFunction')
        addOrEditStaffModalVisible,             //新增员工modal是否显示
        addOrEditStaffModalLoading,             //新增编辑员工表单加载状态
        addOrEditStaffModalButtonLoading,       //新增员工modal按钮是否在加载状态
        addOrEditStaffModalData,                //编辑员工时回填数据
        addOrEditStaffModalLeaderSelect,        //通过摘要查询获取汇报对象下拉列表
        addOrEditStaffModalChooseOrgId,         //账号所属选中的校区ID
        addOrEditStaffModalWetherHead,          //所属部门如果是总部(true),用来判断管辖校区的显示内容
        addOrEditStaffModalTheCampus,             //新增选中的所属校区
        addOrEditStaFFModalOrgId,
        previewVisible,            //预览显示
        previewImage,              //预览图片
        empNo,                     //员工工号
        mail,                      //员工邮箱

        /*员工修改状态失败的员工会显示在此表单中*/
        changeStatusOperateAllStaffNum,                    //总共有多少个员工被改变了状态
        changeStatusFailedModalVisible,                 //表单是否显示

        //员工需要交接任务列表
        staffManageChangeStatusPageIndex,               //页码
        staffManageChangeStatusPageSize,                //每页条数
        changeStatusOperateFailStaffNum,              //列表总数
        staffManageChangeStatusTableContent,            //列表内容

        /*新增编辑员工时校区选择modal*/
        selectCampusModalVisible,               //选择校区modal是否显示
        selectCampus,                           //默认添加的校区选项

        /*表格点击所属机构下方数据时弹出模态框*/
        checkOrgsModalVisible,                  //查看所属机构模态框是否展示
        checkOrgsModalData,                     //查看所属机构机构数据
        checkgxxq,

        /* 新增编辑员工时部门选择modal */
        selectDeptModalVisible,            //选择部门modal是否显示
        selectDept,                        //默认添加的部门选项

        /* 邀请注册登录 */
        registerUrl,                       //邀请链接
        isInviteShow                       //是否打开邀请弹窗

	} = staffManage;

    /*左边组织架构*/
        /*左边组织架构列表节点展开事件*/
        let OrganListOnExpend = function(expandedKeys){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    secondOrganArray : expandedKeys,
                }
            });
        }

        /*左边组织架构点击名称查询事件*/
        function OrganListClickTreeName(id,e){
            let dept_org_search_obj = {};
            //选中状态传相应参数，取消选中状态传空对象
            if(staffManageType == 'hq' && !!e.selected){
                dept_org_search_obj = { deptId : id[0] != initSecondOrganArrayOpenTag[0] ? id[0] : undefined };
            }else if(staffManageType == 'org' && !!e.selected){
                switch(e.selectedNodes[0].props.type){
                    case 'org' : dept_org_search_obj = { orgId : id[0] != initSecondOrganArrayOpenTag[0] ? id[0] : undefined } ; break ;
                    case 'dept' : dept_org_search_obj = { deptId : id[0] != initSecondOrganArrayOpenTag[0] ? id[0] : undefined } ; break ;
                }
            }
            dispatch({
                type:'staffManage/ShowStaffTable',
                payload:{
                    pageIndex : 0,                              //表格页码
                    pageSize : staffManagePageSize,             //表格每页显示条数
                    status : staffTableType,                    //判断是使用中还是停用中
                    fastSearchContent : staffManageFastSearchContent,
                    allOrganSearchContent : dept_org_search_obj
                }
            });
        }

    /*右边员工列表*/
        /*员工管理点击查询*/
        let StaffManageSearchSubmit = function(data){
            dispatch({
                type:'staffManage/ShowStaffTable',
                payload:{
                    pageIndex : 0,                              //表格页码
                    pageSize : staffManagePageSize,             //表格每页显示条数
                    status : staffTableType,                    //判断是使用中还是停用中
                    fastSearchContent : data,
                    allOrganSearchContent,
                    staffManageType,
                }
            });
        }

        /*右边员工列表使用中分页*/
        let StaffManageTableOnChangePage = function(pageIndex,pageSize) {
            dispatch({
                type: 'staffManage/ShowStaffTable',
                payload: {
                    pageIndex : pageIndex - 1,
                    pageSize : pageSize,
                    status : staffTableType,                                //判断是使用中还是停用中
                    fastSearchContent : staffManageFastSearchContent,       //搜索条件
                    allOrganSearchContent
                },
            });
        };

        /*多选框选中的onChange方法*/
        let StaffManageTableRowSelectChange = function(selectedRowKeys, selectedRows){
            dispatch({
                type: 'staffManage/updateState',
                payload: {
                    staffManageTableSelectedRowKeys : selectedRowKeys,
                    staffManageTableSelectedRow : selectedRows,
                },
            });
        }

        /*表格点击所属机构下方数据时弹出并查看*/
        let StaffManageCheckOrgs = function(data){
            let orgIdArray = [];
            for(let i in data){
                orgIdArray.push(data[i].org_id+'');
            }
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    checkOrgsModalData : data,          //查看所属机构机构数据
                    checkOrgsModalVisible : true,
                }
            });
        }

        /*关闭查看所属机构模态框*/
        let CheckOrgsModalCancel = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    checkOrgsModalData : [],
                    checkOrgsModalVisible : false,
                }
            });
        }

        /*右边员工列表点击新增按钮*/
        let StaffManageTableOnCreateStaff = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditStaffModalType : 'add',
                    addOrEditStaffModalData : {},
                    empNo: '',
                    mail: '',
                    addOrEditStaffModalVisible : true,
                    selectCampus : [],
                }
            });
        }

        /*右边员工列表内点击编辑*/
        let StaffManageTableOnEditStaff = function(data,type){
            if(type == 'edit' && staffManageTableSelectedRow.length != 1){
                message.warn('编辑时应选中一个员工');
            }else if(type == 'modifyFunction' && staffManageTableSelectedRow.length != 1){
                message.warn('修改职能时应选中一个员工');
            }else{

                if(staffManageType == 'org'){
                    dispatch({
                        type:'staffManage/GetStaffDetail',
                        payload:{
                            orgId : data.belongOrgId,
                            id : data.id,
                            type,
                            staffManageType,
                        }
                    });
                    if(type == 'modifyFunction'){
                        dispatch({
                            type : 'staffManage/GetRoleSelect',
                            payload : {
                                isHq : '0',
                                orgId : data.belongOrgId
                            }
                        })
                        dispatch({
                            type : 'staffManage/GetchiefUser',
                            payload : {
                                orgId : data.belongOrgId,
                                isHq : '0'
                            }
                        })
                        dispatch({
                            type : 'staffManage/updateState',
                            payload : {
                                addOrEditStaFFModalOrgId : data.belongOrgId,
                            }
                        })
                    }
                }else{
                    dispatch({
                        type:'staffManage/GetStaffDetail',
                        payload:{
                            userId : data.id,
                            type,
                            staffManageType,
                        }
                    });
                }

            }
        }

        /*新增编辑员工modal关闭*/
        let AddOrEditStaffModalCancel = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditStaffModalType : undefined,
                    addOrEditStaffModalButtonLoading : false,
                    addOrEditStaffModalVisible : false,
                    addOrEditStaffModalLeaderSelect : [],
                    addOrEditStaffModalData : {},           //清空表单回填数据
                    selectCampus : [],                      //清空选择校区数据
                    staffManageTableSelectedRowKeys : [],
                    staffManageTableSelectedRow : [],
                    addOrEditStaFFModalOrgId : '0',
                    staffManageGetchiefUserContent : [],
                }
            });
        }

        /*新增编辑员工提交*/
        let AddOrEditStaffModalSubmit = function(data){
            console.info(data)
            dispatch({
                type : addOrEditStaffModalType == 'add' ? 'staffManage/CreateStaff' :
                       addOrEditStaffModalType == 'edit' ? 'staffManage/UpdateStaff' :
                       addOrEditStaffModalType == 'modifyFunction' ? 'staffManage/ChangeStaffFunc' : '',
                payload : data
            })
        }

        /*添加校区modal打开*/
        let OpenSelectCampusModal = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    selectCampusModalVisible : true,
                }
            });
        }

        /*打开选择管辖校区modal*/
        let OpenCloseChooseMgrOrgModal = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    selectCampusModalVisible : !selectCampusModalVisible,
                }
            });
        }

        /*添加校区选择完毕点击保存*/
        let AfterSelectCampusModalSubmit = function(array){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    selectCampus : array,
                }
            });
            if(array.length > 0){
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        checkgxxq : true,
                    }
                });
            }else{
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        checkgxxq : false,
                    }
                });
            }
        }

         /*打开选择管辖部门modal*/
        let OpenCloseChooseDeptModal = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    selectDeptModalVisible : !selectDeptModalVisible,
                }
            });
        }

        /*添加部门选择完毕点击保存*/
        let AfterSelectDeptModalSubmit = function(array){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    selectDept : array,
                }
            });
            if(array.length > 0){
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        checkgxxq : true,
                    }
                });
            }else{
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        checkgxxq : false,
                    }
                });
            }
        }

        /*表格点击启用*/
        let StaffManageTableOnEnableStaff = function(data){
            if(data.length == 0){
                message.warn('启用时应至少选中一个员工');
            }else{
                let value = [];
                for(let i in data){
                    value.push(data[i].id);
                }
                dispatch({
                    type : 'staffManage/EnableOrFireOrDeleteStaff',
                    payload:staffManageType == 'hq' ? {
                        status : 1,
                        userIds : value.join(','),
                        staffManageType,
                    } : {
                        status : 1,
                        ids : value.join(','),
                        staffManageType,
                    }
                });
            }
        }

        /*员工表格点击停用*/
        let StaffManageTableOnFiredStaff = function(data){
            if(data.length == 0){
                message.warn('启用时应至少选中一个员工');
            }else{
                let value = [];
                for(let i in data){
                    value.push(data[i].id);
                }
                dispatch({
                    type : 'staffManage/EnableOrFireOrDeleteStaff',
                    payload:staffManageType == 'hq' ? {
                        status : 3,
                        userIds : value.join(','),
                        staffManageType,
                    } : {
                        status : 3,
                        ids : value.join(','),
                        staffManageType,
                    }
                });
            }
        }

        /*员工表格点击删除*/
        let StaffManageTableOnDeleteStaff = function(data){
            if(data.length == 0){
                message.warn('删除时应至少选中一项');
            }else{
                let value = [];
                for(let i in data){
                    value.push(data[i].id);
                }
                dispatch({
                    type : 'staffManage/EnableOrFireOrDeleteStaff',
                    payload:staffManageType == 'hq' ? {
                        status : 0,
                        userIds : value.join(','),
                        staffManageType,
                    } : {
                        status : 0,
                        ids : value.join(','),
                        staffManageType,
                    }
                });
            }
        }

    /*员工修改状态失败的员工会显示在此表单中*/
        /*分页等改变*/
        let StaffManageChangeStatusTableOnChange = function(pagination, filters, sorter) {
            dispatch({
                type: 'staffManage/updateState',
                payload: {
                    staffManageChangeStatusPageIndex : pagination.current-1,
                    staffManageChangeStatusPageSize : pagination.pageSize,
                },
            });
        };

        /*关闭modal*/
        let StaffManageChangeStatusFailedModalCancel = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    changeStatusFailedModalVisible : false,
                    staffManageChangeStatusPageIndex : 0,           //页码
                    staffManageChangeStatusPageSize : 10,           //每页条数
                    changeStatusOperateFailStaffNum : undefined,  //列表总数
                    staffManageChangeStatusTableContent : [],       //列表内容
                }
            });
        }

    /*改变tabs回调函数*/
    let StaffManageChangeTabsSelect = function(value){
        dispatch({
            type: 'staffManage/ShowStaffTable',
            payload: {
                pageIndex : 0,
                pageSize : staffManagePageSize,
                status : value,
                fastSearchContent : staffManageFastSearchContent,
                allOrganSearchContent
            },
        });
    }

    //
    function updateXiaoquFun(parmas){
        dispatch({
            type : 'staffManage/GetRoleSelect',
            payload : {
                orgId : parmas,
                isHq : '0'
            }
        })
        dispatch({
            type : 'staffManage/GetchiefUser',
            payload : {
                orgId : parmas,
                isHq : '0'
            }
        })
        dispatch({
            type : 'staffManage/updateState',
            payload : {
                addOrEditStaFFModalOrgId : parmas,
            }
        })

    }

     /*预览显示*/
    function handlePreview( file ){
        dispatch({
            type : 'staffManage/updateState',
            payload : {
                previewVisible : true,
                previewImage   : file.url || file.thumbUrl
            }
        })
    }

    /*取消预览*/
    function handleCancelImg(){
        dispatch({
            type : 'staffManage/updateState',
            payload : {
                previewVisible : false,
                previewImage   : ''
            }
        })
    }

    function updateMgrRange(e){
        if(e == '0' && selectCampus.length <= '0'){
            dispatch({
                type : 'staffManage/updateState',
                payload : {
                    checkgxxq : false
                }
            })
        }else if(e == '2' && selectCampus.length <= '0'){
            dispatch({
                type : 'staffManage/updateState',
                payload : {
                    checkgxxq : false
                }
            })
        }
        else{
            dispatch({
                type : 'staffManage/updateState',
                payload : {
                    checkgxxq : true
                }
            })
        }
    }
    /* 员工邀请 */
    function StaffManageTableInvitation(staffManageTableSelectedRowKeys) {
        if(staffManageTableSelectedRowKeys && staffManageTableSelectedRowKeys.length == 1) {
            dispatch({
                type: 'staffManage/queryYqCode',
                payload: {
                    userId: staffManageTableSelectedRowKeys[0],
                    type: 'YQ'
                }
            })
        }else {
            message.warning('邀请时请选择一个未激活员工')
        }
    }
    /* 打开关闭弹窗 */
    function cancelInvitionModal() {
        dispatch({
            type: 'staffManage/updateState',
            payload: {
                isInviteShow: false
            }
        })
    }
    /* 手机号改变 */
    function mobileChange(e) {
        if(e.target.value) {
            dispatch({
                type: 'staffManage/queryMaxEmpNo',
                payload: {
                    mobile: e.target.value
                }
            })
        }else {
            dispatch({
                type:'staffManage/updateState',
                payload: {
                    empNo: ''
                }
            })
        }
    }
    /*员工管理左边组织架构*/
    let staffManageListProps = {
        allOrganList,               //左边组织架构数据
        allOrganListLoading,        //左边组织架构是否加载中
        secondOrganArray,           //左边组织架构列表默认打开的二级菜单
        initSecondOrganArrayOpenTag,            //默认打开的节点

        OrganListOnExpend,          //左边组织架构列表节点展开事件
        OrganListClickTreeName,     //左边组织架构点击名称查询事件
    }

    /*员工管理右边table表格*/
    let staffManageRightTableProps = {
        staffManageType,                        //员工类型(总部hq/校区分部org)
        /*员工列表search*/
        staffTableType,                         //表格类型(使用中'1'/已停用'3')
        staffManageRoleSelectContent,           //表格搜索栏角色列表下拉数据
        staffManageFastSearchContent,           //员工管理查询条件
        staffManagePageSize,                    //页码
        staffManagePageIndex,                   //每页条数

        /*员工列表table*/
        staffManageTableLoading,                //表格加载状态
        staffManageTableTotal,                  //表格数据总数
        staffManageTableContent,                //表格数据所有内容
        staffManageSearchVisible,               //右边table列表搜索栏是否显示
        staffManageTableSelectedRowKeys,        //表格多选选中的数组
        staffManageTableSelectedRow,            //表格多选中的对象数组

        StaffManageTableOnChangePage,           //表格分页改变
        StaffManageTableRowSelectChange,        //多选框选择方法
        StaffManageTableOnCreateStaff,          //表格点击新增员工
        StaffManageTableOnEditStaff,            //表格点击编辑员工
        StaffManageTableOnFiredStaff,           //表格点击停用
        StaffManageTableOnEnableStaff,          //表格点击启用
        StaffManageTableOnDeleteStaff,          //表格点击删除
        StaffManageCheckOrgs,                   //表格点击所属机构下方数据时弹出并查看
        StaffManageSearchSubmit,                //员工管理点击查询
        StaffManageChangeTabsSelect,            //tab的onChange事件
        StaffManageTableInvitation,             //员工邀请
    }

    /*员工管理新增编辑员工modal*/
    let staffManageAddOrEditStaffProps = {
        staffManageType,
        staffManageRoleSelectContent,       //角色下拉数据
        staffManageGetchiefUserContent,     //汇报对象下拉数据
        staffList,                          //员工列表查询(总部汇报对象)

        addOrEditStaffModalType,            //新增编辑表单类型('add'/'edit'/'modifyFunction')
        addOrEditStaffModalVisible,         //新增编辑员工modal是否显示
        addOrEditStaffModalLoading,         //新增编辑员工表单加载状态
        addOrEditStaffModalButtonLoading,   //新增编辑员工modal按钮是否在加载状态
        addOrEditStaffModalData,            //编辑员工时回填数据
        addOrEditStaffModalLeaderSelect,    //通过摘要查询获取汇报对象下拉列表
        addOrEditStaffModalChooseOrgId,     //账号所属选中的校区ID
        addOrEditStaffModalWetherHead,      //所属部门如果是总部(true),用来判断管辖校区的显示内容

        AddOrEditStaffModalSubmit,          //新增编辑员工提交
        AddOrEditStaffModalCancel,          //新增编辑员工modal关闭

        selectCampusModalVisible,           //选择校区modal是否显示
        selectCampus,                       //默认添加的校区选项

        selectDeptModalVisible,            //选择部门modal是否显示
        selectDept,                        //默认添加的部门选项
        empNo,                             //员工工号
        mail,                              //员工邮箱

        OpenCloseChooseMgrOrgModal,         //打开选择管辖校区modal
        AfterSelectCampusModalSubmit,       //添加校区选择完毕点击保存
        OpenCloseChooseDeptModal,         //打开选择管辖部门modal
        AfterSelectDeptModalSubmit,       //添加部门选择完毕点击保存
        addOrEditStaFFModalOrgId,
        updateXiaoquFun,
        handlePreview,
        handleCancelImg,
        previewVisible,            //预览显示
        previewImage,              //预览图片
		checkgxxq,
        updateMgrRange,
        mobileChange,                     //手机号改变
    }

    /*员工修改状态失败的员工会显示在此表单中*/
    let staffManageChangeStatusFailedModalProps = {
        addOrEditStaffModalType,                        //新增编辑员工表单类型('add'/'edit'/'modifyFunction')
        changeStatusOperateAllStaffNum,                    //总共有多少个员工被改变了状态
        changeStatusFailedModalVisible,

        //员工需要交接任务列表
        staffManageChangeStatusPageIndex,               //页码
        staffManageChangeStatusPageSize,                //每页条数
        changeStatusOperateFailStaffNum,              //列表总数
        staffManageChangeStatusTableContent,            //列表内容

        StaffManageChangeStatusTableOnChange,           //列表分也等信息改变

        StaffManageChangeStatusFailedModalCancel,       //关闭modal
    }

    //校区选择框属性
    let TreeOrgCheckSelectProps = {
        headOrg : false,
        visible : checkOrgsModalVisible,
        onClose : CheckOrgsModalCancel,
        disabled : true,
        init_org_select: checkOrgsModalData,
    };
    /* 邀请注册登录 */
    let StaffManageInviteModalProps = {
        registerUrl, //邀请链接
        isInviteShow, //是否打开邀请弹窗
        cancelInvitionModal, // 关闭弹窗
    }

    return(
        <div className = { styles.staff_manage_all }>
            <Media query="(max-width: 1100px)">
                { matches => matches ?
                    <div className = { styles.staff_manage_left + ' ' + styles.staff_manage_left_s }>
                        <StaffManageLeftList {...staffManageListProps}/>
                    </div> :
                    <div className = { styles.staff_manage_left + ' ' + styles.staff_manage_left_l }>
                        <StaffManageLeftList {...staffManageListProps}/>
                    </div>
                }
            </Media>
            <Media query="(max-width: 1100px)">
                { matches => matches ?
                    <div className = { styles.staff_manage_right + ' ' + styles.staff_manage_right_s }>
                        <StaffManageRightTable {...staffManageRightTableProps}/>
                    </div> :
                    <div className = { styles.staff_manage_right + ' ' + styles.staff_manage_right_l }>
                        <StaffManageRightTable {...staffManageRightTableProps}/>
                    </div>
                }
            </Media>
            { addOrEditStaffModalVisible == true ? <StaffManageAddOrEditStaff {...staffManageAddOrEditStaffProps}/> : null }
            { changeStatusFailedModalVisible == true ? <StaffManageChangeStatusFailedModal {...staffManageChangeStatusFailedModalProps} /> : null }
            <TreeOrgCheckSelect { ...TreeOrgCheckSelectProps } />
            { isInviteShow ? <StaffManageInviteModal {...StaffManageInviteModalProps}/> : null }

        </div>
    );
}

function mapStateToProps({ staffManage }) {
  return { staffManage };
}

export default connect(mapStateToProps)(StaffManage);
