import React from 'react';
import { message , Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './HeadQuartersSetting.less';
import HeadQuartersSettingLeftMenu from '../../../components/system/head-quarters-setting/head-quarters-setting-left-menu/HeadQuartersSettingLeftMenu';
import RoleManage from '../../../components/system/head-quarters-setting/head-quarters-setting-right/role-manage/RoleManage';   //总部角色信息
import HeadDetail from '../../../components/system/head-quarters-setting/head-quarters-setting-right/head-detail/HeadDetail';   //总部信息
import Brand from '../../../components/system/head-quarters-setting/head-quarters-setting-right/brand/brand-main/BrandMain';    //品牌信息
import SecuritySettingsPage from '../security-settings/SecuritySettingsPage';
import DomainNameSetting from '../../../components/system/head-quarters-setting/head-quarters-setting-right/domain-name-setting/domain-name-setting-main/DomainNameSettingMain'; //域名设置
import StructureAndCourseware from '../../../components/system/head-quarters-setting/head-quarters-setting-right/structure-and-courseware/StructureAndCourseware';          //课件分类和组织架构
import AccountCard from '../account-card/AccountCard';                             //收付款账号
import LeadRuleSet from '../gong-hai-set/lead-record-no-rule/leadRecordNoRule';          //名单设置
import LeadsDup from '../../../components/system/head-quarters-setting/head-quarters-setting-right/leads-dup/LeadsDup'
import SecondSource from '../../../components/system/head-quarters-setting/head-quarters-setting-right/second-source/SecondSource'
import FirstSource from '../../../components/system/head-quarters-setting/head-quarters-setting-right/first-source/FirstSource'
import Finance from '../../../components/system/head-quarters-setting/head-quarters-setting-right/finance/Finance'
import Filelog from '../file-log/Filelog' // 日志
/*!!!所有dispatch方法均在对应的component中执行!!!*/
/*总部设置*/
function HeadQuartersSetting({ dispatch, headQuartersSetting }) {

    let {

        /*左边菜单*/
        leftMenu,                           //左边菜单项
        chooseMenuItem,                     //选中的菜单项

        /*右侧内容*/
        rightLoading,                       //所有右侧项公用加载状态

        /*总部角色*/
        allRoleList,                        //页面左边角色列表内容
        allRoleListLoading,                 //页面左边角色列表是否加载中

        allFunctionList,                    //页面右边功能列表内容
        secondFunctionArray,                //页面右边默认打开的二级菜单的菜单列表数组
        roleFunctionArray,                  //每个角色所拥有的权限ID数组(选中)
        allFunctionListLoading,             //页面右边功能列表是否加载中
        wetherRoleItemChooseIndex,          //角色被选中查看的索引
        roleClickedName,                    //被选中角色名字(用于显示于权限右边)

        roleProperty,                       //角色属性 包括id,name等
        roleListItemIndex,                  //角色列表项重命名项索引
        createingRoleVisible,               //是否在新建角色名称时(判断是否动态添加一个输入框，false不在新建状态)
        createNameOrRenameContent,          //角色名称新建或重命名已有角色名称时输入框内的值
        saveRoleFuncButtonLoading,          //点击保存权限按钮加载状态

        /*总部信息*/
        headDetailData,                     //总部信息数据
        headDetailSubmitButtonLoading,      //总部信息提交按钮加载状态

        /*品牌信息*/
        wetherGetBrandStatus,               //是否获取到品牌状态
        brandStep,                          //品牌信息状态步数(必须是num,0,1,2)
        brandData,                          //品牌审核和成功后的回显品牌信息
        brandSubmitButtonLoading,           //提交审核按钮加载状态

        /*域名设置*/
        domainStep,                             //步骤条步数(必须是num)
        wetherGetDomainStatus,                  //获取租户申请状态是否成功(失败则使页面变为空页面)
        domainName,                             //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
            /*域名设置 第一步 申请*/
            domainFirstStepSubmitButtonLoading, //申请使用按钮加载状态

            /*域名设置 第四步 各种设置*/
            domainForthStepBackgroundImg,       //用户选择或回填的背景图
            domainForthStepLogoImg,             //用户选择或回填的logo图片
            domainForthStepName,                //用户输入或回填的商户姓名
			domainForthStepTitle,
            domainForthStepSubmitButtonLoading, //保存设置按钮加载状态

        treeData,                               //数据
        treeLimit,                              //限制层数
        treeType,                               //类型('structure'/'courseware')

        /*新增编辑状状结构(课件分类，组织架构)modal*/
        addOrEditTreeModalType,                 //modal类型create/create_son/update/delete
        addOrEditTreeModalVisible,              //modal是否显示
        addOrEditTreeModalLoading,              //modal加载状态
        addOrEditTreeModalButtonLoading,        //modal按钮加载状态
        addOrEditTreeModalData,                 //modal编辑时回填数据

        // 查重规则
        confArr,
        dupValue,
        allConf,

        // 来源类别
        deptList,     // 部门下拉
        deptId,       // 默认部门
        secondList,   // 来源类别列表
        secondLoading,

        // 市场渠道
        deptIdFirst,
        firstList,          // 市场渠道列表
        firstLoading,
        firstCurrentRow,
        // 二级渠道
        firstSubList,          // 二级渠道列表
        firstSubLoading,
        hasAction,          // 操作权限

        // 财务设置
        projectCurrentRow,
        // 支出类别
        projectList,              // 支出类别列表
        projectLoading,
        // 支出项目
        projectSubList,          // 支出项目列表
        projectSubLoading,

        // 设置
        financeLoading,
        financeSwitch,
        financeDate,
	} = headQuartersSetting;

    /*!!!所有dispatch方法均在对应的component中执行!!!*/
    function dp(path,obj){
        dispatch({
            type : path,
            payload : obj
        })
    }

    /*左边菜单项属性*/
    let HeadQuartersSettingLeftMenuProps = {
        dp,                                 //dispatch方法
        leftMenu,                           //左边菜单项
    }

    /*总部角色信息属性*/
    let RoleManageProps = {
        dp,                                 //dispatch方法
        allRoleList,                        //页面左边角色列表内容
        allRoleListLoading,                 //页面左边角色列表是否加载中

        allFunctionList,                    //页面右边功能列表内容
        secondFunctionArray,                //页面右边默认打开的二级菜单的菜单列表数组
        roleFunctionArray,                  //每个角色所拥有的权限ID数组(选中)
        allFunctionListLoading,             //页面右边功能列表是否加载中
        wetherRoleItemChooseIndex,          //角色被选中查看的索引
        roleClickedName,                    //被选中角色名字(用于显示于权限右边)

        roleProperty,                       //角色属性 包括id,name等
        roleListItemIndex,                  //角色列表项重命名项索引
        createingRoleVisible,               //是否在新建角色名称时(判断是否动态添加一个输入框，false不在新建状态)
        createNameOrRenameContent,          //角色名称新建或重命名已有角色名称时输入框内的值
        saveRoleFuncButtonLoading,          //点击保存权限按钮加载状态
    }

    /*总部信息属性*/
    let HeadDetailProps = {
        dp,                                 //dispatch方法
        headDetailData,                     //总部信息数据
        headDetailSubmitButtonLoading,      //总部信息提交按钮加载状态
    }

    /*品牌信息属性*/
    let BrandProps = {
        dp,                                 //dispatch方法
        rightLoading,                       //所有右侧项公用加载状态
        wetherGetBrandStatus,               //是否获取到品牌状态
        brandStep,                          //品牌信息状态步数(必须是num,0,1,2)
        brandData,                          //品牌审核和成功后的回显品牌信息
        brandSubmitButtonLoading,           //提交审核按钮加载状态
    }

    /*域名设置属性*/
    let DomainNameSettingProps = {
        dp,                                     //dispatch方法
        domainStep,                             //步骤条步数(必须是num)
        wetherGetDomainStatus,                  //获取租户申请状态是否成功(失败则使页面变为空页面)
        domainName,                             //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
            /*域名设置 第一步 申请*/
            domainFirstStepSubmitButtonLoading, //申请使用按钮加载状态

            /*域名设置 第四步 各种设置*/
            domainForthStepBackgroundImg,       //用户选择或回填的背景图
            domainForthStepLogoImg,             //用户选择或回填的logo图片
            domainForthStepName,                //用户输入或回填的商户姓名
			domainForthStepTitle,
            domainForthStepSubmitButtonLoading, //保存设置按钮加载状态
    }

    /*课件分类和组织架构属性*/
    let StructureAndCoursewareProps = {
        dp,                                     //dispatch方法
        treeData,                               //数据
        treeLimit,                              //限制层数
        treeType,                               //类型('structure'/'courseware')

        /*新增编辑状状结构(课件分类，组织架构)modal*/
        addOrEditTreeModalType,                 //modal类型create/create_son/update/delete
        addOrEditTreeModalVisible,              //modal是否显示
        addOrEditTreeModalLoading,              //modal加载状态
        addOrEditTreeModalButtonLoading,        //modal按钮加载状态
        addOrEditTreeModalData,                 //modal编辑时回填数据
    }
    //名单分配规则
    let leadRuleSetProps = {
        dp,                                     //dispatch方法

    }

    /** 保存查重规则 */
    function saveLeads(values){
        dispatch({
            type: 'headQuartersSetting/saveLeadsDup',
            payload: {
                ...values
            }
        })
    }

    let LeadsDupProps = {
        confArr,
        dupValue,
        allConf,

        saveLeads       //保存查重规则
    }

    /** 选择部门 */
    function deptChange(value){
        dispatch({
            type: 'headQuartersSetting/updateState',
            payload: {
                deptId: value
            }
        })
        dispatch({
            type: 'headQuartersSetting/getSecondList',
            payload: {
                dictKey: 'firstChannel',
                deptId: value
            }
        })
    }

    /** 保存来源类别 */
    function saveSecondSource(name, callback, item){
        if(name && name.length > 10){
            message.error('最多10个字')
            return
        }
        const timestamp = (new Date()).valueOf()
        if(item && item.id){
            // 编辑
            dispatch({
                type: 'headQuartersSetting/editSource',
                payload: {
                    deptId,
                    type: 'item',       //sub下级，item同级
                    text: name,
                    value: item.key,
                    id: item.id,
                    callback
                }
            })
        } else {
            // 新增
            dispatch({
                type: 'headQuartersSetting/addSource',
                payload: {
                    deptId,
                    type: 'item',       //sub下级，item同级
                    text: name,
                    value: String(timestamp),
                    callback
                }
            })
        }
    }

    /** 删除来源类别 */
    function removeSecondSource(row, callback){
        dispatch({
            type: 'headQuartersSetting/deleteSource',
            payload: {
                deptId,
                type: 'item',       //sub下级，item同级
                id: row.id,
                callback
            }
        })
    }

    // 来源类别
    let secondProps = {
        deptList,     // 部门下拉
        deptId,       // 默认部门
        secondList,   // 来源类别列表
        secondLoading,
        hasAction,          // 操作权限

        saveSecondSource,   // 保存修改
        removeSecondSource, // 删除来源类别
        deptChange,         // 选择部门
    }
/**************************************市场渠道*****************************************/
    /** 选择部门 */
    function deptFirstChange(value){
        dispatch({
            type: 'headQuartersSetting/updateState',
            payload: {
                deptIdFirst: value
            }
        })
        dispatch({
            type: 'headQuartersSetting/getFirstList',
            payload: {
                dictKey: 'secondChannel',
                deptId: value
            }
        })
    }

    /** 保存修改市场渠道 */
    function saveFirstSource(name, callback, item){
        if(name && name.length > 10){
            message.error('最多10个字')
            return
        }
        const timestamp = (new Date()).valueOf()
        if(item && item.id){
            // 编辑
            dispatch({
                type: 'headQuartersSetting/editFirstSource',
                payload: {
                    deptId: deptIdFirst,
                    type: 'item',       //sub下级，item同级
                    text: name,
                    value: item.key,
                    id: item.id,
                    callback
                }
            })
        } else {
            // 新增
            dispatch({
                type: 'headQuartersSetting/addFirstSource',
                payload: {
                    deptId: deptIdFirst,
                    type: 'item',       //sub下级，item同级
                    text: name,
                    value: String(timestamp),
                    callback
                }
            })
        }
    }

    /** 删除市场渠道 */
    function removeFirstSource(row, callback){
        dispatch({
            type: 'headQuartersSetting/deleteFirst',
            payload: {
                deptId: deptIdFirst,
                type: 'item',       //sub下级，item同级
                id: row.id,
                callback
            }
        })
    }

/****************二级渠道***************/
    /** 改变当前行 */
    function firstChange(row, index){
        dispatch({
            type: 'headQuartersSetting/updateState',
            payload: {
                firstSubList: row.subList,
                firstCurrentRow: row,
                firstCurrentIndex: index
            }
        })
    }

    /** 保存修改二级渠道 */
    function saveFirstSubSource(name, callback, item){

        if(name && name.length > 20){
            message.error('最多20个字')
            return
        }
        const timestamp = (new Date()).valueOf()
        if(item && item.id){
            // 编辑
            dispatch({
                type: 'headQuartersSetting/editFirstSource',
                payload: {
                    deptId: deptIdFirst,
                    type: 'sub',       //sub下级，item同级
                    text: name,
                    value: item.key,
                    id: item.id,
                    callback
                }
            })
        } else {
            // 新增
            dispatch({
                type: 'headQuartersSetting/addFirstSource',
                payload: {
                    deptId: deptIdFirst,
                    type: 'sub',       //sub下级，item同级
                    text: name,
                    value: String(timestamp),
                    dictItemId: firstCurrentRow.id,
                    callback
                }
            })
        }
    }

    /** 删除二级渠道 */
    function removeFirstSubSource(row, callback){
        dispatch({
            type: 'headQuartersSetting/deleteFirst',
            payload: {
                deptId: deptIdFirst,
                type: 'sub',       //sub下级，item同级
                id: row.id,
                callback
            }
        })
    }

    // 市场渠道
    let firstProps = {
        deptList,               // 部门下拉
        deptIdFirst,
        hasAction,          // 操作权限

        deptFirstChange,
        // 市场渠道
        firstList,              // 市场渠道列表
        firstLoading,

        saveFirstSource,        // 保存修改市场渠道
        removeFirstSource,      // 删除市场渠道
        firstChange,            // 改变当前行

        // 二级渠道
        firstSubList,          // 二级渠道列表
        firstSubLoading,

        saveFirstSubSource,    // 保存修改二级渠道
        removeFirstSubSource,  // 删除二级渠道
    }

    /********************************* 财务设置start *********************************************/
    /** 保存修改支出类别 */
    function saveProject(name, callback, item){
        if(name && name.length > 10){
            message.error('最多10个字')
            return
        }
        if(item && item.id){
            // 编辑
            dispatch({
                type: 'headQuartersSetting/editFinanceSet',
                payload: {
                    status: '1', // 1编辑，0删除
                    name,
                    id: item.id,
                    callback
                }
            })
        } else {
            // 新增
            dispatch({
                type: 'headQuartersSetting/addFinanceSet',
                payload: {
                    name,
                    projectType: '1',
                    callback
                }
            })
        }
    }

    /** 删除支出类别 */
    function removeProject(row, callback){
        dispatch({
            type: 'headQuartersSetting/editFinanceSet',
            payload: {
                status: '0', // 1编辑，0删除
                id: row.id,
                callback
            }
        })
    }


     /** 改变当前行 */
     function projectChange(row, index){
        dispatch({
            type: 'headQuartersSetting/updateState',
            payload: {
                projectSubList: row.items || [],
                projectCurrentRow: row,
                projectCurrentIndex: index
            }
        })
    }

    /** 保存修改支出项目 */
    function saveProjectSub(name, callback, item){
        if(name && name.length > 10){
            message.error('最多10个字')
            return
        }
        if(item && item.id){
            // 编辑
            dispatch({
                type: 'headQuartersSetting/editItem',
                payload: {
                    status: '1',    // 1编辑，0删除
                    name,
                    id: item.id,
                    callback
                }
            })
        } else {
            // 新增
            dispatch({
                type: 'headQuartersSetting/addItem',
                payload: {
                    name,
                    projectId: projectCurrentRow.id,
                    callback
                }
            })
        }
    }

    /** 删除支出项目 */
    function removeProjectSub(row, callback){
        dispatch({
            type: 'headQuartersSetting/editItem',
            payload: {
                status: '0',    // 1编辑，0删除
                id: row.id,
                callback
            }
        })
    }
    /********************************* 财务设置end *********************************************/

    // 财务设置
    let financeProps = {
        dp,
        // 支出类别
        projectList,              // 支出类别列表
        projectLoading,

        saveProject,              // 保存修改支出类别
        removeProject,            // 删除支出类别
        projectChange,            // 改变当前行

        // 支出项目
        projectSubList,          // 支出项目列表
        projectSubLoading,

        saveProjectSub,           // 保存修改支出项目
        removeProjectSub,         // 删除支出项目

        // 设置
        financeLoading,
        financeSwitch,
        financeDate,
    }

    return(
        <div className = { styles.all }>
            <div className = { styles.left }>
                <HeadQuartersSettingLeftMenu {...HeadQuartersSettingLeftMenuProps}/>
            </div>
            <div className = { styles.right }>
                <div className = { styles.right_title }>
                    { chooseMenuItem.name }
                </div>
                {/*角色信息内部有滚动条，外部不需要滚动条*/}
                <div className = { styles.right_content }
                    style = {
                        chooseMenuItem.id == 'role' ? { overflowY : 'hidden' , overflowX : 'auto' } :
                        chooseMenuItem.id == 'accounts' ? { overflow : 'hidden' } : null }>
                    <Spin spinning = { rightLoading }>
                        { chooseMenuItem.id == 'role' ? <RoleManage {...RoleManageProps}/> : null }
                        { chooseMenuItem.id == 'head_detail' ? <HeadDetail {...HeadDetailProps}/> : null }
                        { chooseMenuItem.id == 'brand' ? <Brand {...BrandProps}/> : null }
                        { chooseMenuItem.id == 'security_setting' ? <SecuritySettingsPage/> : null }
                        { chooseMenuItem.id == 'courseware' || chooseMenuItem.id == 'structure' ? <StructureAndCourseware {...StructureAndCoursewareProps}/> : null }
                        { chooseMenuItem.id == 'domain' ?  <DomainNameSetting {...DomainNameSettingProps}/> : null }
                        { chooseMenuItem.id == 'leadDup' && <LeadsDup {...LeadsDupProps} /> }
                        { chooseMenuItem.id == 'secondSource' && <SecondSource {...secondProps} /> }
                        { chooseMenuItem.id == 'firstSource' && <FirstSource {...firstProps} /> }
                        { chooseMenuItem.id == 'finance' && <Finance {...financeProps} /> }
                    </Spin>
                    {/*收付款账号页面比较特殊，由于分页器固定需要绝对定位，所以整个页面不能放在Spin中*/}
                    { chooseMenuItem.id == 'accounts' ?  <AccountCard/> : null }
                    { chooseMenuItem.id == 'leadRecycle' ? <LeadRuleSet /> : null}               
                    { chooseMenuItem.id == 'filelog' ? <Filelog />: null }
                    <div className = {styles.hidden}></div>
                    
                </div>
            </div>
        </div>
    );
}

function mapStateToProps({ headQuartersSetting }) {
  return { headQuartersSetting };
}

export default connect(mapStateToProps)(HeadQuartersSetting);
