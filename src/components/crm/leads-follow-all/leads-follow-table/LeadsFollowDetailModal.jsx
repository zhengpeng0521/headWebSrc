import React from 'react';
import Media from 'react-media';
import { Button , Form , Input , Tabs , Select , Icon , Dropdown , Menu , Popover , Radio } from 'antd';
import { NewModal } from '../../../common/new-component/NewComponent';
import Detail from './LeadsFollowDetailInner/Detail';                                                   //详细信息
import AddFollowRecord from './LeadsFollowFollowRecordInner/AddOrEditFollowRecord/AddFollowRecord';     //新增跟进记录
import FollowRecordList from './LeadsFollowFollowRecordInner/FollowRecordList/FollowRecordList';        //跟进记录列表
import VisitingPlan from './LeadsFollowVisitingPlanInner/VisitingPlanList/VisitingPlan';                //到访记录
import Reservation from './LeadsFollowReservationInner/ReservationList/Reservation';                    //预约试听
import styles from './LeadsFollowDetailModal.less';
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

/*详情*/
function LeadsFollowDetailModal({
    leadsFollowType,                        //全部leads(all),我的leads(my),公海池(public),回收站(recycle)
    leadsFollowDetailModalVisible,          //划入框是否显示
    leadsFollowDetailModalTabKey,           //tab项索引
    leadsFollowDetailLeadMessage,           //选中leads名单查看详情时当前人的信息

    LeadsFollowDetailOnEdit,                //leads详情点击编辑
    LeadsFollowDetailMoreMenuChoose,        //详情内编辑右边转给他人，退回公海，放入回收站事件
    LeadsFollowDetailModalTabChange,        //详情内tab的onChange事件
    LeadsFollowDetailModalCancel,           //详情划入框关闭

    //跟进记录
    leadsFollowWay,                         //跟进方式
    leadsFollowFastSearchFollowState,       //快捷搜索栏跟进状态下拉列表内容，还可以用来格式化跟进状态
    leadsFollowFollowRecordNum,             //跟进记录条数
    leadsFollowFollowRecordButtonLoading,   //新增跟进记录发布按钮是否加载
    leadsFollowFollowRecordContentLoading,  //当前跟进记录loading状态
    leadsFollowFollowRecordContent,         //当前leads跟进记录list
    leadsFollowFollowRecordScrollFinish,    //滚动加载是否完成(即数据加载完毕)

    LeadsFollowFollowRecordAdd,             //新增跟进记录
    SmallSereenAddFollowRecord,             //小屏点击新增跟进记录
    LeadsFollowFollowRecordScrollBottom,    //leads跟进记录已经滑动到最底部
    LeadsFollowFollowRecordEditItem,        //leads跟进记录编辑
    LeadsFollowFollowRecordDeleteItem,      //leads跟进记录删除

    //到访计划
    leadsFollowVisitingPlanNum,                 //到访计划条数
    leadsFollowVisitingPlanContentLoading,      //当前到访计划loading状态
    leadsFollowVisitingPlanContent,             //当前leads到访计划list
    leadsFollowVisitingPlanScrollFinish,        //滚动加载是否完成(即数据加载完毕)

    LeadsFollowVisitingPlanScrollBottom,        //leads到访计划已经滑动到最底部
    LeadsFollowVisitingPlanAddOrEditItem,       //leads到访计划新增编辑
    LeadsFollowVisitingPlanChangeItemStatus,    //leads到访计划改变状态

    //预约试听
    leadsFollowReservationNum,                          //预约试听条数
    leadsFollowReservationContentLoading,               //当前预约试听列表loading状态
    leadsFollowReservationContent,                      //当前leads预约试听list
    leadsFollowReservationScrollFinish,                 //滚动加载是否完成(即数据加载完毕)

    LeadsFollowReservationScrollBottom,                 //leads预约试听已经滑动到最底部
    LeadsFollowReservationAddOrEditItem,                //leads预约试听新增编辑
    LeadsFollowReservationChangeItemStatus,             //leads预约试听改变状态

}){

    //详情属性
    let DetailProps = {
        leadsFollowDetailLeadMessage,          //选中leads名单查看详情时当前人的信息
    }

    /*跟进记录*/
        //新增跟进记录属性
        let AddFollowRecordProps = {
            leadsFollowDetailLeadMessage,           //选中leads名单查看详情时当前人的信息
            leadsFollowWay,                         //跟进方式
            leadsFollowFastSearchFollowState,       //快捷搜索栏跟进状态下拉列表内容，还可以用来格式化跟进状态
            leadsFollowFollowRecordButtonLoading,   //新增跟进记录发布按钮是否加载

            LeadsFollowFollowRecordAdd,             //新增跟进记录
        }

        //跟进记录列表属性
        let FollowRecordListProps = {
            leadsFollowFollowRecordContentLoading,  //当前跟进记录loading状态
            leadsFollowFollowRecordContent,         //当前leads跟进记录list
            leadsFollowFollowRecordScrollFinish,    //滚动加载是否完成(即数据加载完毕)

            LeadsFollowFollowRecordScrollBottom,    //leads跟进记录已经滑动到最底部
            LeadsFollowFollowRecordEditItem,        //leads跟进记录编辑
            LeadsFollowFollowRecordDeleteItem,      //leads跟进记录删除
        }

    //到访计划属性
    let VisitingPlanProps = {
        leadsFollowVisitingPlanContentLoading,      //当前到访计划loading状态
        leadsFollowVisitingPlanContent,             //当前leads到访计划list
        leadsFollowVisitingPlanScrollFinish,        //滚动加载是否完成(即数据加载完毕)

        LeadsFollowVisitingPlanScrollBottom,        //leads到访计划已经滑动到最底部
        LeadsFollowVisitingPlanAddOrEditItem,       //leads到访计划新增编辑
        LeadsFollowVisitingPlanChangeItemStatus,    //leads到访计划改变状态
    }

    //预约试听属性
    let ReservationProps = {
        leadsFollowDetailLeadMessage,               //选中leads名单查看详情时当前人的信息
        leadsFollowReservationContentLoading,       //当前预约试听列表loading状态
        leadsFollowReservationContent,              //当前leads预约试听list
        leadsFollowReservationScrollFinish,         //滚动加载是否完成(即数据加载完毕)

        LeadsFollowReservationScrollBottom,        //leads预约试听已经滑动到最底部
        LeadsFollowReservationAddOrEditItem,       //leads预约试听新增编辑
        LeadsFollowReservationChangeItemStatus,    //leads预约试听改变状态
    }

    //需要从员工详情中筛选并渲染的内容
    let expect = [{label:'最后跟进时间',value:'followRecordTime'},
                  {label:'下次跟进时间',value:'nextFollowTime'},
                  {label:'负责销售',value:'sellerName'},
                  {label:'跟进状态',value:'studentFollowState'}];

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

    let detail = detailRender(expect,leadsFollowDetailLeadMessage);

    let NewModalProps = {
        visible : leadsFollowDetailModalVisible,
        headVisible : false,
        closable : true,
        onCancel : LeadsFollowDetailModalCancel,
        footer : '',
    }

    let menu = (
        <Menu onClick={(e) => LeadsFollowDetailMoreMenuChoose(e.key,leadsFollowDetailLeadMessage)}>
            <Menu.Item key="put_recycle">删除</Menu.Item>
        </Menu>
    );

    let IntroHeight = 0;

    if(document.getElementById('leads_detail_message')){
        IntroHeight = document.getElementById('leads_detail_message').clientHeight;
    }

    window.onresize = function(){
        if(document.getElementById('leads_detail_message')){
            IntroHeight = document.getElementById('leads_detail_message').clientHeight;
        }
    }

    let allHeight = 50 + IntroHeight + 47 ;     //最上面菜单的高度+信息的高度+tab的高度

    function isScrollToBottom(){
        let div = document.getElementById('leads_follow_record_inner');
        //已经滚动到底部,且数据没有加载完毕时才发请求
        if(div.clientHeight + div.scrollTop >= div.scrollHeight && div.scrollTop > 0 && !leadsFollowFollowRecordScrollFinish){
            setTimeout(LeadsFollowFollowRecordScrollBottom,100);
        }
    }

    return(
        <NewModal {...NewModalProps}>
            <div className={styles.leads_detail_message} id='leads_detail_message'>
                <div className={styles.leads_detail_message_top}>
                    <div className={styles.leads_detail_message_top_left}>
                        <img src='https://img.ishanshan.com/gimg/img/abde58fd2dc31461271d3bf6f3ee3259' className={styles.leads_detail_message_img}/>
                        <div className={styles.leads_detail_message_left}>
                            <Popover placement="left" trigger="hover" content = { leadsFollowDetailLeadMessage.name || '--' } >
                                { leadsFollowDetailLeadMessage.name || '--' }
                            </Popover>
                        </div>
                    </div>
                    <div className={styles.leads_detail_message_top_right}>
                        <Button type = 'primary' style = {{ marginRight : 20 , width : 68 }} onClick = { LeadsFollowDetailOnEdit }>编辑</Button>
                        <ButtonGroup style = {{ marginRight : 20 , color : '#5d9cec' }} >
                            <Button className={styles.radio_button_group} onClick = {() => LeadsFollowDetailMoreMenuChoose('transform_stu',leadsFollowDetailLeadMessage)}>转为学员</Button>
                            { leadsFollowType != 'public' ?
                                <Button className={styles.radio_button_group} onClick = {() => LeadsFollowDetailMoreMenuChoose('send_other',leadsFollowDetailLeadMessage)}>转给他人</Button>
                                : null
                            }
                            { leadsFollowType != 'public' ?
                                <Button className={styles.radio_button_group} onClick = {() => LeadsFollowDetailMoreMenuChoose('back_public',leadsFollowDetailLeadMessage)}>退回公海</Button>
                                : null
                            }
                            { leadsFollowType == 'public' ?
                                <Button className={styles.radio_button_group} style = {{ width : 60 }} onClick = {() => LeadsFollowDetailMoreMenuChoose('put_recycle',leadsFollowDetailLeadMessage)}>删除</Button>
                                : null
                            }
                            { leadsFollowType != 'public' ?
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Button className={styles.radio_button_group_more}>
                                        <Icon type="caret-down" style = {{ fontSize : '1rem' , transform : 'scale(0.7)' }} />
                                    </Button>
                                </Dropdown> : null
                            }
                        </ButtonGroup>
                        <Icon type="close" onClick={LeadsFollowDetailModalCancel}/>
                    </div>
                </div>
                <div className={styles.leads_detail_message_detail_message}>
                    { detail || [] }
                </div>
            </div>
            <Tabs onChange = { LeadsFollowDetailModalTabChange } size = "small" activeKey = { leadsFollowDetailModalTabKey }>
                <TabPane tab="详细信息" key="1">
                    <Detail {...DetailProps}/>
                </TabPane>
                <TabPane tab={<span>跟进记录<span style={{color:'#5d9cec',fontSize:'12px'}}>({ leadsFollowFollowRecordNum })</span></span>} key="2">
                    <div className={styles.leads_follow_record_inner} id = 'leads_follow_record_inner' onScroll={ isScrollToBottom } style= {{height:`calc(100vh - ${allHeight}px)`}}>
                        <AddFollowRecord {...AddFollowRecordProps}/>
                        <FollowRecordList {...FollowRecordListProps}/>
                    </div>
                </TabPane>
                <TabPane tab={<span>到访计划<span style={{color:'#5d9cec',fontSize:'12px'}}>({ leadsFollowVisitingPlanNum })</span></span>} key="3">
                    <VisitingPlan {...VisitingPlanProps}/>
                </TabPane>
                <TabPane tab={<span>预约试听<span style={{color:'#5d9cec',fontSize:'12px'}}>({ leadsFollowReservationNum })</span></span>} key="4">
                    <Reservation {...ReservationProps}/>
                </TabPane>
            </Tabs>
        </NewModal>
    );
}

export default LeadsFollowDetailModal;
