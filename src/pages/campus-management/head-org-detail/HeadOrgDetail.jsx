import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import Media from 'react-media';
import styles from './HeadOrgDetail.less';
import HeadOrgDetailLeftFramework from '../../../components/campus-management/head-org-detail/head-org-detail-left-framework/HeadOrgDetailLeftFramework';
import HeadOrgDetailRightTable from '../../../components/campus-management/head-org-detail/head-org-detail-right-table/HeadOrgDetailRightTable';
import HeadOrgDetailModal from '../../../components/campus-management/head-org-detail/head-org-detail-detail-modal/HeadOrgDetailModal';
import HeadOrgDetailEditModal from '../../../components/campus-management/head-org-detail/head-org-detail-edit-modal/HeadOrgDetailEditModal';
import HeadOrgDetailPackageModal from '../../../components/campus-management/head-org-detail/head-org-detail-package-modal/HeadOrgDetailPackageModal';
import CoursewareSetPersonModal from '../../../components/campus-management/head-org-detail/head-org-detail-detail-modal/service-manage/coursewareSetPersonModal';

function HeadOrgDetail({ dispatch, headOrgDetail }) {

    let {
        /*左侧组织架构*/
        leftFrameworkData,                      //组织架构数据
        leftFrameworkLoading,                   //加载状态
        leftFrameworkOpenTag,                   //打开的节点，默认打开架构二级菜单数组['a','b']
        leftFrameworkInitOpenTag,               //默认打开的节点
        leftFrameworkSearchContent,             //组织架构搜索条件

        /*右侧列表*/
            /*搜索内容*/
            rightFastSearchContent,                 //快捷搜索内容

            /*列表内容*/
            rightTablePageIndex,                    //页码
            rightTablePageSize,                     //每页条数
            rightTableLoading,                      //表格加载状态
            rightTableTotal,                        //表格数据总数
            rightTableData,                         //表格数据所有内容
            rightTableOrgType,                      //校区类型

        /*套餐modal*/
        packageModalData,                       //套餐数据
        packageModalVisible,                    //是否显示
        packageModalType,                       //表单类型(查看check/编辑edit)
        packageModalLoading,                    //表单加载
        packageModalButtonLoading,              //表单按钮加载

        /*详情侧滑框*/
        detailModalVisible,                     //是否显示
        detailModalTabLoading,                  //加载状态
        detailModalContent   ,                  //单条数据信息
        /*编辑modal*/
        editModalVisible,                       //modal是否显示
        editModalLoading,                       //modal加载状态
        editModalButtonLoading,                 //modal按钮加载状态

        /*基本信息tab页*/
        baseInformationData,                    //基本信息数据

        /*套餐信息tab页*/
        packageInfoData,                        //列表内容

        /*服务管理tab页*/
        serviceInfoData,                        //服务管理列表数据
        courseSetPersonList,   //课件可见人列表
        courseSetPersonVisible, //是否可见
        courseSetPersonLoading, //按钮加载状态
        courseSetPersonModalLoading,

	} = headOrgDetail

    //封装dispatch
    function dp(path,obj){ dispatch({ type : path , payload : obj }) };

    //树状结构节点展开事件
    function LeftFrameworkOnExpend(expandedKeys){
        dp('headOrgDetail/updateState' , { leftFrameworkOpenTag : expandedKeys })
    }

    //点击树节点名称事件
    function LeftFrameworkClickTreeName(deptId,e){
        dp('headOrgDetail/GetRightTableList',{
            pageIndex : 0,
            pageSize : rightTablePageSize,
            leftFrameworkSearchContent : { deptId : deptId[0] != leftFrameworkInitOpenTag[0] ? deptId[0] : undefined },       //点击最外层节点不传值
            rightFastSearchContent
        })
    }

    //点击搜索
    function RightOnSearch(data){
        dp('headOrgDetail/GetRightTableList' , {
            pageIndex : 0,
            pageSize : rightTablePageSize,
            leftFrameworkSearchContent,
            rightFastSearchContent : data
        })
    }

    //分页onChange事件
    function RightTablePageOnChange(pageIndex,pageSize){
        dp('headOrgDetail/GetRightTableList' , {
            pageIndex : pageIndex - 1,
            pageSize : pageSize,
            leftFrameworkSearchContent,
            rightFastSearchContent
        })
    }

    //查看套餐(需要重新获取套餐信息，以备校区编辑套餐后有数据变动，比如说库存)
    function RightTableOpenPackageModal(type){
        //由于进入页面即获取套餐信息，所以在获取套餐信息方法中不能将modal打开，所以在此单独打开
        dp('headOrgDetail/updateState',{ packageModalVisible : true , packageModalType : type });
        dp('headOrgDetail/GetPackage');
    }

    //打开套餐编辑modal
    function OpenPackageModal(type){
        //由于进入页面即获取套餐信息，所以在获取套餐信息方法中不能将modal打开，所以在此单独打开
        dp('headOrgDetail/updateState',{ packageModalVisible : true , packageModalType : type })
        dp('headOrgDetail/GetPackage');
    }

    //分配套餐提交
    function PackageModalSubmit(data){
        dp('headOrgDetail/PackageModalSubmit',data)
    }

    //套餐modal关闭
    function PackageModalClose(){ dp('headOrgDetail/updateState',{ packageModalVisible : false }) }

    //点击校区名称获取详情并且打开左划框(请求三个接口，详情，套餐，服务管理)
    function RightTableOpenDetail(item){
        dp('headOrgDetail/RightTableOpenDetail',{ tenantId : item.tenantId , orgId : item.orgId   })
        dp('headOrgDetail/updateState',{ detailModalContent : item })
    }
    //关闭详情框
    function HeadOrgDetailModalClose(){
        dp('headOrgDetail/updateState',{
            detailModalVisible : false ,
            detailModalContent : {}
        })
    }

    //详情框内点击编辑
    function HeadOrgDetailModalEdit(){ dp('headOrgDetail/updateState',{ editModalVisible : true }) }

    //编辑提交
    function EditModalSubmit(data){ dp('headOrgDetail/EditModalSubmit',{ ...data , detailModalVisible : true }) }

    //关闭编辑modal
    function EditModalClose(){ dp('headOrgDetail/updateState',{ editModalVisible : false }) }

    //校区服务管理开关onChange事件
    function ServiceSwitchOnChange(item,e,type){
        if(baseInformationData && !!baseInformationData.orgId && !!baseInformationData.tenantId){
            if(type=='confValue'){
                dp('headOrgDetail/ServiceSwitchOnChange',{
                    tenantId : baseInformationData.tenantId,
                    orgId : baseInformationData.orgId,
                    confKey : 'courseware',
                    confValue : item.confValue == '1' ? '0' : '1',
                })
            }else if(type=='print'){
                dp('headOrgDetail/ServiceSwitchOnChange',{
                    tenantId : baseInformationData.tenantId,
                    orgId : baseInformationData.orgId,
                    confKey : 'print',
                    confValue : e==false ? '2' : '1',
                })
            }

        }else{
            return message.error('校区基本信息查询失败，请重新点击校区名称获取信息');
        }
    }
    //课件课件人设置
    function coursewareSetChange(){
        dp('headOrgDetail/updateState',{
            courseSetPersonVisible : true ,
            courseSetPersonModalLoading :true,
        })
        dp('headOrgDetail/orgUserQuery',{
            pageIndex : 0,
            pageSize : 1000,
            status : '1',
            init : true,
            orgId : detailModalContent.orgId

        })
    }
    //课件可见人取消
    function cancelCourseSetPerson(){
        dp('headOrgDetail/updateState',{
            courseSetPersonVisible : false ,
        })
    }

    //课件选择确认
    function confirmCourseSetPerson(value){
        value.orgId = detailModalContent.orgId;
        value.tenantId = detailModalContent.tenantId;
        dp('headOrgDetail/CourseSetPersonUpdate',{ ...value })

        dp('headOrgDetail/updateState',{ courseSetPersonLoading : true })
    }
    /*左侧组织架构属性*/
    let HeadOrgDetailLeftFrameworkProps = {
        leftFrameworkData,                      //组织架构数据
        leftFrameworkLoading,                   //加载状态
        leftFrameworkOpenTag,                   //打开的节点，默认打开架构二级菜单数组['a','b']
        leftFrameworkInitOpenTag,               //默认打开的节点

        LeftFrameworkOnExpend,                  //树状结构节点展开事件
        LeftFrameworkClickTreeName,             //点击树节点名称事件
    }

    /*右侧列表数据*/
    let HeadOrgDetailRightTableProps = {
        packageModalData,                       //套餐数据

        /*搜索内容*/
        RightOnSearch,                      //点击搜索

        /*列表内容*/
        rightTablePageIndex,                //页码
        rightTablePageSize,                 //每页条数
        rightTableLoading,                  //表格加载状态
        rightTableTotal,                    //表格数据总数
        rightTableData,                     //表格数据所有内容
        rightTableOrgType,                  //校区类型
        RightTablePageOnChange,             //分页onChange事件
        RightTableOpenPackageModal,         //查看套餐
        RightTableOpenDetail,               //点击校区名称获取详情并且打开左划框
    }

    /*套餐modal属性*/
    let HeadOrgDetailPackageModalProps = {
        baseInformationData,                    //基本信息数据(套餐分配提交时需要基本信息中该校区的tenantId和orgId)
        packageModalData,                       //套餐数据
        packageModalVisible,                    //是否显示
        packageModalType,                       //表单类型(查看check/编辑edit)
        packageModalLoading,                    //表单加载
        packageModalButtonLoading,              //表单按钮加载

        PackageModalSubmit,                     //分配套餐提交
        PackageModalClose,                      //modal关闭
    }

    /*详情侧滑框属性*/
    let HeadOrgDetailModalProps = {
        detailModalVisible,                     //是否显示
        detailModalTabLoading,                  //加载状态
        rightTableOrgType,                      //校区类型
        HeadOrgDetailModalEdit,                 //详情框内点击编辑
        HeadOrgDetailModalClose,                //关闭详情框

        /*基本信息tab页*/
        baseInformationData,                    //基本信息数据

        /*套餐信息tab页*/
        packageInfoData,                        //列表内容
        OpenPackageModal,                       //打开套餐编辑modal

        /*服务管理tab页*/
        serviceInfoData,                        //服务管理列表数据
        ServiceSwitchOnChange,                  //开关onChange事件
        coursewareSetChange,                    //课件可见人设置
    }

    /*详情编辑modal属性*/
    let HeadOrgDetailEditModalProps = {
        baseInformationData,                    //基本信息数据
        editModalVisible,                       //modal是否显示
        editModalLoading,                       //modal加载状态
        editModalButtonLoading,                 //modal按钮加载状态
        EditModalSubmit,                        //编辑提交
        EditModalClose,                         //关闭编辑modal
    }

    //课件可见人设置
    let CoursewareSetPersonModalProps  ={
        courseSetPersonList,   //课件可见人列表
        courseSetPersonVisible, //是否可见
        courseSetPersonLoading, //按钮加载状态
        courseSetPersonModalLoading,
        cancelCourseSetPerson, //取消
        confirmCourseSetPerson, //确认
    }
    return(
        <div className = { styles.all }>
            <Media query="(max-width: 1100px)">
                { matches => matches ?
                    <div className = { styles.left + ' ' + styles.left_s }>
                        <HeadOrgDetailLeftFramework {...HeadOrgDetailLeftFrameworkProps}/>
                    </div> :
                    <div className = { styles.left + ' ' + styles.left_l }>
                        <HeadOrgDetailLeftFramework {...HeadOrgDetailLeftFrameworkProps}/>
                    </div>
                }
            </Media>
            <Media query="(max-width: 1100px)">
                { matches => matches ?
                    <div className = { styles.right + ' ' + styles.right_s }>
                        <HeadOrgDetailRightTable {...HeadOrgDetailRightTableProps}/>
                    </div> :
                    <div className = { styles.right + ' ' + styles.right_l }>
                        <HeadOrgDetailRightTable {...HeadOrgDetailRightTableProps}/>
                    </div>
                }
            </Media>
            <HeadOrgDetailModal {...HeadOrgDetailModalProps}/>
            { !!editModalVisible ? <HeadOrgDetailEditModal {...HeadOrgDetailEditModalProps}/> : null }
            { !!packageModalVisible ? <HeadOrgDetailPackageModal {...HeadOrgDetailPackageModalProps}/> : null }
            { !!courseSetPersonVisible ? <CoursewareSetPersonModal { ...CoursewareSetPersonModalProps }/>: null}
        </div>
    );
}

function mapStateToProps({ headOrgDetail }) {
  return { headOrgDetail };
}

export default connect(mapStateToProps)(HeadOrgDetail);
