/**
 * Created by zhaosi on 2017/6/27.
 */

import React from 'react';

import moment from 'moment';
import { Button , Form , Input , Tabs , Select , Icon , Dropdown , Menu , Popconfirm , Popover , Radio } from 'antd';
import  styles  from './StuDetail.less';
import { NewModal } from '../../common/new-component/NewComponent';

import ReservedsessionTab from '../stuManagement-Detail/ReservedsessionTab';                     //已预约课时
import StudetailTab       from '../stuManagement-Detail/StudetailTab'
import SpenthourTab       from '../stuManagement-Detail/SpenthourTab'                            //已消耗课时
import VipCardTab         from '../stuManagement-Detail/VipCardTab'                              //会员卡
import ContractTab        from '../stuManagement-Detail/ContractTab';                            //合同
import OfflineTab         from '../stuManagement-Detail/OfflineTab'                              //预约试听
import ParentTab          from '../stuManagement-Detail/ParentTab'                               //预约试听
import VisitplanTab       from '../stuManagement-Detail/VisitplanTab'
import FollowRecordList   from '../stuManagement-Detail/StuManageFollowRecord/FollowRecordList'  //跟进记录
import AddFollowRecord    from '../stuManagement-Detail/StuManageFollowRecord/AddFollowRecord'   //增加跟进记录
import ProductionTab      from '../stuManagement-Detail/ProductionTab'
import AttendclassTab     from '../stuManagement-Detail/AttendclassTab'
import OrderClassTab      from '../stuManagement-Detail/OrderClassTab'                           //约课记录列表

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

function StuDetail ({

	isStuDetailVisible,
    closableVisible,
    onModalOK,
    onCancelModal,
    studentDetailInfo,

    StuDetailModalTabChange,  //Tab点击选取
    stuDetailMoreMenuChoose,  //编辑点击转给他人
    edtionStu,                //编辑学员

    changeTableTab,

    reservedsessionLoading,
    reservedsessionList,
	reservedsessionResultCount,
	reservedsessionPageIndex,
	reservedsessionPageSize,
	reservedsessionPageSizeChange,
	reservedsessionPageIndexChange,

	/*已消耗课时列表*/
	spenthourTabLoading,
	spenthourTabList,
	spenthourTabResultCount,
	spenthourTabPageSize,
	spenthourTabPageIndex,
	spenthourTabPageIndexChange,

	/*已消耗课时列表*/
    cardTabList,                                         //会员卡列表

	/*合同所需参数*/
	contractOrderList,
	contractOrderLoading,
	contractOrderResultCount,
	contractOrderPageIndex,
	contractOrderPageSize,
	contractOrderPageSizeChange,
	contractOrderPageIndexChange,

	addContractOrder,
	/*合同所需参数*/

	/*约课记录参数*/
	orderClassList,
	orderClassLoading,
	orderClassResultCount,
	orderClassPageIndex,
	orderClassPageSize,

	orderClassPageIndexChange,
	/*约课记录参数*/

    leadsFollowReservationContentLoading,                //当前预约试听loading状态
    leadsFollowReservationContent,                       //当前leads预约试听list
    leadsFollowReservationScrollFinish,                  //滚动加载是否完成(即数据加载完毕)
    leadsFollowReservationNum ,                          //预约试听条数
    leadsFollowReservationPageIndex ,                    //预约试听页码
    leadsFollowReservationPageSize ,                     //预约试听每页条数

    LeadsFollowReservationScrollBottom,                  //leads预约试听已经滑动到最底部
    LeadsFollowReservationAddOrEditItem,                 //leads预约试听新增编辑
    LeadsFollownewReservationChangeItemStatus,           //leads预约试听改变状态

    parenttabList,                                       //学员家长列表
    addParent,                                           //添加家长
    parenttabnum,
    parentListArr,                                       //学员家长Id，姓名

    leadsFollowVisitingPlanContentLoading,              //当前到访计划loading状态
    leadsFollowVisitingPlanContent,                     //当前leads到访计划list
    leadsFollowVisitingPlanScrollFinish,                //滚动加载是否完成(即数据加载完毕)

    LeadsFollowVisitingPlanScrollBottom,                //leads到访计划已经滑动到最底部
    LeadsFollowVisitingPlanAddOrEditItem,               //leads到访计划新增编辑
    LeadsFollowVisitingPlanChangeItemStatus,            //leads到访计划改变状态



    saleStatusList ,                                    //跟进状态列表
    LeadsFollowFollowRecordAdd,                         //新增跟进记录
    leadsFollowWay,                                     //跟进方式列表

    leadsFollowFollowRecordContentLoading,              //当前跟进记录loading状态
    leadsFollowFollowRecordContent,                     //当前leads跟进记录list
    leadsFollowFollowRecordScrollFinish,                //滚动加载是否完成(即数据加载完毕)
    leadsFollowFollowRecordNum,

    LeadsFollowFollowRecordScrollBottom,                //leads跟进记录已经滑动到最底部
    LeadsFollowFollowRecordDeleteItem,                  //leads跟进记录删除

    ProductionList,                                     //作品列表
    updateStudentWork,                                  //修改作品
    deleteWork,                                         //删除作品
    ProductionNum,
    ProductionPageIndex,
    ProductionPageSize,
    uploadWorks,

    leadsFollowVisitingPlanNum ,
    reservedsessionListNum,
    spenthourTabListNum,
    cardTabListNum,

  //报班信息
    AttendclassTabList,
    toJoinClass,            //报班
    classInfoLeft,
    classInfoTotal,
    AttendclassNum,
    AttendclassPageIndex,
    AttendclassPageSize,
    AttendclasspageSizeChange,
    AttendclasspageIndexChange,
    endCourse,                  //结束
    puaseCourse,                //停课
    waitForCourse,              //分班
    backPauseCourse,            //复原

    nokindaarr,
    NOorgKindArr,              //培训类orgId 合集

    routeChange,               //路由是否改变

}){
    let StuDetailProps  = {
        title       : '测试',
        visible     : routeChange ? false : isStuDetailVisible,
        headVisible : false,
        closable    : true,
        onOk        : onModalOK,
        onCancel    : onCancelModal,
        top         : 51, //距离浏览器上方距离(默认0)
        bottom      : 0,  //距离浏览器下方距离(默认0)
        height      : 'calc(100% - 51px)',
        footer      : "",
    }

    let StudetailTabProps = {
        studentDetailInfo ,
    };

    let StudentInfoDetailProps ={
        studentDetailInfo,
    };

    let SpenthourTabProp ={
        spenthourTabLoading,
		spenthourTabList,
		spenthourTabResultCount,
		spenthourTabPageSize,
		spenthourTabPageIndex,

		spenthourTabPageIndexChange,                               //已消耗课时记录列表
    };

    //详情属性
    let DetailProps = {
        studentDetailInfo,         //选中leads名单查看详情时当前人的信息
    }

    let ReservedsessionTabProp = {
        reservedsessionLoading,
		reservedsessionList,
		reservedsessionResultCount,
		reservedsessionPageIndex,
		reservedsessionPageSize,
		reservedsessionPageSizeChange,
		reservedsessionPageIndexChange
    }

    let CardTabTabProp = {
        cardTabList,                                    //会员卡列表
    }

	/*合同参数*/
	let ContractTabProps = {
		contractOrderList,
		contractOrderLoading,
		contractOrderResultCount,
		contractOrderPageIndex,
		contractOrderPageSize,
		contractOrderPageSizeChange,
		contractOrderPageIndexChange,

		addContractOrder
	}

	//约课记录参数
	let orderClassTabProps = {
		orderClassList,
		orderClassLoading,
		orderClassResultCount,
		orderClassPageIndex,
		orderClassPageSize,

		orderClassPageIndexChange,
	}

   	let ReservationProps = {

       leadsFollowReservationContentLoading,         //当前预约试听loading状态
       leadsFollowReservationContent,                //当前leads预约试听list
       leadsFollowReservationScrollFinish,           //滚动加载是否完成(即数据加载完毕)

       LeadsFollowReservationScrollBottom,           //leads预约试听已经滑动到最底部
       LeadsFollowReservationAddOrEditItem,          //leads预约试听新增编辑
       LeadsFollownewReservationChangeItemStatus,    //leads预约试听改变状态
   }

   let ParentTabProp ={
       parenttabList,
       addParent,
   }

   let VisitplanTabProp= {
       leadsFollowVisitingPlanContentLoading,      //当前到访计划loading状态
       leadsFollowVisitingPlanContent,             //当前leads到访计划list
       leadsFollowVisitingPlanScrollFinish,        //滚动加载是否完成(即数据加载完毕)

       LeadsFollowVisitingPlanScrollBottom,        //leads到访计划已经滑动到最底部
       LeadsFollowVisitingPlanAddOrEditItem,       //leads到访计划新增编辑
       LeadsFollowVisitingPlanChangeItemStatus,    //leads到访计划改变状态
   }

    //需要从员工详情中筛选并渲染的内容
    let expect = [
		{ label : '负责销售', value : 'sellerName' },
        { label : '负责顾问', value : 'counselorName' }
	];

    /*跟进记录*/
    //新增跟进记录属性
    var leadsFollowDetailLeadMessage =studentDetailInfo;

    var leadsFollowFollowRecordButtonLoading = false;
    var leadsFollowFastSearchFollowState = saleStatusList ;//跟进状态列表
	let AddFollowRecordProps = {
		leadsFollowDetailLeadMessage,           //选中leads名单查看详情时当前人的信息
		leadsFollowWay,                         //跟进方式
		leadsFollowFastSearchFollowState,       //快捷搜索栏跟进状态下拉列表内容，还可以用来格式化跟进状态
		leadsFollowFollowRecordButtonLoading,   //新增跟进记录发布按钮是否加载
		parentListArr, //学员家长id 姓名

		LeadsFollowFollowRecordAdd,             //新增跟进记录
	}

    //跟进记录列表属性
    let FollowRecordListProps = {
        leadsFollowFollowRecordContentLoading,  //当前跟进记录loading状态
        leadsFollowFollowRecordContent,         //当前leads跟进记录list
        leadsFollowFollowRecordScrollFinish,    //滚动加载是否完成(即数据加载完毕)

        LeadsFollowFollowRecordScrollBottom,    //leads跟进记录已经滑动到最底部
       // LeadsFollowFollowRecordEditItem,        //leads跟进记录编辑
        LeadsFollowFollowRecordDeleteItem,      //leads跟进记录删除
    }

    let ProductionTabProp ={
        ProductionList,     //作品列表
        updateStudentWork,  //修改作品
        deleteWork,         //删除作品
        ProductionNum,
        ProductionPageIndex,
        ProductionPageSize,
        uploadWorks,
    }

    let AttendclassTabProp= {
        AttendclassTabList,
        toJoinClass,            //报班
        classInfoLeft,
        classInfoTotal,
        AttendclassNum,
        AttendclassPageIndex,
        AttendclassPageSize,
        AttendclasspageSizeChange,
        AttendclasspageIndexChange,
        endCourse,       //结束
        puaseCourse,     //停课
        waitForCourse,   //分班
        backPauseCourse, //复原
    }

    //详情信息渲染
    function detailRender(expect,target){
        let arr = [];
        for(let i in expect){
            arr.push(
                <p key = { i }>
                    <span>{ expect[i].label }：</span>
                    <Popover placement = 'left' content = { !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' }>
                        { !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' }
                    </Popover>
                </p>
            )
        }
        return arr;
    }
    let detail = detailRender(expect,studentDetailInfo);

    let menu = (
        <Menu onClick={(e) => stuDetailMoreMenuChoose(e.key,studentDetailInfo)}>
            <Menu.Item key="trans_stu">转给他人</Menu.Item>
            <Menu.Item key="dele_stu">删除</Menu.Item>
            <Menu.Item key="list_record">名单转化记录</Menu.Item>
        </Menu>
    );

    let classinfro = '';
    let Arr =[];
    if (nokindaarr  && nokindaarr.length > 0){
        var one = "";
        var two  = "";
        nokindaarr.map(function (item) {
            if (item == studentDetailInfo.orgId ){
                one = '1';
            }else  {
                two ='2';
            }
        })
        if (one == 1){
            classinfro = false;
        }else {
            classinfro = true;
        }
    }else{
        window._init_data.orgIdList && window._init_data.orgIdList  != 'undefined' && window._init_data.orgIdList.map(function (item) {
            if (studentDetailInfo.orgId == item.orgId && item.orgKind == 1 ){
                classinfro =true; //早教类

            }
            if (item.orgKind == 1){
                //早教类
            }else  {
                Arr.push(item.orgId)  ;
            }
        });
        if ( Arr && Arr.length >0){
            NOorgKindArr(Arr);
        }
    }

    let IntroHeight = 0;

    if(document.getElementById('stu_manage_detail_message')){
        IntroHeight = document.getElementById('stu_manage_detail_message').clientHeight;
    }

    window.onresize = function(){
        if(document.getElementById('stu_manage_detail_message')){
            IntroHeight = document.getElementById('stu_manage_detail_message').clientHeight;
        }
    }

    let allHeight = 50 + IntroHeight + 47 ;     //最上面菜单的高度+信息的高度+tab的高度

    function isScrollToBottom(){
        let div = document.getElementById('stu_manage_follow_record_inner');
        //已经滚动到底部,且数据没有加载完毕时才发请求
        if(div.clientHeight + div.scrollTop >= div.scrollHeight && div.scrollTop > 0 && !leadsFollowFollowRecordScrollFinish){
            setTimeout(LeadsFollowFollowRecordScrollBottom,100);
        }
    }

    return(
        <NewModal {...StuDetailProps}>
            <div className={styles.zl_leads_detail_message} id='stu_manage_detail_message'>
                <div className={styles.leads_detail_message_top}>
                    <div className={styles.leads_detail_message_top_left}>
                        <img src='https://img.ishanshan.com/gimg/img/abde58fd2dc31461271d3bf6f3ee3259' className={styles.leads_detail_message_img}/>
                        <div className={styles.leads_detail_message_left}>
                            <Popover placement="left" trigger="hover" content = { leadsFollowDetailLeadMessage.name || '--' } >
                                { studentDetailInfo.name || '--' }
                            </Popover>
                        </div>
                    </div>
                    <div className={styles.leads_detail_message_top_right}>
                        <Button type = 'primary' style = {{ marginRight : 20 , width : 68 }} onClick = { edtionStu }>编辑</Button>
                        <ButtonGroup style = {{ marginRight : 20 , color : '#5d9cec' }} >
                            <Button className={styles.radio_button_group} onClick = {() => stuDetailMoreMenuChoose('trans_stu',studentDetailInfo)}>转给他人</Button>
                            <Button className={styles.radio_button_group} style = {{ width : 100 }} onClick = {() => stuDetailMoreMenuChoose('list_record',studentDetailInfo)}>名单转化记录</Button>
                            <Button className={styles.radio_button_group} style = {{ width : 60 }} onClick = {() => stuDetailMoreMenuChoose('dele_stu',studentDetailInfo)}>删除</Button>
                        </ButtonGroup>
                        <Icon type="close" onClick={onCancelModal}/>
                    </div>
                </div>
                <div className={styles.leads_detail_message_detail_message}>
                    { detail || [] }
                </div>
            </div>
            <Tabs onChange = { StuDetailModalTabChange } size = "small"  className={styles.studetail_message} activeKey = { changeTableTab } >
                <TabPane tab="学员详情" key="StuDetailTab">  <StudetailTab {...StudetailTabProps}/> </TabPane>
                {/*产品张洁说隐藏由于预约课时和约课记录重复，故隐藏预约课时*/}
                {/* classinfro ?
                    <TabPane tab={<span>已预约课时<span style={{color:'#5d9cec',fontSize:'12px'}}></span></span>} key="ReservedsessionTab">
                        <div className="stumanage_detail_content_item"> < ReservedsessionTab  {...ReservedsessionTabProp}/> </div>
                    </TabPane> :""
                */}
                { classinfro ?
                    <TabPane tab={<span>已消耗课时<span style={{color:'#5d9cec',fontSize:'12px'}}></span></span>} key = "SpenthourTab">
                        <div className="stumanage_detail_content_item">
                            <SpenthourTab { ...SpenthourTabProp } />
                        </div>
                    </TabPane>
                    : ""
                }
                <TabPane tab = { <span>约课记录<span style = {{ color:'#5d9cec', fontSize:'12px' }}></span></span> } key = "orderClassTab" >
                    <div className = 'stumanage_detail_content_item' >
                        <OrderClassTab { ...orderClassTabProps } />
                    </div>
                </TabPane>
                <TabPane  tab={<span>会员卡<span style={{color:'#5d9cec',fontSize:'12px'}}></span></span>}  key = "CardTab" >
                    <div className="stumanage_detail_content_item">
                        <VipCardTab { ...CardTabTabProp } />
                    </div>
                </TabPane>
                <TabPane  tab={<span>合同<span style={{color:'#5d9cec',fontSize:'12px'}}></span></span>}  key = "ContractTab" >
                    <div className = 'stumanage_detail_content_item' >
                        <ContractTab { ...ContractTabProps } />
                    </div>
                </TabPane>
                <TabPane  tab={<span>到访记录<span style={{color:'#5d9cec',fontSize:'12px'}}></span></span>} key = "VisitplanTab">
                    <VisitplanTab { ... VisitplanTabProp} />
                </TabPane>
                <TabPane tab={<span>跟进记录<span style={{color:'#5d9cec',fontSize:'12px'}}></span></span>} key="FollowRecordTab">
                    <div className={styles.leads_follow_record_inner} id = 'stu_manage_follow_record_inner' onScroll={ isScrollToBottom } style= {{height:`calc(100vh - ${allHeight}px)`}}>
                        <AddFollowRecord {...AddFollowRecordProps}/>
                        <FollowRecordList {...FollowRecordListProps}/>
                    </div>
                </TabPane>
                <TabPane tab={<span>预约试听<span style={{color:'#5d9cec',fontSize:'12px'}}></span></span>} key="OfflineTab">
                    <OfflineTab {...ReservationProps}/>
                </TabPane>
                <TabPane tab={<span>家长<span style={{color:'#5d9cec',fontSize:'12px'}}></span></span>} key="ParentTab">
                    <div className="stumanage_detail_content_item"><ParentTab  {...ParentTabProp }/></div>
                </TabPane>
                <TabPane tab={<span>作品<span style={{color:'#5d9cec',fontSize:'12px'}}></span></span>} key="ProductionTab">
                    <ProductionTab  {...ProductionTabProp }/>
                </TabPane>
                {
                    classinfro ?  "" : <TabPane tab={'报班信息'} key="AttendclassTab">
                        <AttendclassTab  {...AttendclassTabProp }/>
                    </TabPane>
                }
            </Tabs>
        </NewModal>
    );

    // <TabPane tab={<span>预约试听<span style={{color:'#5d9cec'}}>（{ leadsFollowReservationNum }）</span></span>} key="4">
    //     <Reservation {...ReservationProps}/>
    // </TabPane>
}

export default StuDetail ;


